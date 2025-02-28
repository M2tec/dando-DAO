const MilestoneCard = ({ milestone }) => {

  function Budget({ budget }) {
    return (

      <div>
        <div className="text-white">
          <div>Milestone Budget: </div>
          <h3><b>ADA {milestone.budget.toLocaleString()}</b></h3>
        </div>
      </div>
    )

  }
  function Voting({ status, approvals, refusals }) {
    if (status == "Completed") {
      return (<div></div>)
    }

    return (
      <div className="container mb-3">
        <div className="row gap-3">
          <div className="col bg-light p-3">
            <h2><b>{approvals}</b></h2>
            <div>approvals</div>
          </div>

          <div className="col bg-light p-3">
            <h2><b>{refusals}</b></h2>
            <div>refusals</div>
          </div>

        </div>
      </div>
    );
  };

  function GovernanaceStatus({ name, status, payment }) {

    if (status == "Completed") {
      return (<div></div>)
    }

    return (
      <div className="mt-2 mb-4">
        <div className="text-muted">
          <div><h5><b>{name} : {status}</b></h5></div>
          <div className="">Payment Schedule </div>
          <div>This Month: ADA {payment}</div>
        </div>
      </div>
    )
  }

  function FundStatus({ remaining, status }) {
    if (status == "Completed") {
      return (

        <div className="p-5 bg-success bg-rounded-md text-center text-white">
          <h2><b>{status}</b></h2>
        </div>
      )
    }

    return (

      <div className="p-4 bg-white rounded-md  text-muted">
        <h4 className="mb-4"><b>Remaining:</b></h4>
        <h2><b>ADA {remaining.toLocaleString()}</b></h2>
      </div>
    )

  }

  return (

    <div className="col mb-2">
      <div className="card h-100 p-3 bg-secondary border-0">

        <div className="d-flex align-items-start flex-column h-100">

          <h1 className=""><a href={milestone.id} className="text-black"><b><u>{milestone.id}</u></b></a></h1>

          <div className="mb-3">{milestone.subject}</div>

          <Voting 
            status={milestone.governanceAction}
            approvals={milestone.approvals}
            refusals={milestone.refusals}
            />

          <Budget
            budget={milestone.budget}
          />

          <GovernanaceStatus
            name={milestone.governanceName}
            status={milestone.governanceAction}
            payment={milestone.governancePayment}
          />

          <div className="mb-auto"></div>
          <div className="w-100 align-self-end">
            <FundStatus
              remaining={milestone.remaining}
              status={milestone.governanceAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default MilestoneCard;