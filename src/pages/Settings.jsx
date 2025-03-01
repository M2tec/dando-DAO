import { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';


const Settings = () => {
  const [walletAddress, setWalletAddress] = useState("")

  useEffect(() => {


    let walletAddress = JSON.parse(localStorage.getItem("login_0"));

    if (walletAddress === null) {
      walletAddress = ""
    }

    setWalletAddress(walletAddress)

    window.addEventListener('storage', () => {
      console.log("StorageEvent")
      setWalletAddress(JSON.parse(localStorage.getItem('login_0')) || {})
    });


  }, []);

  return (
    <>
      <NavBar />
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
                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Nike Hoskinson" />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="exampleFormControlInput1">Node Url</label>
                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="https://server1.dandelion.link" />
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
