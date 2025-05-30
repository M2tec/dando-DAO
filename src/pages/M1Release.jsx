import Footer from '../components/Footer';
import { graphqlQuery } from '../components/Utility';

const M1Release = () => {




  return (
    <>
      <div className="m-3">
      <h1 className="text-3xl font-bold mb-0"><b>Dandelion-lite Governance</b></h1>
        <p>Cardano decentralized server API's</p>

        <div className="container-fluid m-0">
          <div className="row gap-3">
            <div className="card mb-3 p-3 w-auto bg-secondary border-0 rounded-0" >
              <h4><b>ADA {balanceM1.toFixed(2)}</b></h4>
              to be distributed in next batch.
            </div>
            Completed
          </div>
        </div>
        </div>
      <Footer />

    </>
  )
};

export default M1Release;
