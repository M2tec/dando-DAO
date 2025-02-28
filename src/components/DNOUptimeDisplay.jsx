import { useEffect, useState } from 'react'



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

async function handleQuery(gquery) {

    let gqlBody = JSON.stringify(gquery)
    console.log(gqlBody)

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
        console.log(json);
        return json

    } catch (error) {
        console.error(error.message);
    }
}

const DNOUptimeDisplay = () => {
    const [dnoData, setDnoData] = useState({})
    
    let gqlQuery = { query: "query { queryDno { id firstName lastName address nodeUrl uptimes { uptimeData }}}" }

    useEffect(() => {

        const fetchData = async () => {

            let gqlData = await handleQuery(gqlQuery)

            console.log(gqlData)
            let dData = gqlData.data.queryDno;
            console.log(dData)
            setDnoData(dData);
        }

        fetchData()
            .catch(console.error);
    }, []);


    async function handleUpdateData(e) {
        console.log("Update")

        let gq = `
            mutation { addDno(input: [
            { 
                firstName: "Adriano", 
                lastName: "Fiorenza", 
                address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"
                nodeUrl: "sunflower.m2tec.nl"
                uptimes: { uptimeData: ["001011001110010101", "000100111111111111", "00011111111111111"]}
            },
                { 
                firstName: "Roberto", 
                lastName: "Moreno", 
                address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"
                nodeUrl: "og.dandelion.io"
                uptimes: { uptimeData: ["00111111110010101", "00010011111111111", "00011111111111111"]}
                },
                { 
                firstName: "Q", 
                lastName: "Uazar", 
                address: "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"
                nodeUrl: "dandelion.quazar.usa"
                uptimes: { uptimeData: ["001011001111111111", "000100001111111111111", "0001000011111111111111"]}
                }
            ])
            {
                dno {
                id
                firstName
                lastName  
                uptimes { uptimeData}
                }
            }
            }
`

        gqlQuery = { query: gq.replace(/\n/g, ' ') };
        // const gqlQuery = { query: "query { queryDno { firstName lastName address nodeUrl uptimes { uptimeData }}}"}

        const fetchData = async () => {

            let gqlData = await handleQuery(gqlQuery)

            console.log(gqlData)
        }

        fetchData()
            .catch(console.error);
    }

    const ProcessMonth = ({ uptimeData }) => [...uptimeData].map((item, index) => {
        if (item == 0) {
            return (
                <div key={index} className="col p-0 m-0">
                    <div className='bg-success m-0 p-0'><br /></div>
                </div>
            )

        } else {
            return (
                <div key={index} className="col m-0 p-0">
                    <div className='bg-secondary m-0 p-0'><br /></div>
                </div>
            )
        }
    }
    );


    function handleDnoData(dno) {
        console.log(dno)

    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    function DnoListData(props) {

        // console.log("Props", props)
        let dnoList = props.dnoData
        console.log('d', dnoList)

        if (isEmpty(dnoList)) {
            console.log("empty")
            return (<></>)
        }


        const DnoItems = dnoList.map((item, index) => // { console.log("item", item.uptimes.uptimeData[0])}

            <div key={index} className='row mb-2'>
                <div className='col-3 px-3'>
                    <div className='d-flex justify-content-between'>
                        <div className='mt-1'>{item.firstName} {item.lastName}</div>
                        <a className="btn btn-primary p-1" onClick={() => handleDnoData(item)}>Update</a>
                    </div>
                </div>
                <div className='col-3 px-3'>
                    <div className="row mt-1">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[0]} />
                    </div>
                </div>
                <div className='col-3 px-3'>
                    <div className="row mt-1">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[1]} />
                    </div>
                </div>
                <div className='col-3 px-3'>
                    <div className="row mt-1">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[2]} />
                    </div>
                </div>
            </div>
        );

        console.log(DnoItems)

        return (
            <>
                {DnoItems}
            </>
        )

    }

    return (
        <>
            <a className="btn btn-primary m-3" onClick={handleUpdateData}>Update data</a>

            <div className='container-fluid p-0'>
                {/* Heading */}
                <div className='row'>
                    <div className='col-3'>DNO
                    </div>
                    <div className='col-3'>
                        March
                    </div>
                    <div className='col-3'>
                        April
                    </div>
                    <div className='col-3'>
                        May
                    </div>
                </div>

                    <DnoListData dnoData={dnoData} />
                


            </div>
        </>
    )
};

export default DNOUptimeDisplay;