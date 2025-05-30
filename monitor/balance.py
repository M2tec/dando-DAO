#!/usr/bin/env python3
import os
import requests
import json
from calendar import monthrange
import pprint
pp = pprint.PrettyPrinter(depth=4)
from datetime import datetime,timezone
import os
import logging

# Setting up the logger
logger = logging.getLogger("monitor")
logger.setLevel(logging.INFO)


def remove_newlines(text):
    text = text.replace('\n', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    return text

def graphql_query(database_url, query, variables="{}"):
    logger.debug("\nQuery :\n\n" + query + "\n===================\n")
    logger.debug("Variables :\n\n" + variables + "\n===================\n")

    query = remove_newlines(query)
    variables = remove_newlines(variables)
    variables = json.loads(variables)

    myjson={"query": query , "variables": variables}
    return_data = ""
    return_code = ""
    try:
        r = requests.post(database_url, json=myjson, timeout=2)
        logger.debug("Status: " + repr(r.status_code))
        logger.debug("graphql_query: " + r.text)
        return_code = r.status_code
        return_data = r.json()      
        
        # print(str(r.text))
        # print(r.headers)
        # print(json.dumps(r.json(), indent=2))
    except requests.exceptions.ConnectionError as e:
        logger.info("graphql_query: Connection error: " + str(e))
        # print(e)
        # print(json.dumps(r.json(), indent=2))
    except json.decoder.JSONDecodeError as e:
        #logger.info("graphql_query: JSON decode error " + str(e))
        pass
    except requests.exceptions.MissingSchema as e:
        logger.info("MissingSchema error: " + str(e))
    except requests.exceptions.ReadTimeout as e:
        logger.info("Timedout, service not available: " + str(e))
        return_code = "Timeout"

    return_value = {"return_code": return_code, "return_data": return_data }
    # print("Returncode: " + str(return_code))
    return return_value

# curl https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr1qxqs59lphg8g6qndelq8xwqn60ag3aeyfcp33c2kdp46a09re5df3pzwwmyq946axfcejy5n4x0y99wqpgtp2gd0k09qsgy6pz \
#   --header 'Project_id: YOUR_SECRET_TOKEN'

def query_blockfrost(endpoint, data):

    blockfrost_url = "https://cardano-mainnet.blockfrost.io/api/v0/"
    project_id = "mainnetvEPZ0CXhcpnTQ9vKHZR1AewW2rVOQOzq"
    print(blockfrost_url)
    print(endpoint)
    print(data)

    url = blockfrost_url + endpoint + "/" + data
    print("Url: " + url)

    headers = {'Project_id': project_id}

    return_data = ""
    return_code = ""
    try:
        r = requests.get(url, headers=headers, timeout=5)
        logger.debug("Status: " + repr(r.status_code))
        logger.debug("graphql_query: " + r.text)
        return_code = r.status_code
        return_data = r.json()      
        
        # print(str(r.text))
        # print(r.headers)
        # print(json.dumps(r.json(), indent=2))
    except requests.exceptions.ConnectionError as e:
        logger.info("graphql_query: Connection error: " + str(e))
        # print(e)
        # print(json.dumps(r.json(), indent=2))
    except json.decoder.JSONDecodeError as e:
        #logger.info("graphql_query: JSON decode error " + str(e))
        pass
    except requests.exceptions.MissingSchema as e:
        logger.info("MissingSchema error: " + str(e))
    except requests.exceptions.ReadTimeout as e:
        logger.info("Timedout, service not available: " + str(e))
        return_code = "Timeout"

    return_value = {"return_code": return_code, "return_data": return_data }
    # print("Returncode: " + str(return_code))
    return return_value

def set_balance(governance_url, balance_M1, balance_M2):
    query = """mutation AddBalances($balances: [AddBalanceInput!]!) {
            addBalance(input: $balances, upsert: true) {
                balance {
                id
                milestone
                value
                }
            }
            } """


    variables = {
        "balances": [
            {
                "milestone": 1,
                "value": balance_M1
            },
            {
                "milestone": 2,
                "value": balance_M2
            }
        ]
    }

    print(str(variables))
    r = graphql_query(governance_url, query, json.dumps(variables))

def main():
    governance_url = "http://localhost:28080/graphql"

    governance_url = os.getenv("VITE_GRAPH_URL")
    print("VITE_GRAPH_URL ".ljust(25)+ " : " + governance_url)

    address_M1 = 'addr1q8qesjzgykx08669mh478h57xucd3keh2l0xtd845ffj9ltpyr20dsq5g2mfkqs26728x2r6t2a5zjmz5m8da258mhrsuve58r'
    address_M1_data = query_blockfrost("addresses", address_M1)
    # print("M1: " + repr(address_M1_data))
    qty1 = int(address_M1_data["return_data"]["amount"][0]["quantity"])
    balance1 = qty1 / 1000000

    address_M2 = 'addr1qyf6dew2e0sr5e64m75qsj93sxqql6psnxfqtshkajvng92z6d8h9ph2rdhd960pd029pkez6n46rl833l75u9ew80dsv4yxfw'
    address_M2_data = query_blockfrost("addresses", address_M2)
    # print("M2: " + repr(address_M2_data))
    qty2 = int(address_M2_data["return_data"]["amount"][0]["quantity"])   
    balance2 = qty2 / 1000000

    set_balance(governance_url, balance1, balance2 )


if __name__ == "__main__":
    main()