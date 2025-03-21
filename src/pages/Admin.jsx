import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { handleQuery, isEmpty } from '../components/Utility';


const Admin = () => {

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
      let gqlData = await handleQuery(gq)

      let dData = gqlData.data.queryDno;

      setDnoData(dData);

    }

    fetchData()
      .catch(console.error);
  }, []);

  function deleteUser(props) {
    // console.log("props: ", props)
    console.log(props)

    const deleteUptime = async () => {

      var uptimeString = props.uptime.length === 0 ? "" : '"' + props.uptime.join('","') + '"';

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

      var serviceString = props.service.length === 0 ? "" : '"' + props.service.join('","') + '"';

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

      var dnoString = props.dno.length === 0 ? "" : '"' + props.dno.join('","') + '"';

      let gq = `mutation { 
          deleteDno (filter: { id:[${dnoString}]})
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

  }




  function UserData({ data }) {

    if (isEmpty(data)) {
      return (<></>)
    }

    let idList = { dno: [], service: [], uptime: [] }
    const Dnos = data.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
    {
      console.log("data", dno)
      // Create ID list

      idList["dno"].push(dno.id)

      for (let [key, service] of Object.entries(dno.services)) {
        idList["service"].push(service.id)

        for (let [key, uptime] of Object.entries(service.uptime)) {
          idList["uptime"].push(uptime.id)
        }

      }

      console.log(idList)
      return (
        <>
          <div key={index} className="m-3">{dno.name}
            <a className="btn btn-primary m-3" onClick={() => deleteUser(idList)} role="button">Delete user</a></div>
        </>
      )
    })


    return (
      <>
        {Dnos}
      </>
    )

  }

  const DownloadJSON = ({ data }) => {
    let today = new Date().toISOString().slice(0, 10)
    console.log(today)
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
      <a className="btn btn-primary m-3" onClick={downloadJSON} role="button">Download JSON</a>
    );
  }

  const InstallJSON = ({ data, fileName }) => {
    const installJSON = () => {
      // const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
      // const jsonURL = URL.createObjectURL(jsonData);
      // const link = document.createElement('a');
      // link.href = jsonURL;
      // link.download = `${fileName}.json`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    };

    return (
      <a className="btn btn-primary m-3" onClick={installJSON} role="button">Install JSON</a>
    );
  }


  return (
    <>
      <DownloadJSON
        data={dnoData}
        fileName={"test"}
      /><br />
      <InstallJSON
        data={dnoData}
        fileName={"test"}
      /><br />
      <UserData
        data={dnoData} />
      <Footer />


    </>
  )
};

export default Admin;
