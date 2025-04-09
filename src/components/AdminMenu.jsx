import { isEmpty, handleGC } from "./Utility";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Gear } from "react-bootstrap-icons";


const AdminMenu = () => {
  const [walletAddress, setWalletAddress] = useState("")

  useEffect(() => {

  }, []);

    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="px-1 nav-item btn btn-secondary"><Link className="nav-link text-white"  to="/admin-users">Users</Link></li>
                <li className="px-1 nav-item btn btn-secondary mx-1"><Link className="nav-link text-white" to="/admin-payments">Payments</Link></li>
              </ul>

            </div>

          </div>
        </nav>
      </>
    );
  };

  export default AdminMenu;