#!/usr/bin/env python3
import argparse
import requests
import time
import json
import random
from calendar import monthrange
import random
import pprint
pp = pprint.PrettyPrinter(depth=4)
from datetime import datetime,timezone
import os

def remove_newlines(text):
    text = text.replace('\n', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    return text

def graphql_query(database_url, query, variables="{}"):
    print("\nQuery :\n\n" + query + "\n===================\n")
    # print("Variables :\n\n" + variables + "\n===================\n")

    query = remove_newlines(query)
    variables = remove_newlines(variables)
    variables = json.loads(variables)
    myjson={"query": query, "variables": variables}
    
    return_data = ""
    # print(myjson)
    try:
        r = requests.post(database_url, json=myjson)
        return_data = r.json()
        # print(r)
        # print(r.headers)
        # print(json.dumps(r.json(), indent=2))
    except requests.exceptions.ConnectionError as e:
        print(e)
        # print(json.dumps(r.json(), indent=2))
    except json.decoder.JSONDecodeError as e:
        print(e)
    
    return return_data

def query_dno(dno_url):

    is_OK = 1 # 0 is no data, 1 is query failed and 2 is query succeeded

    # GraphQL
    dno_url = dno_url.removesuffix('/') + "/cardano-graphql" 
    
    query = """query { cardano
    { tip 
        { number slotNo epoch
            { number }
        }
    }  
}
    """

    r = graphql_query(dno_url, query)
    if type(r) == dict:
        if "slotNo" in r["data"]["cardano"]["tip"]:
            is_OK = 2

    # koios   
    print(dno_url + "\t\t" + str(is_OK))
    return is_OK

def testing_query_dno(dno_url):
    return random.randint(1, 2)

def get_dno_data(governance_url, month):

    query = """query { 
    queryDno { 
        preprodWallet
        services { 
            network
            subnet
            url
            uptime(filter: { month: { eq: %d }}) {
                id
            }
        }
    }
}         
    """ % (month)

    r = graphql_query(governance_url, query)

    # print("\nResult ===================")
    # print(r)

    if type(r) == dict:
        #print(r)
        dno_datas = r["data"]["queryDno"]

    # node_urls = []

    # for dno_data in dno_datas:
    #     preprodWallet = dno_data["preprodWallet"]
    #     preprodUrl = dno_data["preprodUrl"]
    #     mainentUrl = dno_data["mainnetUrl"]
    #     node_url = { "preprodWallet": preprodWallet, "preprod": preprodUrl , "mainnet": mainentUrl}   
    #     node_urls.append(node_url)
    
    return dno_datas

def set_empty_month():
    month = int(datetime.now(timezone.utc).strftime('%m'))
    year = int(datetime.now(timezone.utc).strftime('%Y'))
    
    length = monthrange(year, month)[1]
    empty_month_array = "0" * length

    return empty_month_array

def fill_mock_data(governance_url):

    
    query = """mutation {
  addDno(
    input: [
      {
        name: "Maarten M | M2tec",
        preprodWallet: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt",
        mainnetWallet: "$m2tec",
        services: [
          { 
            network: CARDANO
            subnet: PREPROD
            tag: GRAPHQL
            url: "https://preprod-sunflower.m2tec.nl/"
          },
          { 
            network: CARDANO
            subnet: MAINNET
            tag: GRAPHQL
            url: "https://mainnet-sunflower.m2tec.nl/"
          }
        ]
      },
      {
        name: "q",
        preprodWallet: "addr_test1qq4gyf6jalkh0p5uvnuvjdnspzulzyzm79antq42zduvlgddqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q5t4dpq",
        mainnetWallet: "$quasar"
      }
      {
        name: "PEACEpool dandeli0n",
        preprodWallet: "addr_test1qqs96h3jdydyeplsvampynrh7fwy4txr4kp2mu4pxf7xzqadqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6qkr75h0",
        mainnetWallet: "addr1qxyh3m7vwdw79rw97m0lghjxhhk9pjmsn6dfe2ms2m043ppvrzdp4wcghqx83fez83rz9t0lzjtqn3ug5ujnuugq4jpq39tkw2",
        services: [
          { 
            network: CARDANO
            subnet: PREPROD
            tag: GRAPHQL
            url: "https://preprod-lite.dandelion.link/"
          },
          { 
            network: CARDANO
            subnet: MAINNET
            tag: GRAPHQL
            url: "https://mainnet-lite.dandelion.link/"
          }
        ]
      }
    ]
    upsert: true
  ) {
    dno {
      id
      name
      preprodWallet
    }
  }
}""" 



    r = graphql_query(governance_url, query)
    print(r)

def update_uptime_today(governance_url, uptime_id, result):
    print("update uptime")
    
    # Get uptime data 
    query = """query {
        queryUptime(
            filter: { id: "%s"}) {
                days
            }
        }
    """ % (uptime_id)
    
    print(query)

    r = graphql_query(governance_url, query)    

    uptime_data = r["data"]["queryUptime"][0]
    print(uptime_data)

    if uptime_data["days"] == "0":
        uptimes = set_empty_month()
        
        print(uptimes)
    else:
        uptimes = uptime_data["days"]

    uptimesArray = list(uptimes)
    
    print(uptimesArray)

    day = int(datetime.now(timezone.utc).strftime('%d'))
    print(uptimesArray[day-1])
    uptimesArray[day-1] = str(result)

    uptimes = "".join(uptimesArray)

    print(uptimes)

    # Store the result 
    query = """mutation updateUptime($patch: UpdateUptimeInput!) {
        updateUptime(input: $patch) {
            uptime {
            month
            days
            }
        }
        }"""

    variables = """
        {
        "patch": {
            "filter": {
            "id": [
                "%s"
            ]
            },
            "set": {
            "days": "%s"
            }
        }
        }
        """ % (uptime_id, uptimes)
    
    # print(query)

    r = graphql_query(governance_url, query, variables)
    print("### Result")
    print(r)

def main():
    # governance_url = "http://dgraph.m2tec.nl/graphql"
    # governance_url = "http://localhost:28080/graphql"
    # dno_url = "https://preprod-sunflower.m2tec.nl/cardano-graphql"
    # preprodWallet = "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"
    

    try:  
        governance_url = os.environ['VITE_GRAPH_URL'].replace('"', '')
        print("VITE_GRAPH_URL: " + governance_url)
    except KeyError: 
        print("VITE_GRAPH_URL not set")
    

    parser = argparse.ArgumentParser(description="Monitor Dandelion node uptime.")
    parser.add_argument("env",  nargs='?', default=".env.development", help="Provide the environment file (e.g., .env.development)")
    args = parser.parse_args()

    environment_file = args.env
    # print(environment_file)

    # Open the file and read its content.
    try:
        with open(environment_file) as f:
            content = f.readlines()
        environment_data = {}
        for line in content:
            variable = line.split('=', 1)[0]
            value = line.split('=', 1)[1].replace('\n', '').replace('"', '')

            environment_data[variable] = value
            # print(environment_data)
    
            governance_url = environment_data['VITE_GRAPH_URL']

    except FileNotFoundError:
        print("No .env.developement file ")
    # Display the file's content line by line.

    month = int(datetime.now(timezone.utc).strftime('%m'))
    dno_data = get_dno_data(governance_url, month)
    
    # print("\n")
    pp.pprint(dno_data)   
    # print("\n\n")
    
    for dno in dno_data:
        if dno["services"][0] != None:
            for service in dno["services"]:

                if service["subnet"] == "PREPROD": 
                
                    print(service)
                    uptime_id = service["uptime"][0]["id"]
                    print(uptime_id)
                    
                    if service["url"] == "":
                        print("No URL provided")                    
                    else:
                        result = query_dno(service["url"])
                    
                        print("Service state: " + str(result))
                        #result = query_dno("https://preprod-sunflower.m2tec.nl/")
                        update_uptime_today(governance_url, uptime_id, result)

                if service["subnet"] == "MAINNET": 
                
                    print(service)
                    uptime_id = service["uptime"][0]["id"]
                    print(uptime_id)
                    if service["url"] == "":
                        print("No URL provided")
                    else:
                        result = query_dno(service["url"])
                        #result = query_dno("https://mainnet-sunflower.m2tec.nl/")
                        print("Service state: " + str(result))

                    update_uptime_today(governance_url, uptime_id, result)

    
    #fill_mock_data(governance_url)

    def cycle_fill_uptime_data():
        for month in range(1,4):

            length = monthrange(2025, month)[1]

            for day in range(1,length+1):
                result = testing_query_dno(dno_url="test")
                #update_uptime_today(governance_url, preprodWallet, month, day, result)
                
                time.sleep(2)


if __name__ == "__main__":
    main()
