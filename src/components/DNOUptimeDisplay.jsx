import { useEffect, useState } from 'react'
import { graphqlQuery, isEmpty } from './Utility';

const now = new Date();

function getMonth(negativOffset) {
    const now = new Date();
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(now.getMonth() - negativOffset);

    const month = fiveMonthsAgo.getMonth() + 1;
    return month
}

// let thisMonth = now.getMonth() + 1
let thisMonth = getMonth(0)
let monthMin1 = getMonth(1)
let monthMin2 = getMonth(2)
console.log(thisMonth)
console.log(monthMin1)
console.log(monthMin2)


const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DNOUptimeDisplay = () => {
    const [dnoData, setDnoData] = useState({})

    useEffect(() => {
        const fetchData = async () => {

            let gq = `
                {
                queryDno (order: { asc: name} ) {
                    id
                    name
                    mainnetWallet
                    preprodWallet
                    hardware
                    services {
                        subnet
                        uptime(filter: {month: {in: [${monthMin2}, ${monthMin1}, ${thisMonth}]}}) {
                            month
                            days
                        }
                    }
                    
                }
                }       
            `
            let gqlData = await graphqlQuery(gq)
            setDnoData(gqlData.data.queryDno);
        }

        fetchData()
            .catch(console.error);
    }, []);

    const ProcessMonth = ({ uptimeData }) => [...uptimeData].map((item, index) => {
        return (
            <div key={index} className="col m-0 p-0">
                <div className={`m-0 p-0 ${item == 2 ? 'bg-success' : item == 1 ? 'bg-secondary' : 'bg-white'}`}>
                   <br />
                </div>
            </div>
        );
    }
    );


    function DnoListData(props) {

        // console.log("Props", props)
        let dnoList = props.dnoData
        // console.log("dnoList", dnoList)

        if (isEmpty(dnoList)) {
            return (<></>)
        }

        const DnoItems = dnoList.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
        {

            //  console.log("dno", dno)
            let services = dno.services

            let uptimeData = {}
            let uptime1 = {}
            services.map((service, index) => {
                let subnet = service.subnet
                // console.log(subnet)

                let uptimes = service.uptime
                // console.log("uptimes", uptimes)                

                uptimes.forEach(uptime => {
                    // console.log(uptime.month)

                    uptime1[uptime.month] = uptime.days
                    uptimeData[subnet] = { ...uptime1 }

                });
            })

            // console.log("uptimeData" , uptimeData["MAINNET"][1])

            return (
                <div key={index} className='row m-0 mb-2'>
                    <div className='col-3 px-0'>
                        <div className='d-flex justify-content-between'>
                            <div className='mt-1'>{dno.name}</div>
                            
                        </div>
                    </div>
                    
                    <div className='col-3 px-1'>
                       
                        <div style={{ height: "25px" }} className="row m-0 overflow-hidden h-progressbar rounded-top border border-bottom-0 border-secondary">
                            <div className="col-2 p-0 px-1">m</div>
                            <ProcessMonth
                                uptimeData={uptimeData["MAINNET"] ? uptimeData["MAINNET"][monthMin2] : "0"}
                            />
                        </div>
                               
                        <div style={{ height: "25px" }} className="row m-0 overflow-hidden rounded-bottom border border-secondary">
                            <div className="col-2 p-0 px-1">p</div>
                            <ProcessMonth
                                uptimeData={uptimeData["PREPROD"] ? uptimeData["PREPROD"][monthMin2] : "0"}
                            />
                            
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div style={{ height: "25px" }} className="row m-0 overflow-hidden rounded-top border border-bottom-0 border-secondary">

                            <ProcessMonth
                                uptimeData={uptimeData["MAINNET"] ? uptimeData["MAINNET"][monthMin1] : "0"}
                            />
                        </div>
                        <div style={{ height: "25px" }} className="row m-0 overflow-hidden rounded-bottom border border-secondary">

                            <ProcessMonth
                                uptimeData={uptimeData["PREPROD"] ? uptimeData["PREPROD"][monthMin1] : "0"}
                            />
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div style={{ height: "25px" }} className="row m-0 overflow-hidden rounded-top border border-bottom-0 border-secondary">

                            <ProcessMonth
                                uptimeData={uptimeData["MAINNET"] ? uptimeData["MAINNET"][thisMonth] : "0"}
                            />
                        </div>
                        <div style={{ height: "25px" }} className="row m-0 overflow-hidden rounded-bottom border border-secondary">

                            <ProcessMonth
                                uptimeData={uptimeData["PREPROD"] ? uptimeData["PREPROD"][thisMonth] : "0"}
                            />
                        </div>
                    </div>
                </div>
            )

        })

        return (
            <>
                {DnoItems}
            </>
        )

    }

    return (
        <>
            <div className='container-fluid p-0 m-0'>
                <div className='row m-0'>
                    <div className='col-2 m-0 p-0'>
                        <b>DNO</b>
                    </div>
                    <div className='col-1 m-0 p-0'>

                    </div>
                    <div className='col-3 m-0 px-1'>
                        <b>{monthNames[monthMin2 - 1]}</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                        <b>{monthNames[monthMin1 - 1]}</b>
                    </div>
                    <div className='col-3 m-0 px-1'>
                        <b>{monthNames[thisMonth - 1]}</b>
                    </div>
                </div>

                <DnoListData dnoData={dnoData} />

            </div>
        </>
    )
};

export default DNOUptimeDisplay;