#!/usr/bin/env python3

import json


error = '''{
 "error": [
  {
   "message": "failed to lazy-load GraphQL schema: Please retry again, server is not ready to accept requests"
  }
 ]
}'''

# print(a)
data = json.loads(error)

print(data["errors"]) 