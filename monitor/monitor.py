#!/usr/bin/env python3
import argparse
import traceback
import requests
import time
import json
import random

def remove_newlines(text):
    text = text.replace('', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    return text

def graphql_query(database_url, query, variables):
    print(query)
    query = remove_newlines(query)
    variables = remove_newlines(variables)
    myjson={"query": query, "variables": variables}
    print(myjson)
    try:
        r = requests.post(database_url, json={"query": query, "variables": variables})
        print(r)
        print(json.dumps(r.json(), indent=2))
    except requests.exceptions.ConnectionError as e:
        print(e)
        # print(json.dumps(r.json(), indent=2))
    except json.decoder.JSONDecodeError as e:
        print(e)
    
    return r.json()

def query_dno(dno_url):

    dno_url = dno_url.removesuffix('/') + "/cardano-graphql" 
    print("\nQuery dno at: " + dno_url)
    print("\nQuery tip:")
    
    # Query Dando node 
    query = """query { cardano
    { tip 
        { number slotNo epoch
            { number }
        }
    }  
}
    """


    r = graphql_query(dno_url, query)
    print(r)

    return True

def query_governance(dno_url):
    print(dno_url)
    print("\nQuery tip:\n")
    
    query = """query { 
    queryDno { 
        name
        preprodWallet
        preprodUrl
        preprodUptime
      	mainnetUrl
        mainnetUptime
    }
}         
    """

    r = graphql_query(dno_url, query)

    dno_datas = r["data"]["queryDno"]

    node_urls = []

    for dno_data in dno_datas:
        preprodWallet = dno_data["preprodWallet"]
        preprodUrl = dno_data["preprodUrl"]
        mainentUrl = dno_data["mainnetUrl"]
        node_url = { "preprodWallet": preprodWallet, "preprod": preprodUrl , "mainnet": mainentUrl}   
        node_urls.append(node_url)
    
    return node_urls

def uptimes_month():
    uptimes = ""
    for i in range(0, 30):
        result = random.randint(0, 1)
        uptimes = uptimes + str(result)

    return uptimes


def update_uptime(governance_url, preprodWallet):
    print("update uptime")
    
    uptimes = []
    for i in range(0, 2):
        uptime = uptimes_month()
        uptimes.append(uptime)

    print(uptimes)

    # query = """mutation {{ addDno(input: [
    #   {{    
    #   preprodWallet: "{preprodWallet}",
    #   preprodUptime: "{uptimes}"
    #   }}], upsert: false)
    #   {{
    #       dno {{
    #       id
    #       name
    #       preprodWallet
    #       preprodUptime         
    #       }}
    #   }}
    #   }}
    # """.format(preprodWallet=preprodWallet, uptimes=uptimes)

    query = """mutation updateDno( $patch:  UpdateDnoInput!) {
  	updateDno(input: $patch) {
    dno {
      preprodWallet
      pUptime
        }
    }
    }"""
    
    variables = """
{{
  "patch": {{
    "filter": {{
      "preprodWallet": {{"eq": "{preprodWallet}"}}}},
    "set": {{
      "pUptime": {uptimes}
    }}
  }}
}}""".format(preprodWallet=preprodWallet, uptimes=uptimes)



    print(query)

    r = graphql_query(governance_url, query, variables)

def main():
    # parser = argparse.ArgumentParser(description="Update GraphQL schema on a Dgraph server.")
    # parser.add_argument("gov_url", help="Dando governance database URL (e.g., http://alpha:8080/graphql)")

    # args = parser.parse_args()
    governance_url = "http://localhost:28080/graphql"
    # dno_url = "https://preprod-sunflower.m2tec.nl/cardano-graphql"

    preprodWallet = "addr_test1qpx2egjz2f3kknme2hymcxa46v22th5ht8t82saus228amts4jafwx022df7r4c0x9gcqcctcxd4yxtuft8yxmsjqcuqc3f5tg"
    update_uptime(governance_url, preprodWallet)
    # dno_urls = query_governance(governance_url)
    # print(dno_urls)

    # for dno_url in dno_urls:
    #     dno_url["preprod"]
    #     print(dno_url)

    # dno_healty = query_dno(dno_url)

    # if (dno_healty):
    #     print("He is good")


if __name__ == "__main__":
    main()
