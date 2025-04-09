import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { graphqlQuery, isEmpty, handleGC } from '../components/Utility';
import AdminMenu from '../components/AdminMenu';


const PaymentAdmin = () => {

  const [dnoData, setDnoData] = useState({})


  useEffect(() => {

    const fetchData = async () => {

      let gq = `
              {
              queryDno {
                 id
                 name 
                 hardware
                 mainnetWallet
                 preprodWallet
                 services {
                      id
                      subnet
                      network
                      tag
                      url
                      uptime {
                          id
                          month
                          days
                      }
                  }
                  
              }
              }       
          `
      let gqlData = await graphqlQuery(gq)

      let dData = gqlData.data.queryDno;

      setDnoData(dData);

    }

    fetchData()
      .catch(console.error);
  }, []);

  function UserData({ data }) {

    // console.log("data", data)
    if (isEmpty(data)) {
      return (<></>)
    }

    const Dnos = data.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
    {

      return (
        
          <div key={index} className='row m-0 mb-2'>
            <div className='col-3 mt-1 px-0'>
              <b>{dno.name}</b>
            </div>
          
          <div className='row m-0 mb-2'>

            <div className='col-1 px-0 pt-1'>
              Preprod
            </div>

            <div className='col-3 px-0 pt-1'>
              {dno.preprodWallet.slice(0, 12) + "..." + dno.preprodWallet.slice(-12)}
            </div>

            <div className='col-1 px-0 mx-3'>
              <input id={"value-preprod-" + index} type="text" className="form-control" defaultValue={index} />
            </div>

            <div className='col-2'>
              <a className="btn btn-primary btn-block w-100" onClick={() => distributeNftToUser({ dno: dno, network: "preprod" })} role="button">Distribute NFT</a>
            </div>

            <div className='col-2'>
              <a className="btn btn-primary btn-block w-100" onClick={() => distributeToUser({ dno: dno, network: "preprod", userIndex: index  })} role="button">Distribute</a>
            </div>

          </div>
          <div className='row m-0 mb-2'>

            <div className='col-1 px-0 pt-1'>
              Mainnet
            </div>

            <div className='col-3 px-0 pt-1'>
              {dno.mainnetWallet.slice(0, 12) + "..." + dno.mainnetWallet.slice(-12)}
            </div>

            <div className='col-1 px-0 mx-3'>
              <input id={"value-mainnet-" + index} type="text" className="form-control" defaultValue={index} />
            </div>

            <div className='col-2'>
              <a className="btn btn-primary btn-block w-100" onClick={() => distributeNftToUser({ dno: dno, network: "mainnet" })} role="button">Distribute NFT</a>
            </div>

            <div className='col-2'>
              <a className="btn btn-primary btn-block w-100" onClick={() => distributeToUser({ dno: dno, network: "mainnet", userIndex: index  })} role="button">Distribute</a>
            </div>
          </div>
          </div>
      )
    })

    return (
      <>
        <div className="container">
          {Dnos}
        </div>
      </>
    )

  }

  function distributeFunds(data) {
    console.log(data)

    if (data.network == "mainnet") {
      let wallet = ""
    } else {
      let wallet = ""
    }

    let gcscript = {
      type: "script",
      title: "DNO funds distribution",
      description: "Distribute compensation for running Dandelion-lite nodes",
      exportAs: "Distribution log",
      return: {
        mode: "last"
      },
      run: {
      }
    }

    let signTx = {
      type: "signTxs",
      detailedPermissions: false,
      txs: [
      ]
    }


    for (let index = 0; index < dnoData.length; index++) {

      let build_tx = {
        type: "buildTx",
        title: "Payment",
        description: "",
        tx: {
          outputs: [
            {
              address: "",
              assets: [
                {
                  policyId: "ada",
                  assetName: "ada",
                  quantity: "0"
                }
              ]
            }
          ]
        }
      }

      let value_id = "value-" + data.network + "-" + index
      let valueElement = document.getElementById(value_id)
      // console.log("----")
      // console.log("D:", dnoData[index].name);
      // console.log("W:", dnoData[index].preprodWallet);
      console.log("E:", valueElement)
      console.log("V:", valueElement.value)

      build_tx.description = `DNO distribution, thank you ${dnoData[index].name} for you services`
      build_tx.tx.outputs[0].address = dnoData[index].preprodWallet
      build_tx.tx.outputs[0].assets[0].quantity = valueElement.value

      let buildTxName = "build_tx_" + index

      gcscript.run[buildTxName] = build_tx
      signTx.txs.push(`{get('cache.${buildTxName}.txHex')}`)

    }
    console.log(gcscript)

    gcscript.run["sign_tx"] = signTx

    gcscript.run["submit_tx"] = {
      type: "submitTxs",
      txs: "{get('cache.sign_tx')}"
    }

    gcscript.run["export_results"] = {
      type: "macro",
      run: "{get('cache.build_tx.txHash')}"
    }

    handleGC(gcscript, network);


  }

  function distributeToUser(data) {
    console.log(data)

    if (data.network == "mainnet") {
      let wallet = ""
    } else {
      let wallet = ""
    }

    let gcscript = {
      type: "script",
      title: "DNO funds distribution",
      description: "Distribute compensation for running Dandelion-lite nodes",
      exportAs: "Distribution log",
      return: {
        mode: "last"
      },
      run: {
      }
    }

    let signTx = {
      type: "signTxs",
      detailedPermissions: false,
      txs: [
      ]
    }

    let build_tx = {
      type: "buildTx",
      title: "Payment",
      description: "",
      tx: {
        outputs: [
          {
            address: "",
            assets: [
              {
                policyId: "ada",
                assetName: "ada",
                quantity: "0"
              }
            ]
          }
        ]
      }
    }


    let value_id = "value-" + data.network + "-" + data.userIndex
    console.log(value_id)
    let valueElement = document.getElementById(value_id)

    console.log("E:", valueElement)
    console.log("V:", valueElement.value)

    build_tx.description = `DNO distribution, thank you ${data.dno.name} for you services`
    build_tx.tx.outputs[0].address = data.dno.preprodWallet
    build_tx.tx.outputs[0].assets[0].quantity = valueElement.value

    let buildTxName = "build_tx_" + data.userIndex

    gcscript.run[buildTxName] = build_tx
    signTx.txs.push(`{get('cache.${buildTxName}.txHex')}`)

    console.log(gcscript)

    gcscript.run["sign_tx"] = signTx

    gcscript.run["submit_tx"] = {
      type: "submitTxs",
      txs: "{get('cache.sign_tx')}"
    }

    gcscript.run["export_results"] = {
      type: "macro",
      run: "{get('cache.build_tx.txHash')}"
    }

    handleGC(gcscript, data.network);


  }

  return (
    <>
      <AdminMenu />

      <div className='m-4'>
        <UserData
          data={dnoData} />


        <div className='m-4'>

          <a className="btn btn-primary mx-3" onClick={() => distributeFunds("preprod")} role="button">Distribute Preprod</a>
          <a className="btn btn-primary" onClick={() => distributeFunds("mainnet")} role="button">Distribute Mainnet</a>
        </div>
      </div>
      <Footer />
    </>
  )
};

export default PaymentAdmin;
