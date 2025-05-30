import Footer from '../components/Footer';
import DNOUptimeDisplay from '../components/DNOUptimeDisplay';
import { Link } from "react-router-dom";
import { cardanoGqlQuery, isEmpty } from '../components/Utility';
import { useEffect, useState } from 'react'
import { graphqlQuery } from '../components/Utility';


const M2NodeOperators = () => {
  const [balanceM2, setBalanceM2] = useState(0.00);

  useEffect(() => {

    const fetchData = async () => {

      let gq = `
            {
              getBalance(milestone: 2) {
                value
              }
            }   
              `
      let gqlData = await graphqlQuery(gq)
      console.log("Data: ", gqlData.data.getBalance.value)
      setBalanceM2(gqlData.data.getBalance.value);
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
              <h4><b>ADA {balanceM2.toFixed(2)}</b></h4>
              Current balance
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
