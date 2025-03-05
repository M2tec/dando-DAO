import { useEffect, useState } from 'react'
import UnimatrixListener from '../services/UnimatrixListener';
import Gun from 'gun';
import Signers from './Signers';
import Footer from '../components/Footer';
import MilestoneCard from "../components/MilestoneCard";


const milestones = [
  {
    id: "M1",
    budget: 50000,
    subject: "Release",
    approvals: 3,
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
    approvals: 1,
    refusals: 2,
    governanceName: "Eligible nodes",
    governanceAction: 6,
    governancePayment: "500",
    remaining: 48000
  },
  {
    id: "M3",
    budget: 30000,
    subject: "Education",
    approvals: 1,
    refusals: 1,
    governanceName: "Education tasks",
    governanceAction: 10,
    governancePayment: "600",
    remaining: 48000
  },
  {
    id: "M4",
    budget: 69000,
    subject: "Maintenance",
    approvals: 1,
    refusals: 0,
    governanceName: "Maintenance proposals",
    governanceAction: 6,
    governancePayment: "700",
    remaining: 48000
  },
];

const Home = () => {

  return (
    <>
      <div className="m-3">
        <h1 className="text-3xl mb-0"><b>Dandelion-lite Governance</b></h1>
        <p>Cardano decentralized server API's</p>

        <div className="container-fluid m-0">
          <div className="row gap-3">
            <div className="card mb-3 p-3 w-auto bg-secondary border-0 rounded-0" >
              <h4><b>ADA 2500.00</b></h4>
              to be distributed in next batch.
            </div>
          </div>
        </div>

        <h2 className="font-bold mb-2"><b>Milestones Recap</b></h2>
        <div className="container-fluid p-0">
          <div className="row ">
            {milestones.map((milestone) => (
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
