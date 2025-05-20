import { add, debounce } from 'lodash';
import React from 'react';
import { useRef, useEffect, useMemo } from 'react';

let graphUrl = import.meta.env.VITE_GRAPH_URL

export async function handleGC(gcscript, network) {

    console.log(JSON.stringify(gcscript))

    let url = await gc.encode.url({
        input: JSON.stringify(gcscript), // GCScript is pure JSON code, supported on all platforms
        apiVersion: '2', //APIV2
        network: network, // mainnet or preprod
        encoding: 'gzip' //suggested, default message encoding/compression 
    });

    if (network == "mainnet") {

    }
    // url = url.replace("https://beta-preprod-wallet.", "https://dev-preprod-wallet.")

    window.open(url, '_blank', 'location=yes,height=1200,width=900,scrollbars=yes,status=yes');
}

export function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export async function graphqlQuery(gq, variables={}) {
    console.log("API URL: ", graphUrl)
    console.log(gq)
    console.log(variables)

    // let gquery = { query: gq.replace(/\n/g, ' '), variables: variables };
    let gquery = { query: gq, variables: variables };
    console.log("gquery: ", gquery)
    try {
        const response = await fetch(graphUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gquery)
            }
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const gqlData = await response.json();
        // console.log(gqlData)
        if (typeof gqlData["errors"] !== 'undefined' || gqlData["errors"] === null) {
            console.log("GQL query error: \n" + gqlData["errors"][0]['message'])

        } else {
            console.log(gqlData)
        }


        // console.log(json);
        return gqlData

    } catch (error) {
        console.error(error.message);
    }
}


export async function cardanoGqlQuery(gq, variables={}) {
    let mainnetGqlUrl = "https://mainnet-sunflower.m2tec.nl/cardano-graphql"
    console.log("API URL: ", mainnetGqlUrl)
    console.log(gq)
    console.log(variables)

    // let gquery = { query: gq.replace(/\n/g, ' '), variables: variables };
    let gquery = { query: gq, variables: variables };
    console.log("gquery: ", gquery)
    try {
        const response = await fetch(mainnetGqlUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gquery)
            }
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const gqlData = await response.json();
        // console.log(gqlData)
        if (typeof gqlData["errors"] !== 'undefined' || gqlData["errors"] === null) {
            console.log("GQL query error: \n" + gqlData["errors"][0]['message'])

        } else {
            console.log(gqlData)
        }


        // console.log(json);
        return gqlData

    } catch (error) {
        console.error(error.message);
    }
}
// Array or object agnostic value getter for nested structures
// Paths can be "unsafe" paths from flatten
// Does throw on errors, not returning null values
// Example:setObj(objA,'foo.1.bar2.0.0');
// @param obj
// @param path
// @param delimiter

export function getObj(obj, path, delimiter = '.') {
    let cursor = obj;
    let levels = path.split(delimiter);
    for (let index = 0; index < levels.length; index++) {
        const level = levels[index];
        if (!cursor)
            // throw new Error("Missing value at " ${levels[index-1] || "root level"}' in '${path}')
            cursor = cursor[level];
    }
    return cursor;
}

function myQuery(address, field, value) {
    console.log(address)
    console.log(field)
    console.log(value)

    let gq = `
        mutation { addDno(input: [
        {    
        address: "` + address + `",
        ` + field + `: "` + value + `"
        }], upsert: true)
        {
            dno {
            id
            name
            address
            nodeUrl
            }
        }
        }
    `


    // const gqlQuery = { query: "query { queryDno { firstName lastName address nodeUrl uptimes { uptimeData }}}"}

    const fetchData = async () => {

        let gqlData = await graphqlQuery(gq)

        console.log(gqlData)
    }

    fetchData()
        .catch(console.error);
}

export class DelayedInput extends React.Component {
    constructor(props) {
        super(props)


        this.state = { value: "test" }
        console.log("constructor", props)

        // Delay action in miliseconds 
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000)
    }

    handleInputChange = (e) => {
        this.setState({ value: e.target.value })
        // Execute the debounced onChange method 

        console.log("s", this.props)
        this.onChangeDebounced(e)
    }

    onChangeDebounced = (e) => {
        myQuery(this.props.walletAddress, this.props.field, e.target.value)
        console.log(e.target.value)
    }
    render() {
        return (
            <input type={this.props.type} className={this.props.className} id={this.props.id} placeholder={this.props.placeholder} onChange={this.handleInputChange} value={this.state.value} />
        )
    }
}

export const useDebounce = (callback) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 1000);
    }, []);

    return debouncedCallback;
};