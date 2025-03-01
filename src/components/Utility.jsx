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
    // console.log(gqlBody)

    const url = "/api/graphql";
    try {
        const response = await fetch(url,
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
