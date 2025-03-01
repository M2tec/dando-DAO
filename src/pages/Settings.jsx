import { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';


const Settings = () => {


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

            <div class="">
               <h2> Cardano Address</h2>
               addr_test1qz759fg46yvp28wrcmnxn87xq30yj6c8mh7y40zjnrg9h546h0qr3avqde9mumdaf4gykrtjz58l30g7mpy3r8nxku7q3dtrlt
            </div>

            <form>
              <div class="form-group mb-2">
                <label for="exampleFormControlInput1">Name</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Nike Hoskinson" />
              </div>
              <div class="form-group mb-2">
                <label for="exampleFormControlInput1">Node Url</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="https://server1.dandelion.link" />
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
