#!/usr/bin/env python3
import argparse
import traceback
import requests
import time
import json
import random
from calendar import monthrange
import random

def remove_newlines(text):
    text = text.replace('\n', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    return text

def graphql_query(database_url, query, variables="{}"):
    # print("\nQuery :\n\n" + query + "\n===================\n")
    # print("Variables :\n\n" + variables + "\n===================\n")

    query = remove_newlines(query)
    variables = remove_newlines(variables)
    variables = json.loads(variables)
    myjson={"query": query, "variables": variables}
    
    print(myjson)
    try:
        r = requests.post(database_url, json=myjson)
        print(r)
        print(r.headers)
        print(json.dumps(r.json(), indent=2))
    except requests.exceptions.ConnectionError as e:
        print(e)
        # print(json.dumps(r.json(), indent=2))
    except json.decoder.JSONDecodeError as e:
        print(e)
    
    return r.json()

def query_dno(dno_url):

    # GraphQL
    dno_url = dno_url.removesuffix('/') + "/cardano-graphql" 
    print("\nQuery dno at: " + dno_url)
    print("\nQuery tip:")
    
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

    # koios 

    return True

def testing_query_dno(dno_url):
    return random.randint(1, 2)


def query_governance(dno_url):
    print(dno_url)
    print("\nQuery tip:\n")
    
    query = """query { 
    queryDno { 
        name
        preprodWallet
        mainnetWallet
        preprodUrl
        preprodUptime
      	mainnetUrl
        mainnetUptime
    }
}         
    """

    r = graphql_query(dno_url, query)

    print(r)

    dno_datas = r["data"]["queryDno"]

    node_urls = []

    for dno_data in dno_datas:
        preprodWallet = dno_data["preprodWallet"]
        preprodUrl = dno_data["preprodUrl"]
        mainentUrl = dno_data["mainnetUrl"]
        node_url = { "preprodWallet": preprodWallet, "preprod": preprodUrl , "mainnet": mainentUrl}   
        node_urls.append(node_url)
    
    return node_urls

def uptimes_month(i):

    current_day = 1

    empty_month_array = ""

    if current_day == 1:

        
        length = monthrange(2025, i)[1]
        print(length)
        empty_month_array = "0" * length

    uptimes = list(empty_month_array)
    
    for i in range(0, length - 15):
        result = random.randint(1, 2)

        uptimes[i] = str(result)

    print(uptimes)
    uptimes = "".join(uptimes)
    return uptimes


def update_puptime(governance_url, preprodWallet):
    print("update uptime")
    
    uptimes = []
    for i in range(0, 3):
        uptime = uptimes_month()
        uptimes.append(uptime)

    print(uptimes)

    query = """mutation updateDno( $patch:  UpdateDnoInput!) {
  	updateDno(input: $patch) {
    dno {
      preprodWallet
      pUptime
        }
    }
    }"""
    
    uptimes = str(uptimes).replace("\'", "\"") 

    variables = """
    {
    "patch": {
        "filter": {
        "preprodWallet": {"eq": "%s"}},
        "set": {
        "pUptime": %s}
        }
    }
    }""" % (preprodWallet, uptimes)

    r = graphql_query(governance_url, query, variables)

def update_preprod_uptime(governance_url, preprodWallet, month, day):
    print("update uptime")
    
    uptimes = []
    for i in range(1, 4):
        uptime = uptimes_month(i)
        uptimes.append(uptime)

    print(uptimes)

    query = """mutation {
  addUptime(
    input: [
      {dno:{      
        preprodWallet: "%s"}
        month: %s, 
            days: "%s"}]
    upsert: true
  ) {
    uptime {
        month
        days
      }
    }
  }""" % (preprodWallet, month, uptimes[0])




    r = graphql_query(governance_url, query)
    print(r)

def set_empty_month(governance_url, preprodWallet, month):

    length = monthrange(2025, month)[1]
    print(length)
    empty_month_array = "0" * length

    query = """mutation {
        addUptime(
            input: [
            {dno:{      
                preprodWallet: "%s"}
                month: %s, 
                    days: "%s"}]
            upsert: true
        ) {
            uptime {
                month
                days
            }
            }
        }""" % (preprodWallet, month, empty_month_array)




    r = graphql_query(governance_url, query)
    print(r)

    return empty_month_array
    


def update_preprod_uptime_today(governance_url, preprodWallet, month, day, result):
    print("month:" + str(month))
    print("day:" + str(day))
    print("update uptime")
    
    if day == 1:
        length = monthrange(2025, month)[1]
        print(length)
        empty_month_array = "0" * length


    query = """query { 
    queryDno { 
        id 
        name 
        preprodWallet
        preprodUptime { month, days}
    }
    }"""

    r = graphql_query(governance_url, query)

    preprodUptime = r["data"]["queryDno"][0]["preprodUptime"]
    print(preprodUptime)

    uptimes = ""

    if len(preprodUptime) == 0:
        empty_day_array = set_empty_month(governance_url, preprodWallet, month)
        uptimes = empty_day_array


    print("p" + str(preprodUptime))
    print(month)

    for monthdata in preprodUptime:
        print(monthdata)
        if monthdata["month"] == month:
            print("it is : " + str(month))
            uptimes = list(monthdata["days"])


    
    uptimes[day-1] = str(result)

    uptimes = "".join(uptimes)

    print(uptimes)

    query = """mutation {
  addUptime(
    input: [
      {dno:{      
        preprodWallet: "%s"}
        month: %s, 
            days: "%s"}]
    upsert: true
  ) {
    uptime {
        month
        days
      }
    }
  }""" % (preprodWallet, month, uptimes)

    r = graphql_query(governance_url, query)
    print(r)

def main():
    # parser = argparse.ArgumentParser(description="Update GraphQL schema on a Dgraph server.")
    # parser.add_argument("gov_url", help="Dando governance database URL (e.g., http://alpha:8080/graphql)")

    # args = parser.parse_args()
    #governance_url = "http://dgraph.m2tec.nl/graphql"
    governance_url = "http://localhost:28080/graphql"
    # dno_url = "https://preprod-sunflower.m2tec.nl/cardano-graphql"
    preprodWallet = "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"
    
    # let date = currentdate

    for month in range(1,4):

        length = monthrange(2025, month)[1]

        for day in range(1,length+1):
            result = testing_query_dno(dno_url="test")
            update_preprod_uptime_today(governance_url, preprodWallet, month, day, result)
            
            time.sleep(2)

    # update_preprod_uptime(governance_url, preprodWallet, 2, "11100111")
    # update_preprod_uptime(governance_url, preprodWallet, 3, "11100111")
    #dno_urls = query_governance(governance_url)
    # print(dno_urls)

    # for dno_url in dno_urls:
    #     dno_url["preprod"]
    #     print(dno_url)

    # dno_healty = query_dno(dno_url)

    # if (dno_healty):
    #     print("He is good")


if __name__ == "__main__":
    main()
