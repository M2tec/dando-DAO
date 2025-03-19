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

  function deleteUser({ data }) {

  }

  function UserData({ data }) {

    if (isEmpty(data)) {
      return (<></>)
    }

    let idList = []
    const Dnos = data.map((dno, index) => // { console.log("dno", dno.uptimes.uptimeData[0])}
    {
      // Create ID list

      idList.push(data.id)

      for (let [key, service] of Object.entries(dno.services)) {
        idList.push(service.id)

        for (let [key, uptime] of Object.entries(service.uptime)) {
          idList.push(uptime.id)
        }

      }

      return (
        <>
          <div key={index} className="m-3">{dno.name} 
          <a className="btn btn-primary m-3" onClick={deleteUser} role="button">Delete user</a></div>
        </>
      )
    })

    // console.log(idList)
    return (
      <>
        {Dnos}
      </>
    )

  }

  const DownloadJSON = ({ data, fileName }) => {
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
