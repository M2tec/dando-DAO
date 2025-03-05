#!/usr/bin/env python3
import argparse
import traceback
import requests
import time
import json


def remove_newlines(text):
    text = text.replace('', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    return text


def get_data(database_url, query):
    # Query Dando gov
    query = remove_newlines(query)

    try:
        r = requests.post(database_url, json={"query": query})
        print(json.dumps(r.json(), indent=2))
    except requests.exceptions.ConnectionError as e:
        print(e)
        # print(json.dumps(r.json(), indent=2))
    except json.decoder.JSONDecodeError as e:
        print(e)
    
    return r.json()


def main():
    parser = argparse.ArgumentParser(description="Update GraphQL schema on a Dgraph server.")
    parser.add_argument("gov_url", help="Dando governance database URL (e.g., http://alpha:8080/admin)")
    parser.add_argument("db_url", help="Database URL (e.g., http://alpha:8080/admin)")
    args = parser.parse_args()

    print(args.db_url)
    print("\nInstalling the following schema:\n")
    
    # Query Dando node 
    query = """    
    query { cardano
        { tip 
            { number slotNo epoch
                { number }
            }
        }  
    }
    """

    r = get_data(args.gov_url, query)

    # Query Dando node 
    query = """    
    query { cardano
        { tip 
            { number slotNo epoch
                { number }
            }
        }  
    }
    """
    r = get_data(args.db_url, query)

    print(json.dumps(r.json(), indent=2))


if __name__ == "__main__":
    main()
