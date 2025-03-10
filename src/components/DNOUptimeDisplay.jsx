import { useEffect, useState } from 'react'
import { handleQuery, isEmpty } from './Utility';

const DNOUptimeDisplay = () => {
    const [dnoData, setDnoData] = useState({})

    useEffect(() => {



        
        const fetchData = async () => {


            let gq = `
query { 
    queryDno { 
        id 
        name 
        preprodWallet
        pUptime
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
    }, []);

    async function handleUpdateData(e) {
        console.log("Update")

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

        } else if (item == 0)  {
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

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }

    function DnoListData(props) {

        console.log("Props", props)
        let dnoList = props.dnoData

        if (isEmpty(dnoList)) {
            return (<></>)
        }

        let months = []
        for (var i = -2; i <= 0; i += 1) {
            let current = new Date();
            current.setMonth(current.getMonth() + i);
            let monthNumber = current.toLocaleString('default', { month: 'numeric' });
            let monthName = current.toLocaleString('default', { month: 'long' });
            let numberOfDays = daysInMonth(monthNumber,2025)
            let monthObj = { monthNumber: monthNumber, monthName: monthName, numberOfDays: numberOfDays}
            
            months.push(monthObj)
        }

        console.log(months); // "September"

        
 
        console.log("dnoList", dnoList)
        const DnoItems = dnoList.map((item, index) => // { console.log("item", item.uptimes.uptimeData[0])}
        {
 
            if (item.pUptime === undefined || item.pUptime.length == 0) {
                console.log("undefined")
    
                let up = ["111","000","000"]
                item["pUptime"] = up
                console.log(item)
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
                            uptimeData={item.pUptime[0]} 
                            monthLength={months[0].numberOfDays}/>
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                        <ProcessMonth
                            uptimeData={item.pUptime[1]}
                            monthLength={months[1].numberOfDays} />
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                        <ProcessMonth
                            uptimeData={item.pUptime[2]}
                            monthLength={months[2].numberOfDays} />
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
                    <div className='col-3 m-0 p-0'>
                        <b>DNO</b>
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



            </div>
        </>
    )
};

export default DNOUptimeDisplay;