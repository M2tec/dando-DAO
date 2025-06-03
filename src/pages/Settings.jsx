import { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import { graphqlQuery, useDebounce } from '../components/Utility';
import { ToastContainer, toast } from 'react-toastify';

async function setupNewUser(walletAddress) {

        let gq = `
          mutation AddDno($preprodWallet: String!) {
            addDno(
              input: [{
                name: "", 
                mainnetWallet: "", 
                preprodWallet: $preprodWallet, 
                hardware: "", 
                services: [
                  { 
                    network: CARDANO, 
                    subnet: PREPROD, 
                    tag: GENERIC, 
                    url: "", 
                    uptime: [
                      {month: 1, days: "0"}, {month: 2, days: "0"}, {month: 3, days: "0"}, {month: 4, days: "0"},
                      {month: 5, days: "0"}, {month: 6, days: "0"}, {month: 7, days: "0"}, {month: 8, days: "0"},
                      {month: 9, days: "0"}, {month: 10, days: "0"}, {month: 11, days: "0"}, {month: 12, days: "0"}
                    ]
                  },
                  { 
                    network: CARDANO, 
                    subnet: MAINNET, 
                    tag: GENERIC, 
                    url: "", 
                    uptime: [
                      {month: 1, days: "0"}, {month: 2, days: "0"}, {month: 3, days: "0"}, {month: 4, days: "0"},
                      {month: 5, days: "0"}, {month: 6, days: "0"}, {month: 7, days: "0"}, {month: 8, days: "0"},
                      {month: 9, days: "0"}, {month: 10, days: "0"}, {month: 11, days: "0"}, {month: 12, days: "0"}
                    ]
                  }
                ]
              }],
              upsert: true
            ) {
              dno {
                id
                name
                preprodWallet
              }
            }
          }
        `

        let variables = {
                           "preprodWallet": walletAddress
                        }

        console.log(gq)
        const fetchData = async () => { await graphqlQuery(gq,variables) }

        fetchData()
          .catch(console.error);
}

const Settings = () => {
  const [walletAddress, setWalletAddress] = useState("")
  const [userDefaultData, setUserDefaultData] = useState({ "name": "", "services": [{ "url": "" }, { "url": "" }] })

  useEffect(() => {
    console.log("Userdata", userDefaultData.name)
    let myAddress = JSON.parse(localStorage.getItem("login_0"));

    if (myAddress === null) {
      myAddress = ""
    }

    setWalletAddress(myAddress)

    window.addEventListener('storage', () => {
      console.log("StorageEvent")
      setWalletAddress(JSON.parse(localStorage.getItem('login_0')) || {})
    });


  }, []);


  useEffect(() => {

    const fetchData = async () => {

      let gq = `query GetDno($preprodWallet: String!) {
        getDno(preprodWallet: $preprodWallet) {
          name
          preprodWallet
          mainnetWallet
          hardware
          services {
            subnet
            url
          }
        }
      }`

      let gqlData = await graphqlQuery(gq,
        {
          "preprodWallet": walletAddress
        })

      // Setup database fields when the address is not yet in the database
      if (gqlData.data.getDno === null) {
        console.log("No database object yet")
        
        setupNewUser(walletAddress)
      
        //   gq = `
      //     mutation AddDno($preprodWallet: String!) {
      //       addDno(
      //         input: [{
      //           name: "", 
      //           mainnetWallet: "", 
      //           preprodWallet: $preprodWallet, 
      //           hardware: "", 
      //           services: [
      //             { 
      //               network: CARDANO, 
      //               subnet: PREPROD, 
      //               tag: GENERIC, 
      //               url: "", 
      //               uptime: [
      //                 {month: 1, days: "0"}, {month: 2, days: "0"}, {month: 3, days: "0"}, {month: 4, days: "0"},
      //                 {month: 5, days: "0"}, {month: 6, days: "0"}, {month: 7, days: "0"}, {month: 8, days: "0"},
      //                 {month: 9, days: "0"}, {month: 10, days: "0"}, {month: 11, days: "0"}, {month: 12, days: "0"}
      //               ]
      //             },
      //             { 
      //               network: CARDANO, 
      //               subnet: MAINNET, 
      //               tag: GENERIC, 
      //               url: "", 
      //               uptime: [
      //                 {month: 1, days: "0"}, {month: 2, days: "0"}, {month: 3, days: "0"}, {month: 4, days: "0"},
      //                 {month: 5, days: "0"}, {month: 6, days: "0"}, {month: 7, days: "0"}, {month: 8, days: "0"},
      //                 {month: 9, days: "0"}, {month: 10, days: "0"}, {month: 11, days: "0"}, {month: 12, days: "0"}
      //               ]
      //             }
      //           ]
      //         }],
      //         upsert: true
      //       ) {
      //         dno {
      //           id
      //           name
      //           preprodWallet
      //         }
      //       }
      //     }

      // `

      //   console.log(gq)
      //   const fetchData = async () => {
      //     await graphqlQuery(gq,
      //       {
      //         "preprodWallet": walletAddress
      //       })
      //   }

      //   fetchData()
      //     .catch(console.error);

      }


      // console.log(gqlData)
      let dData = gqlData.data.getDno;
      // console.log("dData", dData)
      if (dData !== null) {
        console.log("dData", dData)

        let services = {}
        services[dData.services[0].subnet] = dData.services[0].url
        services[dData.services[1].subnet] = dData.services[1].url

        console.log("services", services)
        let newdata = {
          name: dData.name,
          mainnetWallet: dData.mainnetWallet,
          preprodWallet: dData.preprodWallet,
          hardware: dData.hardware,
          preprodUrl: services["PREPROD"],
          mainnetUrl: services["MAINNET"]
        }

        console.log(newdata)
        setUserDefaultData(newdata);
      }
    }

    console.log("wallet", walletAddress)
    if (walletAddress != "") {

      fetchData()
        .catch(console.error);
    }
  }, [walletAddress])

  function myQuery(address, field, value) {
    console.log(address)
    console.log(field)
    console.log(value)

    let gq = ""

    console.log("Address: ", address)
    if (field == "PREPROD" || field == "MAINNET") {

      gq = `
      { 
          queryDno(filter: {preprodWallet: {eq: "` + address + `" }})
              {
              name 
              preprodWallet
              services(filter: {subnet: {eq: ` + field + ` }}){
                id
                url
              }
          }
      } 
      `
   

      async function f() {

        try {
          let response = await graphqlQuery(gq)

          console.log("response: ", response)
          let serviceId = response.data.queryDno[0].services[0].id

          console.log("serviceId: ", serviceId)

          gq = `
            mutation UpdateService($serviceId: ID!, $value: String!) {
              updateService(
                input: {
                  filter: { id: [$serviceId] }, 
                  set: { url: $value }
                }
              ) {
                service {
                  subnet
                  network
                  id
                  tag
                }
              }
            }
          `
          response = await graphqlQuery(gq,
            {
              "serviceId": serviceId,
              "value": value
            }
          )
          console.log(response)



        } catch (err) {
          // catches errors both in fetch and response.json
          alert(err);
        }
      }

      f();
    } else {

      gq = `
        mutation { addDno(input: [
        {    
        preprodWallet: "` + address + `",
        ` + field + `: "` + value + `"
        }], upsert: true)
        {
            dno {
            id
            name
            preprodWallet            
            }
        }
        }
    `
      async function f() {

        try {
          let response = await graphqlQuery(gq)
          console.log(response)

        } catch (err) {
          // catches errors both in fetch and response.json
          alert(err);
        }
      }

      f();


    }


  }

  const Input = (props) => {
    const [value, setValue] = useState();

    const debouncedRequest = useDebounce(() => {
      console.log("props", props)
      myQuery(walletAddress, props.field, value)
      toast.success('Saved!', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // access to latest state here
    });

    const onChange = (e) => {
      const value = e.target.value;
      setValue(value);

      debouncedRequest();
    };

    return <input type="text" className="form-control" onChange={onChange} defaultValue={props.defaultValue} />;
  }


  return (
    <>
      <div className="m-3">
        <ToastContainer />
        <h1 className="text-3xl font-bold mb-0"><b>Settings</b></h1>
        <p>Add you DNO info for rewards</p>

        <div className="container-fluid m-0">
          <div className="row gap-3">
            <div className="card mb-3 p-3 w-auto bg-secondary border-0 rounded-0" >
              <h4><b>ADA 0.00</b></h4>
              to be distributed in next batch.
            </div>

            <div className="">
              <h2> Cardano Address</h2>
              {walletAddress}
            </div>

            <form>
              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Name</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="name"
                  className="form-control"
                  id="dnoFormControlInput1"
                  placeholder="Nike Hoskinson"
                  defaultValue={userDefaultData.name} />

              </div>
              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Mainnet wallet</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="mainnetWallet"
                  className="form-control"
                  id="dnoFormControlInput1"
                  placeholder="https://server1.dandelion.link"
                  defaultValue={userDefaultData.mainnetWallet}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Hardware</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="hardware"
                  className="form-control"
                  id="dnoFormControlInput1"
                  placeholder="Atari"
                  defaultValue={userDefaultData.hardware}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Node Url preprod</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="PREPROD"
                  className="form-control"
                  id="dnoFormControlInput1"
                  placeholder="https://preprod.dandelion.link"
                  defaultValue={userDefaultData.preprodUrl}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="dno\FormControlInput1">Node Url mainnet</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="MAINNET"
                  className="form-control"
                  id="dnoFormControlInput1"
                  placeholder="https://mainnet.dandelion.link"
                  defaultValue={userDefaultData.mainnetUrl}
                />

              </div>

            </form>

          </div>
        </div>
      </div>

    </>

  )
};

export default Settings;
