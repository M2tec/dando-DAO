#!/usr/bin/env python3
import argparse
import logging.handlers
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
        r = requests.post(database_url, json=myjson, timeout=10)
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

def query_dno(dno_url):

    is_OK = 1 # 0 is no data, 1 is query failed and 2 is query succeeded
    status_code = 0

    # dno_url = dno_url.removesuffix('/') + "/stats"  # Only works from python 3.9 
    if dno_url.endswith('/'):
        dno_url = dno_url[:-1]
    dno_url += "/stats"

    print(dno_url) 
    # GraphQL
    for i in range(3):
        try:
            dno_status = requests.get(dno_url, timeout=10)

            status_code = dno_status.status_code

            if status_code == 200:
                print(2)
                is_OK = 2
                break  # Exit the loop on success
            else:
                print(1)

        except requests.exceptions.ConnectionError as e:
            logger.info("Stats page: Connection error: " + str(e))
        except requests.exceptions.ReadTimeout as e:
            logger.info("Stats page: Timeout error: " + str(e))

        time.sleep(2)            

    status = {"connection": status_code, "query": is_OK}
    print(status)
    return status

def get_dno_data(governance_url, month):

    query = """query { 
    queryDno { 
        preprodWallet
        name
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

    # print("q: " + query)
    r = graphql_query(governance_url, query)
    # print(r)

    status = r["return_code"]
    # print("\nResult ===================")
    # print(r)

    if type(r) == dict:
        #print(r)
        dno_datas = r["return_data"]["data"]["queryDno"]

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

def update_uptime_today(governance_url, uptime_id, result):
    # print("update uptime")
    
    # Get uptime data 
    query = """query {
        queryUptime(
            filter: { id: "%s"}) {
                days
            }
        }
    """ % (uptime_id)
    
    # print(query)

    r = graphql_query(governance_url, query)    

    uptime_data = r["return_data"]["data"]["queryUptime"][0]
    # print(uptime_data)
    if r["return_code"] != 200:
        logger.info(r["return_code"])

    if uptime_data["days"] == "0":
        uptimes = set_empty_month()
        
        # print(uptimes)
    else:
        uptimes = uptime_data["days"]

    uptimesArray = list(uptimes)
    
    # print(uptimesArray)

    day = int(datetime.now(timezone.utc).strftime('%d'))
    # print(uptimesArray[day-1])
    uptimesArray[day-1] = str(result)

    uptimes = "".join(uptimesArray)

    # print(uptimes)

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
    # print("### Result")
    # print(r)

def main():
    # governance_url = "http://dgraph.m2tec.nl/graphql"
    # governance_url = "http://localhost:28080/graphql"
    # dno_url = "https://preprod-sunflower.m2tec.nl/cardano-graphql"
    # preprodWallet = "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"

    mytime = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')
    print(mytime)

    parser = argparse.ArgumentParser(description="Monitor Dandelion node uptime.")
    parser.add_argument("env",  nargs='?', default=".env.development", help="Provide the environment file (e.g., .env.development)")
    args = parser.parse_args()

    environment_file = args.env

    log_file_name = "monitor.dev.log"
    log_folder = "./logs/monitor/"
    # Check if env var is set otherwise read file
    try:  
        governance_url = os.environ['VITE_GRAPH_URL'].replace('"', '')

    except KeyError: 
        try:
            with open(environment_file) as f:
                content = f.readlines()
            environment_data = {}
            for line in content:
                variable = line.split('=', 1)[0]
                value = line.split('=', 1)[1].replace('\n', '').replace('"', '')

                environment_data[variable] = value
                
                governance_url = environment_data['VITE_GRAPH_URL']
                log_file_name = "monitor.prod.log"

        except FileNotFoundError:
            print("No .env.developement file ")

    try:  
        log_folder = os.environ['LOG_FOLDER'].replace('"', '')
        log_file_name = "monitor.prod.log"
    except KeyError: 
        print("No log env var")


    envir = os.environ
    # print(envir)
    print(log_folder)

    console = logging.StreamHandler()
    file_handler = logging.FileHandler(log_folder + log_file_name)

    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s:%(lineno)d %(message)s"
    )

    console.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    logger.addHandler(console)
    logger.addHandler(file_handler)

    logger.info("VITE_GRAPH_URL ".ljust(25)+ " : " + governance_url)

    # Get nod operators info
    month = int(datetime.now(timezone.utc).strftime('%m'))   
    dno_data = get_dno_data(governance_url, month)
    
    # print("\n")
    # logger.debug(pp.pprint(dno_data))
    # print("\n\n")
    
    for dno in dno_data:
        print("")
        print(dno["name"])
        # print(dno["services"])

        for service in dno["services"]:
            # print(service["url"])
            if service["url"] != None and service["url"] and  service["url"].startswith("http"):

                uptime_id = service["uptime"][0]["id"]

                status = query_dno(service["url"])
                
                logger_result = "Fail"
                if status["connection"] == 200:
                    if status["query"] == 1:
                        logger_result = "Fail"
                    if status["query"] == 2:
                        logger_result = "Pass"
                else:
                    logger_result = str(status["connection"])
                    
                log_name = dno["name"].ljust(25) + " : "
                log_subnet = str(service["subnet"]).ljust(10) + " : " 
                log_url = str(service["url"]).ljust(45) 
                log_gql = "gql: " + logger_result
                
                logger.info(log_name + log_subnet + log_url + log_gql)

                # print("Status: " + str(status["query"]))
                update_uptime_today(governance_url, uptime_id, status["query"])
            else:
                logger.info(dno["name"].ljust(25) + " : No service URL's")
    
if __name__ == "__main__":
    main()
