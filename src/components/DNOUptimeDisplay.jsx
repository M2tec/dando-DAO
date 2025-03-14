import { useEffect, useState } from 'react'
import { handleQuery, isEmpty } from './Utility';

const DNOUptimeDisplay = () => {
    const [dnoData, setDnoData] = useState({})


    useEffect(() => {

        const fetchData = async () => {

            let gq = `
                {
                queryDno {
                    id
                    name
                    mainnetWallet
                    preprodWallet
                    hardware
                    services {
                        subnet
                        uptime(filter: {month: {in: [1, 2, 3]}}) {
                            month
                            days
                        }
                    }
                    
                }
                }       
            `
            let gqlData = await handleQuery(gq)

            // console.log(gqlData)
            // console.log("uptime", gqlData.data.queryDno[0].services[0].uptime)
            let dData = gqlData.data.queryDno;

            //console.log("dData", dData[0].services[0].uptime)
            setDnoData(dData);
        }

        fetchData()
            .catch(console.error);
    }, []);


    function handleCheckUptime() {
        const fetchData = async () => {

            let gq = `
            query {
            queryDno {
                id
                name
                mainnetWallet
                preprodWallet
                hardware
                services(filter: { subnet: {eq: PREPROD}}){
                uptime(filter: { month: {in: [1,2,3]}}){
                    month
                    days
                }
                }
            }
            }  
            `
            let gqlData = await handleQuery(gq)

            // console.log(gqlData)
            let dData = gqlData.data.queryDno;
            // console.log(dData)
            setDnoData(dData);
        }

        fetchData()
            .catch(console.error);

    }

    function handleDeleteUptime() {
        const fetchData = async () => {

            let gq = `

            mutation { deleteUptime (filter: { network: {eq: CARDANO}})
            {
              msg
              uptime {
                month
                days
              }
          }
          }         
            `
            let gqlData = await handleQuery(gq)

            // console.log(gqlData)
            let dData = gqlData.data.queryDno;
            // console.log(dData)
            setDnoData(dData);
        }

        fetchData()
            .catch(console.error);

    }

    async function handleUpdateData(e) {
      // console.log("Update")

        let gq = `

mutation { addDno(input: [
    { 
        name: "Adriano Fiorenza", 
        mainnetWallet: "addr_test1qpfq52v9k60rmytrpdy3zwvtda78ah3kjng6luj273zrkaadqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q0rl88m",
        preprodWallet: "addr_test1qpfq52v9k60rmytrpdy3zwvtda78ah3kjng6luj273zrkaadqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q0rl88m",
    },
    { 
        name: "Roberto Moreno", 
        mainnetWallet: "addr_test1qqveyzyq7rgv69lfd36g34r2cqv5w52gflss8qmd9445q84jeydv636p62uy7lf9lheagf2q9u0aadw09g2t8vu2wnjqd9xsl6",
        preprodWallet: "addr_test1qqveyzyq7rgv69lfd36g34r2cqv5w52gflss8qmd9445q84jeydv636p62uy7lf9lheagf2q9u0aadw09g2t8vu2wnjqd9xsl6"
    }
    ], upsert: true )
    {
        dno {
            id
            name
        }
    }
}

`

        // let gqlQuery = { query: gq.replace(/\n/g, ' ') };
        // const gqlQuery = { query: "query { queryDno { firstName lastName address nodeUrl uptimes { uptimeData }}}"}

        const fetchData = async () => {

            let gqlData = await handleQuery(gq)
          // console.log(gqlData)

        }

        fetchData()
            .catch(console.error);
    }

     const ProcessMonth = ( {uptimeData }) => [...uptimeData].map((item, index) => {
        

        if (item == 2) {
            return (
                <div key={index} className="col p-0 m-0">
                    <div className='bg-success m-0 p-0'><br /></div>
                </div>
            )

        } else if (item == 1) {
            return (
                <div key={index} className="col m-0 p-0">
                    <div className='bg-secondary m-0 p-0'><br /></div>
                </div>
            )
        } else {
            return (
                <div key={index} className="col m-0 p-0">
                    <div className='bg-white m-0 p-0'><br /></div>
                </div>
            )
        }
    }
    );

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function DnoListData(props) {

        if (isEmpty(dnoData)) {
            return (<></>)
        }

      // console.log("Props", props)
        let dnoList = props.dnoData
        // console.log("dnoList", dnoList)

        if (isEmpty(dnoList)) {
            return (<></>)
        }

        const DnoItems = dnoList.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
        {

            // Reorder graphQuery, feels like a hack
            console.log("dno", dno)
            let services = dno.services

            let uptimeData = {}
            let uptime1 = {}
            services.map((service, index) => {
                let subnet = service.subnet
                console.log(subnet)

                let uptimes = service.uptime
                console.log("uptimes", uptimes)                

                uptimes.forEach(uptime => {
                    console.log(uptime.month)
                    
                    uptime1[uptime.month] = uptime.days 
                    uptimeData[subnet]= {...uptime1}
                    
                });
            })
            
            console.log("uptimeData" , uptimeData["MAINNET"][1])

                      
            return (
                <div key={index} className='row m-0 mb-2'>
                    <div className='col-3 px-0'>
                        <div className='d-flex justify-content-between'>
                            <div className='mt-1'>{dno.name}</div>
                        </div>
                    </div>                    
                    <div className='col-3 px-1'>
                        <div style={{height: "18px"}} className="row m-0 overflow-hidden h-progressbar rounded-top border border-bottom-0 border-secondary">
                           <div style={{height: "18px"}} className='d-flex align-items-end p-0 px-2'>m</div>
                           <ProcessMonth
                                uptimeData={uptimeData["MAINNET"][1]}
                                 />
                        </div>
                        <div style={{height: "18px"}} className="row m-0 overflow-hidden rounded-bottom border border-secondary">
                        <div style={{height: "18px"}} className='d-flex align-items-end px-2'>p</div>
                           <ProcessMonth
                                uptimeData={uptimeData["PREPROD"][1]}
                                 />
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div style={{height: "18px"}} className="row m-0 overflow-hidden rounded-top border border-bottom-0 border-secondary">

                           <ProcessMonth
                                uptimeData={uptimeData["MAINNET"][2]}
                                 />
                        </div>
                        <div style={{height: "18px"}} className="row m-0 overflow-hidden rounded-bottom border border-secondary">
 
                           <ProcessMonth
                                uptimeData={uptimeData["PREPROD"][2]}
                                 />
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div style={{height: "18px"}} className="row m-0 overflow-hidden rounded-top border border-bottom-0 border-secondary">
 
                           <ProcessMonth
                                uptimeData={uptimeData["MAINNET"][3]}
                                 />
                        </div>
                        <div style={{height: "18px"}} className="row m-0 overflow-hidden rounded-bottom border border-secondary">

                           <ProcessMonth
                                uptimeData={uptimeData["PREPROD"][3]}
                                 />
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
            <div className='container-fluid p-0 m-0'>
                {/* Heading */}
                <div className='row m-0'>
                    <div className='col-2 m-0 p-0'>
                        <b>DNO</b>
                    </div>
                    <div className='col-1 m-0 p-0'>

                    </div>
                    <div className='col-3 m-0 px-1'>
                        <b>Januari</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                        <b>Februari</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                        <b>March</b>
                    </div>
                </div>

                <DnoListData dnoData={dnoData} />
{/* 
                <button type="button" onClick={handleCheckUptime} className="btn btn-primary">Update dno data</button>
                <button type="button" onClick={handleDeleteUptime} className="btn btn-primary mx-3">Delete data</button> */}
            </div>
        </>
    )
};

export default DNOUptimeDisplay;