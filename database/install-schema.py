#!/usr/bin/env python3
import argparse
import traceback
import requests
import time
import json

def main():
    parser = argparse.ArgumentParser(description="Update GraphQL schema on a Dgraph server.")
    parser.add_argument("db_url", help="Database URL (e.g., http://alpha:8080/admin)")
    parser.add_argument("schema_file", help="Path to the GraphQL schema file")
    args = parser.parse_args()

    print(args.db_url)
    print("\nInstalling the following schema:\n")
    
    mutation = """mutation {
      updateGQLSchema(
        input: { set: { schema: "$my_schema"}})
      {
        gqlSchema {
          schema
          generatedSchema
        }
      }
    }
    """
    
    try:
        with open(args.schema_file, "r") as f:
            schema = f.read()
    except FileNotFoundError:
        print(f"Error: Schema file '{args.schema_file}' not found.")
        return
    
    mutation = mutation.replace("$my_schema", schema)
    mutation = mutation.replace('\n', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')
    print(mutation)

    for i in range(0, 15):
        try:
            r = requests.post(args.db_url, json={"query": mutation})
            print("\nConnecting to: " + args.db_url + "\tstatus: [" + str(r.status_code) +"]\n")
            break
        except requests.exceptions.ConnectionError:
            time.sleep(3)
            # print(json.dumps(r.json(), indent=2))
            print("Waiting for connection")

    message = r.json()
    
    for i in range(0, 15):
        
        if "errors" in message:
            
            for messages in message['errors']:
              print(messages['message'])

            r = requests.post(args.db_url, json={"query": mutation})
            message = r.json()  
            print("Waiting for db to be ready ... " + str(i))# , end="  ")
            time.sleep(3)
    
    print("\nFinal Response:")
    print(json.dumps(r.json(), indent=2))

if __name__ == "__main__":
    main()
