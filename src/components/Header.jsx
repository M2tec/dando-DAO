import { isEmpty, handleGC } from "./Utility";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Gear } from "react-bootstrap-icons";


const Header = () => {
  const [walletAddress, setWalletAddress] = useState("")

  useEffect(() => {
    // console.log("cookies", cookies['preprodWallet'])

    // let walletAddress = cookies['preprodWallet'];

    // if (walletAddress === null || walletAddress === undefined) {


    let walletAddress = JSON.parse(localStorage.getItem("login_0"));

    if (walletAddress === null) {
      walletAddress = ""
    }


    setWalletAddress(walletAddress)

    // if ('cookieStore' in window) {
    //   cookieStore.addEventListener('change', (event) => {
    //     event.changed.forEach(change => {
    //       console.log(`Cookie '${change.name}' was ${change.removed ? 'removed' : 'changed to: ' + change.value}`);
    //       setWalletAddress(change.value)
    //     });
    //   });
    // }



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

  function Connect({ walletAddress }) {

    // console.log("Props", props)
    // let wa = props.walletAddress
    let admin_wallet = "addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt"

    console.log("walletAddress", walletAddress)
    if (walletAddress == "") {
      return (
        <>
          <button className="btn btn-sm border text-white mx-2" type="button">Preprod</button>
          <button onClick={handleLogin} className="btn btn-sm border btn-secondary" type="button">Connect wallet</button>
        </>)
    } else {

      let firstWA = walletAddress.slice(0, 6)
      let lastWA = walletAddress.slice(-6)

      let wa = firstWA + "..." + lastWA

      if (walletAddress == admin_wallet) {
        return (
          <div>
            <button className="btn btn-sm border text-white mx-2" type="button">Preprod</button>
            <div className="btn btn-sm border me-2"><Link className="text-white" to="/admin-payments">Admin</Link></div>
            <button className="btn btn-sm border me-2"><Link className="nav-link text-white" to="/settings"><Gear /></Link></button>
            <button onClick={handleLogin} className="btn btn-sm border btn-secondary" type="button">{wa}</button>

          </div>
        )
      } else {
        return (

          <div>
            <button className="btn btn-sm border text-white mx-2" type="button">Preprod</button>
            <button className="btn btn-sm border me-2"><Link className="nav-link text-white" to="/settings"><Gear /></Link></button>
            <button onClick={handleLogin} className="btn btn-sm border btn-secondary" type="button">{wa}</button>

          </div>
        )
      }

    }
  }

    return (
      <>
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
        <Outlet />
      </>
    );
  };

  export default Header;