const NavBar = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#">M2 Dandelion nodes</a></li>
              <li className="nav-item"><a className="nav-link" href="#">M3 Education</a></li>
              <li className="nav-item"><a className="nav-link" href="#">M4 Maintanance</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };

export default NavBar;