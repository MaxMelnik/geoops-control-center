import { SiteMap } from "../components/SiteMap";

export function MapPage() {
    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Infrastructure Map
                </h1>

                <p className="text-body-secondary mb-0">
                    Interactive geospatial visualization
                    of infrastructure sites.
                </p>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-semibold">
            Site Map
          </span>

                    <span className="badge text-bg-secondary">
            Leaflet
          </span>
                </div>

                <div className="card-body p-0">
                    <SiteMap />
                </div>
            </div>
        </div>
    );
}