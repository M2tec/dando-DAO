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
        preprodUptime { month, days}
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


    function handleCheckUptime() {
        const fetchData = async () => {

            let gq = `
query { 
    queryDno { 
        id 
        name 
        preprodWallet
        preprodUptime { month, days}
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

            mutation { deleteUptime (filter: { month: {ge: 0}})
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
        // console.log(monthLeft)

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
            let numberOfDays = daysInMonth(monthNumber, 2025)
            let monthObj = { monthNumber: monthNumber, monthName: monthName, numberOfDays: numberOfDays }

            months.push(monthObj)
        }

        console.log(months); // "September"

        console.log("dnoList", dnoList)
        const DnoItems = dnoList.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
        {
            if (dno.preprodUptime === undefined || dno.preprodUptime.length == 0) {
                console.log("undefined")

                let up = [{ month: 1, days: "000" }, { month: 2, days: "000" }, { month: 3, days: "000" },]
                dno["preprodUptime"] = up
                console.log(dno)
            } 

            console.log(dno.preprodUptime.length)

            let missingData = 3 - dno.preprodUptime.length
        
            var missingDataArray = [];

            for (var i = 1; i <= missingData; i++) {
               missingDataArray.push({month: 0, days: "0"});
            }

            let uptimes = [...missingDataArray, ...dno.preprodUptime]

            console.log("uptimes", uptimes)
            dno.preprodUptime.forEach((monthData,index) => {
                console.log(monthData)
                if (monthData.length == 0) {
                    dno.preprodUptime[index] = { month: 2, days: "000" }
                }
            });

            console.log("xx", dno.preprodUptime)
            // let dayToDoArrays = []
            // for (let i = 0; i < 3; i++) {
                
            //     let upDays = dno.preprodUptime[i].days
            //     let numberOfUpDays = upDays.length

            //     let daysToDo = months[i].numberOfDays = numberOfUpDays;
            //     let dayToDoArray = new Array(daysToDo).fill(-1);
            //     dayToDoArrays.push(dayToDoArray)
            // }

            console.log("x---", dno.preprodUptime[0].days)

            return (
                <div key={index} className='row m-0 mb-2'>
                    <div className='col-3 px-0'>
                        <div className='d-flex justify-content-between'>
                            <div className='mt-1'>{dno.name}</div>
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                            <ProcessMonth
                                uptimeData={uptimes[0].days}
                                 />
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                            <ProcessMonth
                                uptimeData={uptimes[1].days}
                                />
                        </div>
                    </div>
                    <div className='col-3 px-1'>
                        <div className="row m-0 mt-1 overflow-hidden rounded-1 border border-black">
                            <ProcessMonth
                                uptimeData={uptimes[2].days}
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

                <button type="button" onClick={handleCheckUptime} className="btn btn-primary">Update dno data</button>
                <button type="button" onClick={handleDeleteUptime} className="btn btn-primary mx-3">Delete data</button>
            </div>
        </>
    )
};

export default DNOUptimeDisplay;