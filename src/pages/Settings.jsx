import { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import { graphqlQuery, useDebounce } from '../components/Utility';

async function setupNewUser(preprodWallet) {

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
                    subnet: "PREPROD", 
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
                    subnet: "MAINNET", 
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
    "preprodWallet": preprodWallet
  }

  // console.log(gq)
  const fetchData = async () => { await graphqlQuery(gq, variables) }

  fetchData()
    .catch(console.error);
}

async function updateUser(userData) {

  const fetchData = async () => {
    let gq = `
            mutation AddDno(  
                          $preprodWallet: String!, 
                          $mainnetWallet: String!,
                          $name: String!, 
                          $hardware: String!
                          ) {
              addDno(
                input: [{
                  name: $name, 
                  mainnetWallet: $mainnetWallet, 
                  preprodWallet: $preprodWallet, 
                  hardware: $hardware
                }],
                upsert: true
              ) {
                dno {
                  id
                  name
                  preprodWallet
                  services {
                    id
                    subnet
                  }
                }
              }
            }
          `

    let variables = {
      "preprodWallet": userData.preprodWallet,
      "mainnetWallet": userData.mainnetWallet,
      "name": userData.name,
      "hardware": userData.hardware
    }

    let gqlQuery = await graphqlQuery(gq, variables)
    return gqlQuery
  }

  fetchData().then((result) => {

    let services = result.data.addDno.dno[0].services

    let preprodService = services.filter(function (item) {
      return item.subnet == "PREPROD";
    })

    let preprodServiceId = preprodService[0].id
    console.log(preprodServiceId)

    let gq = `
      mutation UpdateService($serviceId: ID!, $value: String!) {
        updateService(
          input: {
            filter: { id: [$serviceId] }, 
            set: { url: $value }
          }
        ) {
          service {
            id
            subnet
            url
          }
        }
      }
    `

    let variables = {
      "serviceId": preprodServiceId,
      "value": userData.preprodUrl
    }

    let fetchServiceData = async () => { await graphqlQuery(gq, variables) }
    fetchServiceData()

    let mainnetService = services.filter(function (item) {
      return item.subnet == "MAINNET";
    })

    let mainnetServiceId = mainnetService[0].id
    console.log(mainnetServiceId)

    variables = {
      "serviceId": mainnetServiceId,
      "value": userData.mainnetUrl
    }

    fetchServiceData()
  }
  )

  fetchData()
    .catch(console.error);
}

const Settings = () => {
  const [preprodWallet, setpreprodWallet] = useState("")
  const [userData, setUserData] = useState({
    "preprodWallet": "",
    "mainnetWallet": "",
    "name": "",
    "hardware": "",
    "preprodUrl": "",
    "mainnetUrl": ""
  })
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("Userdata", userData.name)
    // console.log("userData:", userData);
    let myAddress = JSON.parse(localStorage.getItem("login_0"));

    if (myAddress === null) {
      myAddress = ""
    }

    setpreprodWallet(myAddress)

    window.addEventListener('storage', () => {
      console.log("StorageEvent")
      setpreprodWallet(JSON.parse(localStorage.getItem('login_0')) || {})
    });


  }, []);

  // preprodWallet changed
  useEffect(() => {
    console.log("Wallet", preprodWallet)

    if (preprodWallet == "") {
      return
    }

    const fetchData = async () => {

      let gq = `
query GetDno($preprodWallet: String!) {
  getDno(preprodWallet: $preprodWallet) {
    name
    preprodWallet
    mainnetWallet
    hardware
    services {
      id
      subnet
      url
    }
  }
}`

      let gqlData = await graphqlQuery(gq,
        {
          "preprodWallet": preprodWallet
        })

      return gqlData

    }

    fetchData().then((result) => {
      console.log("Result: ", result)

      // Setup database fields when the address is not yet in the database

      let newdata = {}
      let dData = result.data.getDno;

      if (dData === null) {
        console.log("No database object yet")

        setupNewUser(preprodWallet)

        newdata = {
          name: "",
          mainnetWallet: "",
          preprodWallet: preprodWallet,
          hardware: "",
          preprodUrl: "",
          mainnetUrl: ""
        }

      } else {

        let preprodService = dData.services.filter(function (item) {
          return item.subnet == "PREPROD";
        })

        let mainnetService = dData.services.filter(function (item) {
          return item.subnet == "MAINNET";
        })

        newdata = {
          name: dData.name,
          mainnetWallet: dData.mainnetWallet,
          preprodWallet: dData.preprodWallet,
          hardware: dData.hardware,
          preprodUrl: preprodService[0].url,
          mainnetUrl: mainnetService[0].url
        }


      }
      setUserData(newdata);
      setLoading(false);
    })

    fetchData()
        .catch(err => {
          console.error(err);
    });
    
  }, [preprodWallet])


  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  if (loading) return <p className='mx-4 mt-2'>Loading...</p>;

  return (
    <>
      <div className="m-3">

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
              {preprodWallet}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="dnoFormControlInput1"
                  onChange={(e) => handleChange(e)}
                  defaultValue={userData.name} />

              </div>
              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Mainnet wallet</label>

                <input
                  type="text"
                  name="mainnetWallet"
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  placeholder="https://server1.dandelion.link"
                  defaultValue={userData.mainnetWallet}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Hardware</label>

                <input
                  type="text"
                  name="hardware"
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  placeholder="Atari"
                  defaultValue={userData.hardware}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="dnoFormControlInput1">Node Url preprod</label>

                <input
                  type="text"
                  name="preprodUrl"
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  placeholder="https://preprod.dandelion.link"
                  defaultValue={userData.preprodUrl}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="dno\FormControlInput1">Node Url mainnet</label>

                <input
                  type="text"
                  name="mainnetUrl"
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  placeholder="https://mainnet.dandelion.link"
                  defaultValue={userData.mainnetUrl}
                />

              </div>
              <button type="submit" className="btn btn-primary px-5 mt-3" role="button">Save</button>

            </form>

          </div>
        </div>
      </div>

    </>

  )
};

export default Settings;
