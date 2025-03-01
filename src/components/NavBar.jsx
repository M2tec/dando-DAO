import { handleGC } from "./Utility";
import { Link } from "react-router-dom";

const NavBar = () => {

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
        <Link className="nav-link text-white px-3" to="/settings">Settings</Link>
        <button onClick={handleLogin} className="btn btn-sm border btn-secondary" type="button">Login</button>
      </div>
    </nav>
  );
};

export default NavBar;