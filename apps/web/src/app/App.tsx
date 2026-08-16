function App() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
          <span className="navbar-brand fw-semibold">
            GeoOps
          </span>

                    <div className="navbar-nav">
                        <a className="nav-link active" href="#">
                            Dashboard
                        </a>

                        <a className="nav-link" href="#">
                            Map
                        </a>

                        <a className="nav-link" href="#">
                            Imports
                        </a>

                        <a className="nav-link" href="#">
                            Performance
                        </a>
                    </div>
                </div>
            </nav>

            <main className="container-fluid py-4">
                <div className="mb-4">
                    <h1 className="h3 mb-1">Operations Dashboard</h1>

                    <p className="text-body-secondary mb-0">
                        Monitor and analyze geospatial infrastructure.
                    </p>
                </div>

                <div className="row g-3">
                    <MetricCard
                        title="Total sites"
                        value="100,000"
                    />

                    <MetricCard
                        title="Online"
                        value="82,341"
                    />

                    <MetricCard
                        title="Offline"
                        value="1,203"
                    />

                    <MetricCard
                        title="Alerts"
                        value="87"
                    />
                </div>
            </main>
        </>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
}

function MetricCard({
                        title,
                        value,
                    }: MetricCardProps) {
    return (
        <div className="col-12 col-sm-6 col-xl-3">
            <div className="card h-100">
                <div className="card-body">
                    <div className="text-body-secondary small">
                        {title}
                    </div>

                    <div className="fs-3 fw-semibold">
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;