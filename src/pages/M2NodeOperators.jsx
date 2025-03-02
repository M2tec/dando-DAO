import Footer from '../components/Footer';
import DNOUptimeDisplay from '../components/DNOUptimeDisplay';

const M2NodeOperators = () => {
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
