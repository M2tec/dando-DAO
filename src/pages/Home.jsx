import { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import MilestoneCard from "../components/MilestoneCard";
import { graphqlQuery } from '../components/Utility';

const milestones = [
  {
    id: "M1",
    budget: 50000,
    subject: "Release",
    approvals: 0,
    refusals: 0,
    goveranaceName: "",
    governanceAction: "Completed",
    governancePayment: "500",
    remaining: 0
  },
  {
    id: "M2",
    budget: 50000,
    subject: "DNO operator fund",
    approvals: 0,
    refusals: 0,
    governanceName: "Eligible nodes",
    governanceAction: 6,
    governancePayment: "500",
    remaining: 48000
  },
  {
    id: "M3",
    budget: 30000,
    subject: "Education",
    approvals: 0,
    refusals: 0,
    governanceName: "Education tasks",
    governanceAction: 0,
    governancePayment: "0",
    remaining: 30000
  },
  {
    id: "M4",
    budget: 35000,
    subject: "Maintenance",
    approvals: 0,
    refusals: 0,
    governanceName: "Maintenance proposals",
    governanceAction: 0,
    governancePayment: "0",
    remaining: 35000
  },
];

const Home = () => {
  const [balanceM1, setBalanceM1] = useState(0.0);
  const [milestoneData, setMilestonData] = useState(milestones);

  useEffect(() => {

    const fetchData = async () => {

      let gq = `
            {
              getBalance(milestone: 1) {
                value
              }
            }   
              `
      let gqlData = await graphqlQuery(gq)
      console.log("Data: ", gqlData.data.getBalance.value)
      setBalanceM1(gqlData.data.getBalance.value);
    }

    fetchData()
      .catch(console.error);


  }, []);

  return (
    <>
      <div className="m-3">
        <h1 className="text-3xl mb-0"><b>Dandelion-lite Governance</b></h1>
        <p>Cardano decentralized server API's</p>

        <div className="container-fluid m-0">
          <div className="row gap-3">
            <div className="card mb-3 p-3 w-auto bg-secondary border-0 rounded-0" >
              <h4><b>ADA {balanceM1.toFixed(2)}</b></h4>
              Main wallet balance
            </div>
          </div>
        </div>

        <h2 className="font-bold mb-2"><b>Milestones Recap</b></h2>
        <div className="container-fluid p-0">
          <div className="row ">
            {milestoneData.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>

  )
};

export default Home;
