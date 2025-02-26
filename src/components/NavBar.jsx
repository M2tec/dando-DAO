const NavBar = () => {
    return (
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="px-1 nav-item"><a class="nav-link text-white" href="#">Home</a></li>
              <li class="px-1 nav-item"><a class="nav-link text-white" href="#">M2 Dandelion nodes</a></li>
              <li class="px-1 nav-item"><a class="nav-link text-white" href="#">M3 Education</a></li>
              <li class="px-1 nav-item"><a class="nav-link text-white" href="#">M4 Maintanance</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };

export default NavBar;