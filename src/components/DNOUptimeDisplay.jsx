import { useEffect, useState } from 'react'
import { handleQuery, isEmpty } from './Utility';

const DNOUptimeDisplay = () => {
    const [dnoData, setDnoData] = useState({})

    useEffect(() => {

        const fetchData = async () => {

            let gqlQuery = { query: "query { queryDno { id name address nodeUrl uptimes { uptimeData }}}" }
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
                name: "Adriano Fiorenza", 
                address: "addr_test1qpfq52v9k60rmytrpdy3zwvtda78ah3kjng6luj273zrkaadqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q0rl88m"
                nodeUrl: "sunflower.m2tec.nl"
                uptimes: { uptimeData: ["001011001110010101", "000100111111111111", "00011111111111111"]}
            },
                { 
                name: "Roberto Moreno", 
                address: "addr_test1qqveyzyq7rgv69lfd36g34r2cqv5w52gflss8qmd9445q84jeydv636p62uy7lf9lheagf2q9u0aadw09g2t8vu2wnjqd9xsl6"
                nodeUrl: "og.dandelion.io"
                uptimes: { uptimeData: ["00111111110010101", "00010011111111111", "00011111111111111"]}
                },
                { 
                name: "QUazar", 
                address: "addr_test1qpx2egjz2f3kknme2hymcxa46v22th5ht8t82saus228amts4jafwx022df7r4c0x9gcqcctcxd4yxtuft8yxmsjqcuqc3f5tg"
                nodeUrl: "dandelion.quazar.usa"
                uptimes: { uptimeData: ["001011001111111111", "000100001111111111111", "0001000011111111111111"]}
                }
            ], upsert: true )
            {
                dno {
                    id
                    name
                    uptimes { uptimeData}
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

    const ProcessMonth = ({ uptimeData }) => [...uptimeData].map((item, index) => {
        if (item == 1) {
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

        console.log("dnoList", dnoList)
        const DnoItems = dnoList.map((item, index) => // { console.log("item", item.uptimes.uptimeData[0])}
        {
            // console.log(item.uptimes.uptimeData[0])

        if (item.uptimes == null) {
            let up = {uptimeData : ["111","000","000"]}
            item["uptimes"] = up
                }
         return (
         <div key={index} className='row m-0 mb-2'>
                <div className='col-3 px-0'>
                    <div className='d-flex justify-content-between'>
                        <div className='mt-1'>{item.name}</div>
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[0]} />
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[1]} />
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                        <ProcessMonth
                            uptimeData={item.uptimes.uptimeData[2]} />
                    </div>
                </div>
            </div>
         )
        
    })
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