import type { Site } from "../types/site";

import { SiteRow } from "./SiteRow";

interface SitesTableProps {
    sites: Site[];
}

export function SitesTable({
                               sites,
                           }: SitesTableProps) {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold">
          Sites
        </span>

                <span className="text-body-secondary small">
          {sites.length.toLocaleString()} records
        </span>
            </div>

            <div
                className="table-responsive"
                style={{
                    maxHeight: "600px",
                    overflow: "auto",
                }}
            >
                <table className="table table-hover table-striped mb-0">
                    <thead className="sticky-top">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Region</th>
                        <th>Status</th>
                        <th>Users</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                    </thead>

                    <tbody>
                    {sites.map((site) => (
                        <SiteRow
                            key={site.id}
                            site={site}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}