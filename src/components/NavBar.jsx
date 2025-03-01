import { isEmpty, handleGC } from "./Utility";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Gear } from "react-bootstrap-icons";

const NavBar = () => {
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


  function handleLogin() {

    let host = location.protocol + '//' + location.host

    const gcscript =
    {
      "title": "Connect with GC",
      "description": "About to connect your wallet with this dapp",
      "type": "script",
      "exportAs": "dnoWalletData",
      "return": {
        "mode": "last"
      },
      "run": {
        "address": {
          "type": "getCurrentAddress"
        },
        "info": {
          "type": "macro",
          "run": "{getAddressInfo(get('cache.address'))}"
        },
        "results": {
          "type": "macro",
          "run": {
            "address": "{get('cache.address')}",
            "paymentKeyHash": "{get('cache.info.paymentKeyHash')}",
            "stakingKeyHash": "{get('cache.info.stakingKeyHash')}",
            "paymentScriptHash": "{get('cache.info.paymentScriptHash')}",
            "stakingScriptHash": "{get('cache.info.stakingScriptHash')}",
            "rewardAddress": "{get('cache.info.rewardAddress')}"
          }
        }
      },
      "returnURLPattern": host + "/return-data?d={result}"
    }

    handleGC(gcscript);


  }

  function Connect(props) {

    // console.log("Props", props)
    let wa = props.walletAddress

    // console.log(wa)
    if (wa == "") {
      return (<></>)
    }

    if (wa == "") {

      return (
        <>
          <button onClick={handleLogin} className="btn btn-sm border btn-secondary" type="button">Connect wallet</button>
        </>
      )

    } else {

      let firstWA = wa.slice(0,6)
      let lastWA =  wa.slice(-6)

      wa = firstWA + "..." + lastWA

      return (
      <>
        <button className="btn btn-sm border me-2"><Link className="nav-link text-white" to="/settings"><Gear /></Link></button>
        <button onClick={handleLogin} className="btn btn-sm border btn-secondary" type="button">{wa}</button>
      </>
      )
    }

  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="px-1 nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
            <li className="px-1 nav-item"><Link className="nav-link text-white" to="/m2">M2 Dandelion nodes</Link></li>
            <li className="px-1 nav-item"><Link className="nav-link text-white" to="/m3">M3 Education</Link></li>
            <li className="px-1 nav-item"><Link className="nav-link text-white" to="/m4">M4 Maintanance</Link></li>
          </ul>

        </div>
        <Connect
          walletAddress={walletAddress} />
      </div>
    </nav>
  );
};

export default NavBar;