
import { schemaComposer, printSchema } from 'graphql-compose';
import fs from 'fs';

const dnoTC = schemaComposer.createObjectTC({
  name: 'Dno',
  fields: {
    id: 'Int!',
    firstName: 'String',
    lastName: 'String',
    address: 'String',
    nodeUrl: 'String'
  },
});

const UptimeTC = schemaComposer.createObjectTC({
  name: 'Uptime',
  fields: {
    id: 'Int!',
    uptimeData: '[String]',
    dnoId: 'Int',
  },
});


const dNodeOperators = [

  {
    id: 1,
    firstName: 'Roberto',
    lastName: 'Morano',
    address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt",
    nodeUrl: "https://og.dandelion.io"
  },
  {
    id: 2,
    firstName: 'Adriano',
    lastName: 'Fiorenza',
    address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt",
    nodeUrl: "https://ar1.gamechanger.finance"
  },
  { id: 3, 
    firstName: 'Maarten', 
    lastName: 'Menheere', 
    address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt",
    nodeUrl: "https://sunflower.m2tec.nl"
  },
  { id: 4, 
    firstName: 'Q', 
    lastName: 'Uazar',
    address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt",
    nodeUrl: ""
  },
];



// const uptimes = [
//   { id: 1, dnoId: 1, title: 'Introduction to GraphQL', votes: 2 },
//   { id: 2, dnoId: 2, title: 'Welcome to Apollo', votes: 3 },
//   { id: 3, dnoId: 2, title: 'Advanced GraphQL', votes: 1 },
//   { id: 4, dnoId: 3, title: 'Launchpad is Cool', votes: 7 },
// ];


UptimeTC.addFields({
  dno: {
    // you may provide the type name as a string (eg. 'Dno'),
    // but for better developer experience you should use a Type instance `dnoTC`.
    // This allows jumping to the type declaration via Ctrl+Click in your IDE
    type: dnoTC,
    // resolve method as first argument will receive data for some Uptime.
    // From this data you should then fetch Dno's data.
    // let's take lodash `find` method, for searching by `dnoId`
    // PS. `resolve` method may be async for fetching data from DB
    // resolve: async (source, args, context, info) => { return DB.find(); }
    resolve: uptime => find(dnos, { id: uptime.dnoId }),
  },
});

dnoTC.addFields({
  uptimes: {
    // Array of uptimes may be described as string in SDL in such way '[Uptime]'
    // But graphql-compose allow to use Type instance wrapped in array
    type: [UptimeTC],
    // for obtaining list of uptime we get current dno.id
    // and scan and filter all Uptimes with desired dnoId
    resolve: dno => filter(uptimes, { dnoId: dno.id }),
  },
  uptimeCount: {
    type: 'Int',
    description: 'Number of Uptimes written by Dno',
    resolve: dno => filter(uptimes, { dnoId: dno.id }).length,
  },
});



// Requests which read data put into Query
schemaComposer.Query.addFields({
  uptimes: {
    type: '[Uptime]',
    resolve: () => uptimes,
  },
  dno: {
    type: 'Dno',
    args: { id: 'Int!' },
    resolve: (_, { id }) => find(dnos, { id }),
  },
});

// Requests which modify data put into Mutation
schemaComposer.Mutation.addFields({
  upvoteUptime: {
    type: 'Uptime',
    args: {
      uptimeId: 'Int!',
    },
    resolve: (_, { uptimeId }) => {
      const uptime = find(uptimes, { id: uptimeId });
      if (!uptime) {
        throw new Error(`Couldn't find uptime with id ${uptimeId}`);
      }
      uptime.votes += 1;
      return uptime;
    },
  },
});

export const schema = schemaComposer.buildSchema();


var fileData = printSchema(schema)
console.log(fileData)

fs.writeFile('./dno-schema.graphql', fileData, error => {
  // handle error
});