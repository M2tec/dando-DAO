#!/usr/bin/env python3
import traceback
import requests
import time
import json

print("\nInstalling the following schema:\n")

mutation="""mutation {
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

f = open("dno-schema.graphql", "r")
schema = f.read()

mutation = mutation.replace("$my_schema", schema)
print(mutation)
mutation = mutation.replace('\n', '').replace('  ', ' ').replace('\t', ' ').replace('  ', ' ')

print("")
print(mutation)


for i in range(0, 15):
  try:
    r = requests.post('http://localhost:8080/admin', json={"query": mutation})
  except requests.exceptions.ConnectionError:
    time.sleep(1)
    print("Waiting for connection")

message = r.json()  

for i in range(0, 15):
  if "errors" in message:
    r = requests.post('http://localhost:8080/admin', json={"query": mutation})
    message = r.json()  
    print("Waiting for db to be ready ... " + str(i))# , end="  ")
    time.sleep(3)

print("")
print(r)
print("")

print(json.dumps(r.json(), indent=1))
