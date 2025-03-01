import { useEffect, useState } from 'react'
import { handleQuery, isEmpty } from './Utility';

const DNOUptimeDisplay = () => {
    const [dnoData, setDnoData] = useState({})

    useEffect(() => {

        const fetchData = async () => {

            let gqlQuery = { query: "query { queryDno { id firstName lastName address nodeUrl uptimes { uptimeData }}}" }
            let gqlData = await handleQuery(gqlQuery)

            // console.log(gqlData)
            let dData = gqlData.data.queryDno;
            // console.log(dData)
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

    function DnoListData(props) {

        // console.log("Props", props)
        let dnoList = props.dnoData

        if (isEmpty(dnoList)) {
            return (<></>)
        }


        const DnoItems = dnoList.map((item, index) => // { console.log("item", item.uptimes.uptimeData[0])}

            <div key={index} className='row m-0 mb-2'>
                <div className='col-3 px-0'>
                    <div className='d-flex justify-content-between'>
                        <div className='mt-1'>{item.firstName} {item.lastName}</div>
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[0]} />
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[1]} />
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[2]} />
                    </div>
                </div>
            </div>
        );

        // console.log(DnoItems)

        return (
            <>
                {DnoItems}
            </>
        )

    }

    return (
        <>
            <a className="btn btn-primary" onClick={handleUpdateData}>Update data</a>

            <div className='container-fluid p-0 m-0'>
                {/* Heading */}
                <div className='row m-0'>
                    <div className='col-3 m-0 p-0'>
                        <b>DNO</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                    <b>March</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                    <b> April</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                    <b> May</b>
                    </div>
                </div>

                <DnoListData dnoData={dnoData} />



            </div>
        </>
    )
};

export default DNOUptimeDisplay;