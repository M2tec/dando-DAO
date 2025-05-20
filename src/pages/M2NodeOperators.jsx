import Footer from '../components/Footer';
import DNOUptimeDisplay from '../components/DNOUptimeDisplay';
import { Link } from "react-router-dom";
import { cardanoGqlQuery, isEmpty } from '../components/Utility';
import { useEffect, useState } from 'react'

const M2NodeOperators = () => {

      useEffect(() => {

        // let address = "addr1qyf6dew2e0sr5e64m75qsj93sxqql6psnxfqtshkajvng92z6d8h9ph2rdhd960pd029pkez6n46rl833l75u9ew80dsv4yxfw"

          const fetchData = async () => {
  
            let gq = `
                {
                  query { 
                    paymentAddresses(
                      addresses: 
                        "addr1qyf6dew2e0sr5e64m75qsj93sxqql6psnxfqtshkajvng92z6d8h9ph2rdhd960pd029pkez6n46rl833l75u9ew80dsv4yxfw"
                    )
                  { address summary { 
                      assetBalances {
                        asset {assetId}
                        quantity
                      }
                    }

                  }
                  }    
              `
              let gqlData = await cardanoGqlQuery(gq)
              console.log("Data: " + gqlData)
              // setDnoData(gqlData.data.queryDno);
          }
  
          fetchData()
              .catch(console.error);
      }, []);
  
  return (
    <>
      <div className="m-3">
      <h1 className="text-3xl font-bold mb-0"><b>Dandelion-lite Node Operator dashboard</b></h1>
        <p>Uptime display</p>

        <div className="container-fluid m-0">
          <div className="row gap-3">
            <div className="card mb-3 p-3 w-auto bg-secondary border-0 rounded-0" >
              <h4><b>ADA 2500.00</b></h4>
              to be distributed in next batch.
            </div>
            <DNOUptimeDisplay />
          </div>
        </div>
        </div>
        
      <Footer />
    </>
  )
};

export default M2NodeOperators;
