const MilestoneCard = ({ milestone }) => {

  function Budget({ budget }) {
    return (

      <div>
        <div class="text-white">
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
      <div class="container mb-3">
        <div class="row gap-3">
          <div class="col bg-light p-3">
            <h2><b>{approvals}</b></h2>
            <div>approvals</div>
          </div>

          <div class="col bg-light p-3">
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
      <div class="mt-2 mb-4">
        <div class="text-muted">
          <div><h5><b>{name} : {status}</b></h5></div>
          <div class="">Payment Schedule </div>
          <div>This Month: ADA {payment}</div>
        </div>
      </div>
    )
  }

  function FundStatus({ remaining, status }) {
    if (status == "Completed") {
      return (

        <div class="p-5 bg-success bg-rounded-md text-center text-white">
          <h2><b>{status}</b></h2>
        </div>
      )
    }

    return (

      <div class="p-4 bg-white rounded-md  text-muted">
        <h4 class="mb-4"><b>Remaining:</b></h4>
        <h2><b>ADA {remaining.toLocaleString()}</b></h2>
      </div>
    )

  }

  return (

    <div class="col mb-2">
      <div className="card h-100 p-3 bg-secondary border-0">

        <div class="d-flex align-items-start flex-column h-100">

          <h1 className=""><b><u>{milestone.id}</u></b></h1>

          <div class="mb-3">{milestone.subject}</div>

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

          <div class="mb-auto"></div>
          <div class="w-100 align-self-end">
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