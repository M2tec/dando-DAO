import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { handleQuery, isEmpty, handleGC } from '../components/Utility';
import AdminMenu from '../components/AdminMenu';


const UserAdmin = () => {

  const [dnoData, setDnoData] = useState({})
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle")
  const [jsonData, setJsonData] = useState(null);


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
      let gqlData = await handleQuery(gq)

      let dData = gqlData.data.queryDno;

      setDnoData(dData);

    }

    fetchData()
      .catch(console.error);
  }, []);

  useEffect(() => {

    // console.log("jsondata: ", jsonData)

    if (jsonData) {

      // Remove id's
      for (const dno of jsonData) {
        delete dno.id;
        console.log(dno)
        for (const service of dno.services) {
          delete service.id;
          for (const up of service.uptime) {
            delete up.id;
          }
        }
      }

      let myData = JSON.stringify(jsonData, null, 0)

      let tagList = [
      // enum Tag {
        "GENERIC",
        "GRAPHQL",
        "KOIOS",
        "OGMIOS",
        "UNIMATRIX",
           
      // enum Network {
        "CARDANO",
        "MIDNIGHT",
            
      // enum Subnet {
        "PREPROD",
        "PREVIEW",
        "MAINNET",
        "SANCHONET",
        "MIDNIGHT"
      ]

      function unquoteEnum(myData, enumFields, enumValues) {
        for (const field of enumFields) {
          for (const val of enumValues) {
            const quoted = `"${field}":"${val}"`;
            const unquoted = `"${field}":${val}`;
            myData = myData.replace(new RegExp(quoted, 'g'), unquoted);
          }
        }
        return myData;
      }

      myData = unquoteEnum(myData, ['tag', 'network', 'subnet'], tagList);     

      const unquoted = myData.replace(/"([^"]+)":/g, '$1:');
      console.log(unquoted)

      const fetchData = async () => {

        let gq = `
          mutation { addDno(input:
          ${unquoted}
          )
          {
              dno {
                id
                name
              }
            }
          }     
          `
        let gqlData = await handleQuery(gq)

      }

      fetchData()
        .catch(console.error);

    }


  }, [jsonData]);

  const DownloadJSON = ({ data }) => {
    let today = new Date().toISOString().slice(0, 10)
    // console.log(today)
    let fileName = "userData-" + today
    const downloadJSON = () => {
      const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const jsonURL = URL.createObjectURL(jsonData);
      const link = document.createElement('a');
      link.href = jsonURL;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <a className="btn btn-primary mb-4" onClick={downloadJSON} role="button">Download JSON</a>
    );
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result); // Parse JSON
          setJsonData(parsedData);
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file); // Read file as text
    }
  };

  const InstallJSON = () => {
    return (

      <div className="input-group w-50 mb-4">
        <input type="file" onChange={handleFileUpload} className="form-control" id="inputGroupFile02" />
      </div>
    );
  }

  function UserData({ data }) {

    // console.log("data", data)
    if (isEmpty(data)) {
      return (<></>)
    }

    const Dnos = data.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
    {

      return (
        <div key={index} className='row m-0 mb-2'>
          <div className='col-3 mt-4 px-0'>
            {dno.name}
          </div>

          <div className='col-2 px-0'>
            <a className="btn btn-primary m-3" onClick={() => deleteUser(dno.id)} role="button">Delete user</a>
          </div>

          <div className='col-3 px-0'>
            <input id={"value-" + index} type="text" className="form-control m-3" defaultValue={index} />
          </div>
        </div>
      )
    })

    return (
      <>
        {Dnos}
      </>
    )

  }

  function deleteUser(props) {
    // console.log("props: ", props)
    console.log(props)



    const fetchData = async () => {

      let gq = `
              {
              queryDno (filter: {id:["${props}"]}) {
                 id
                name 
                 services {
                      id
                      uptime {
                          id
                      }
                  }
                  
              }
              }       
          `
      let gqlData = await handleQuery(gq)
      console.log(gqlData)

      let dno = gqlData.data.queryDno[0]
      console.log("data", dno)
      // Create ID list

      let idList = { dno: [], service: [], uptime: [] }
      idList["dno"].push(dno.id)

      for (let [key, service] of Object.entries(dno.services)) {
        idList["service"].push(service.id)

        for (let [key, uptime] of Object.entries(service.uptime)) {
          idList["uptime"].push(uptime.id)
        }

      }

      console.log("idList: ", idList)

      return (idList)

    }

    fetchData()
      .catch(console.error);

    fetchData().then((idList) => {
      console.log("value: ", idList)




      const deleteUptime = async () => {


        var uptimeString = idList.uptime.length === 0 ? "" : '"' + idList.uptime.join('","') + '"';

        let gq = `mutation { 
      deleteUptime (filter: { id:[${uptimeString}]})
      {
          msg
          uptime {
              month
              days
          }
        }
      }`
        console.log(gq)
        let gqlData = await handleQuery(gq)

      }

      deleteUptime()
        .catch(console.error);

      const deleteService = async () => {

        var serviceString = idList.service.length === 0 ? "" : '"' + idList.service.join('","') + '"';

        let gq = `mutation { 
        deleteService (filter: { id:[${serviceString}]})
        {
            msg
            service {
                tag
            }
          }
        }`
        console.log(gq)
        let gqlData = await handleQuery(gq)

      }
      deleteService()
        .catch(console.error);


      const deleteDno = async () => {

        // var dnoString = idList.length === 0 ? "" : '"' + idList.join('","') + '"';
        console.log("deleteDNO list: ", idList)
        let gq = `mutation { 
          deleteDno (filter: { id:["${idList.dno[0]}"]})
          {
              msg
              dno {
                name
              }
            }
          }`
        console.log(gq)
        let gqlData = await handleQuery(gq)

      }
      deleteDno()
        .catch(console.error);
    })

  }

  function deleteAllDnos(props) {
    const fetchData = async () => {

      let gq = `
              {
              queryDno {
                 id
                }
              }       
          `
      let gqlData = await handleQuery(gq)
      console.log(gqlData)
      return (gqlData)
    }

    fetchData()
      .catch(console.error);

    fetchData().then((gqlData) => {
      console.log(gqlData)

    })


  }

  function deleteAllServices(props) {
    console.log("dS")
    const fetchData = async () => {

      let gq = `
              {
              queryService {
                 id
                }
              }       
          `
      let gqlData = await handleQuery(gq)
      console.log(gqlData)
      return (gqlData)
    }

    fetchData()
      .catch(console.error);


    fetchData()
      .then((gqlData) => {

        let services = gqlData.data.queryService
        console.log("services: ", services)

        const deleteUptime = async () => {



          // console.log("data", dno)
          // Create ID list

          let idList = { services: [] }

          for (let [key, uptime] of Object.entries(services)) {
            idList["services"].push(uptime.id)

          }

          console.log("idList: ", idList)

          var servicesString = idList["services"].length === 0 ? "" : '"' + idList["services"].join('","') + '"';

          console.log(servicesString)
          let gq = `mutation { 
        deleteService (filter: { id:[${servicesString}]})
        {
            msg
            service {
                subnet
            }
          }
        }`
          console.log(gq)
          gqlData = await handleQuery(gq)

        }

        deleteUptime()
          .catch(console.error);
      })

  }

  function deleteAllUptimes(props) {
    const fetchData = async () => {

      let gq = `
              {
              queryUptime {
                 id
                }
              }       
          `
      let gqlData = await handleQuery(gq)
      // console.log(gqlData)
      return (gqlData)
    }

    fetchData()
      .catch(console.error);

    fetchData()
      .then((gqlData) => {

        let uptimes = gqlData.data.queryUptime
        console.log("Uptimes: ", uptimes)

        const deleteUptime = async () => {



          // console.log("data", dno)
          // Create ID list

          let idList = { uptimes: [] }

          for (let [key, uptime] of Object.entries(uptimes)) {
            idList["uptimes"].push(uptime.id)

          }

          console.log("idList: ", idList)

          var uptimeString = idList["uptimes"].length === 0 ? "" : '"' + idList["uptimes"].join('","') + '"';

          console.log(uptimeString)
          let gq = `mutation { 
        deleteUptime (filter: { id:[${uptimeString}]})
        {
            msg
            uptime {
                month
                days
            }
          }
        }`
          console.log(gq)
          gqlData = await handleQuery(gq)

        }

        deleteUptime()
          .catch(console.error);
      })

  }

  function distributeFunds(props) {
    console.log(props)

    if (props == "mainnet") {
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

      let value_id = "value-" + index
      let valueElement = document.getElementById(value_id)
      // console.log("----")
      // console.log("D:", dnoData[index].name);
      // console.log("W:", dnoData[index].preprodWallet);
      console.log("E:",valueElement)
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

    handleGC(gcscript);


  }

  return (
    <>
      <AdminMenu />

      <div className='m-4'>
        <DownloadJSON
          data={dnoData}
          fileName={"test"}
        />

        <InstallJSON />
        <div id="DNO" className='container-fluid p-0 m-0'>

          <UserData
            data={dnoData} />
        </div>

        <a className="btn btn-primary" onClick={() => deleteAllDnos()} role="button">Delete All Dnos</a>
        <a className="btn btn-primary mx-3" onClick={() => deleteAllServices()} role="button">Delete All Services</a>
        <a className="btn btn-primary mx-3" onClick={() => deleteAllUptimes()} role="button">Delete All Uptimes</a>
        <a className="btn btn-primary mx-3" onClick={() => distributeFunds("preprod")} role="button">Distribute Preprod</a>
        <a className="btn btn-primary" onClick={() => distributeFunds("mainnet")} role="button">Distribute Mainnet</a>
      </div>
      <Footer />
    </>
  )
};

export default UserAdmin;
