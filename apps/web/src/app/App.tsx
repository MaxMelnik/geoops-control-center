import { SitesPage } from "../features/sites/pages/SitesPage";

function App() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
          <span className="navbar-brand fw-semibold">
            GeoOps
          </span>

                    <div className="navbar-nav">
                        <a
                            className="nav-link"
                            href="#"
                        >
                            Dashboard
                        </a>

                        <a
                            className="nav-link active"
                            href="#"
                        >
                            Sites
                        </a>

                        <a
                            className="nav-link"
                            href="#"
                        >
                            Map
                        </a>

                        <a
                            className="nav-link"
                            href="#"
                        >
                            Imports
                        </a>

                        <a
                            className="nav-link"
                            href="#"
                        >
                            Performance
                        </a>
                    </div>
                </div>
            </nav>

            <main className="container-fluid py-4">
                <SitesPage />
            </main>
        </>
    );
}

export default App;