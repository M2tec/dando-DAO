#!/usr/bin/env python3
import argparse
import traceback
import requests
import time
import json
import random
from calendar import monthrange
import random
import pprint
pp = pprint.PrettyPrinter(depth=4)
from datetime import datetime,timezone

def remove_newlines(text):
    text = text.replace('\n', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    return text

def graphql_query(database_url, query, variables="{}"):
    #print("\nQuery :\n\n" + query + "\n===================\n")
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

def get_dno_data(governance_url):

    query = """query { 
    queryDno { 
        name
        preprodWallet
        mainnetWallet
        preprodUrl
        preprodUptime { month, days }
      	mainnetUrl
        mainnetUptime { month, days }
    }
}         
    """

    r = graphql_query(governance_url, query)

    # print("\nResult ===================")
    # print(r)

    dno_datas = r["data"]["queryDno"]

    # node_urls = []

    # for dno_data in dno_datas:
    #     preprodWallet = dno_data["preprodWallet"]
    #     preprodUrl = dno_data["preprodUrl"]
    #     mainentUrl = dno_data["mainnetUrl"]
    #     node_url = { "preprodWallet": preprodWallet, "preprod": preprodUrl , "mainnet": mainentUrl}   
    #     node_urls.append(node_url)
    
    return dno_datas

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

def fill_mock_data(governance_url):

    
    query = """mutation {
  addDno(
    input: [
      {
        name: "Maarten M | M2tec",
        preprodWallet: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt",
        mainnetWallet: "$m2tec",
        preprodUrl: "https://preprod-sunflower.m2tec.nl/",
        mainnetUrl: "https://mainnet-sunflower.m2tec.nl/"
      },
      {
        name: "q",
        preprodWallet: "addr_test1qq4gyf6jalkh0p5uvnuvjdnspzulzyzm79antq42zduvlgddqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q5t4dpq",
        mainnetWallet: "$quasar",
        preprodUrl: null,
        mainnetUrl: null
      },
      {
        name: "PEACEpool dandeli0n",
        preprodWallet: "addr_test1qqs96h3jdydyeplsvampynrh7fwy4txr4kp2mu4pxf7xzqadqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6qkr75h0",
        mainnetWallet: "addr1qxyh3m7vwdw79rw97m0lghjxhhk9pjmsn6dfe2ms2m043ppvrzdp4wcghqx83fez83rz9t0lzjtqn3ug5ujnuugq4jpq39tkw2",
        preprodUrl: "https://preprod-lite.dandelion.link/",
        mainnetUrl: "https://mainnet-lite.dandelion.link/"
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

def update_uptime_today(governance_url, preprodWallet, resultPreprod, resultMainnet):
    day = int(datetime.now(timezone.utc).strftime('%d'))
    month = int(datetime.now(timezone.utc).strftime('%m'))
    day = 4
    # month = 5
    print("month:" + str(month))
    print("day:" + str(day))
    print("update uptime")
    
    uptimes = ""
    # When this is the first day of the month there is no uptime data yet
    # so create an empty string of uptimes
    if day == 1:
        print("First day of the month generating emtpy uptime string")
        empty_day_array = set_empty_month(governance_url, preprodWallet, month)
        uptimes = empty_day_array
    else:
        # Get current uptime data
        print("Checking for current uptime data")

        query = """{
        getDno(preprodWallet: "%s") {
            name
            preprodWallet
            preprodUptime {
            month
            days
            }
            mainnetWallet
            mainnetUptime {
            month
            days
            }
        }
        }""" % (preprodWallet)

        r = graphql_query(governance_url, query)
        # print(r)

        preprodUptimes = r["data"]["getDno"]["preprodUptime"]
        print("Current uptime data: \n" + str(preprodUptimes))

        if len(preprodUptimes) == 0:
            empty_day_array = set_empty_month(governance_url, preprodWallet, month)
            uptimes = empty_day_array
        else:
            for uptime in preprodUptimes:
                if uptime["month"] == month:
                    print("month is in data")
                    uptimes = uptime['days']
                else:
                    print("month is not in data")
                    uptimes = set_empty_month(governance_url, preprodWallet, month)

    # Ok we made sure we have an uptime array with data
    # Now lets modify the current day to fill it with uptime data

    # print("Uptimes" + uptimes)
    uptimesArray = list(uptimes)
    
    # print(uptimesArray)
    # print(uptimesArray[day-1])
    uptimesArray[day-1] = str(resultPreprod)

    uptimes = "".join(uptimesArray)

    print(uptimes)

    # Store the result 
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
            dno { name, preprodWallet}
            month
            days
        }
        }
    }""" % (preprodWallet, month, uptimes)
    
    print(query)

    r = graphql_query(governance_url, query)
    # print("### Result")
    # print(r)

def main():
    parser = argparse.ArgumentParser(description="Monitor Dandelion node uptime.")
    parser.add_argument("env",  nargs='?', default=".env.development", help="Provide the environment file (e.g., .env.development)")
    args = parser.parse_args()


    environment_file = args.env
    # print(environment_file)

    # Open the file and read its content.
    with open(environment_file) as f:
        content = f.readlines()

    # Display the file's content line by line.

    environment_data = {}
    for line in content:
        variable = line.split('=', 1)[0]
        value = line.split('=', 1)[1].replace('\n', '').replace('"', '')

        environment_data[variable] = value
        # print(environment_data)

    #governance_url = "http://dgraph.m2tec.nl/graphql"
    #governance_url = "http://localhost:28080/graphql"

    governance_url = environment_data['VITE_GRAPH_URL']


    dno_data = get_dno_data(governance_url)
    
    pp.pprint(dno_data)   
    # dno_url = "https://preprod-sunflower.m2tec.nl/cardano-graphql"
    # preprodWallet = "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"
    for dno in dno_data:
        # print(dno["preprodUrl"])
        if dno["preprodUrl"] != None:
            print("\n" + dno["name"])
            resultPreprod = query_dno(dno["preprodUrl"])
            # print("Preprod: " + str(result))
            resultMainnet = query_dno(dno["mainnetUrl"])
            # print("Mainnet: " + str(result))
            update_uptime_today(governance_url, dno["preprodWallet"], resultPreprod, resultMainnet)
            # break
    
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
