import { add, debounce } from 'lodash';
import React from 'react';
import { useRef, useEffect, useMemo } from 'react';

let graphUrl = import.meta.env.VITE_GRAPH_URL

export async function handleGC(gcscript) {

    console.log(JSON.stringify(gcscript))

    let url = await gc.encode.url({
        input: JSON.stringify(gcscript), // GCScript is pure JSON code, supported on all platforms
        apiVersion: '2', //APIV2
        network: 'preprod', // mainnet or preprod
        encoding: 'gzip' //suggested, default message encoding/compression 
    });

    // url = url.replace("https://beta-preprod-wallet.", "https://dev-preprod-wallet.")

    window.open(url, '_blank', 'location=yes,height=700,width=520,scrollbars=yes,status=yes');
}

export function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export async function handleQuery(gquery) {

    let gqlBody = JSON.stringify(gquery)

    console.log("API URL: ", graphUrl)
    try {
        const response = await fetch(graphUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: gqlBody
            }
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        // console.log(json);
        return json

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

function myQuery(address, field, value){
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

    let gqlQuery = { query: gq.replace(/\n/g, ' ') };
    // const gqlQuery = { query: "query { queryDno { firstName lastName address nodeUrl uptimes { uptimeData }}}"}

    const fetchData = async () => {

        let gqlData = await handleQuery(gqlQuery)

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