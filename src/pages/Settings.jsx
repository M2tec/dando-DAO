import { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import NavBar from '../components/Header';
import { handleQuery, isEmpty, DelayedInput, useDebounce } from '../components/Utility';

const Settings = () => {
  const [walletAddress, setWalletAddress] = useState("")
  const [userDefaultData, setUserDefaultData] = useState({"name": ""})

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

      let gq = `query {
      getDno(preprodWallet: "` + walletAddress + `") {
        name
        preprodWallet
        mainnetWallet
        hardware
        preprodUrl
        mainnetUrl
      }
    }`
      // let gqlQuery = { query: gq.replace(/\n/g, ' ') };
      // console.log(gqlQuery)

      // let gqlQuery = { query: "query { queryDno { id name address nodeUrl uptimes { uptimeData }}}" }
      let gqlData = await handleQuery(gq)

      // console.log(gqlData)
      let dData = gqlData.data.getDno;
      // console.log("dData", dData)
      if (dData !== null) {
        setUserDefaultData(dData);
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
    if (field == "preprodUrl" || "mainnetUrl") {
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
    }

    const fetchData = async () => {
      await handleQuery(gq)
    }

    fetchData()
      .catch(console.error);
  }

  const Input = (props) => {
    const [value, setValue] = useState();

    const debouncedRequest = useDebounce(() => {
      console.log("props", props)
      myQuery(walletAddress, props.field, value)
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
                <label htmlFor="exampleFormControlInput1">Name</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="name"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Nike Hoskinson"
                  defaultValue={userDefaultData.name} />

              </div>
              <div className="form-group mb-2">
                <label htmlFor="exampleFormControlInput1">Mainnet wallet</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="mainnetWallet"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="https://server1.dandelion.link"
                  defaultValue={userDefaultData.mainnetWallet}
                />

              </div> 

              <div className="form-group mb-2">
                <label htmlFor="exampleFormControlInput1">Hardware</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="hardware"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Atari"
                  defaultValue={userDefaultData.hardware}
                />

              </div>

              <div className="form-group mb-2">
                <label htmlFor="exampleFormControlInput1">Node Url preprod</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="preprodUrl"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="https://preprod.dandelion.link"
                  defaultValue={userDefaultData.preprodUrl}
                />

              </div>


              <div className="form-group mb-2">
                <label htmlFor="exampleFormControlInput1">Node Url mainnet</label>

                <Input
                  type="text"
                  walletAddress={walletAddress}
                  field="mainnetUrl"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="https://mainnet.dandelion.link"
                  defaultValue={userDefaultData.mainnetUrl}
                />

              </div>

            </form>

          </div>
        </div>
      </div>
      <Footer />

    </>

  )
};

export default Settings;
