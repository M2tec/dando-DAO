# Dandelion goverance site

Welcome to the Dandelion-lite governance site built on Gamechanger and Unimatrix. 

## Running for developers

The site uses a dGraph database and the GraphQL language to store and retrieve data. 
Check for available commands

```bash
dando@gov:~/src/dando-DAO$ npm run
Scripts available in gc-unimatrix-tutorial@0.0.0 via `npm run-script`:
  dev
    docker compose up -d && vite
  down
    docker compose down
  up
    docker compose up -d
  schema
    cd database && ./install-schema.py http://localhost:28080/admin dno-schema.graphql && cd ..
  deleteDb
    docker compose down && rm -rf data

```

This will start dGraph using docker and start the site  
```bash
npm run dev
```

If running for the first time install the database schema
```bash
npm run schema
```

## Setting CORS serverside 

ngrok http --host-header=rewrite 8080 --response-header-add "Access-Control-Allow-Headers: Content-Type"  