import { useMemo } from "react";

import { SitesTable } from "../components/SitesTable";
import { generateSites } from "../data/generateSites";

const SITE_COUNT = 100_000;

export function SitesPage() {
    const sites = useMemo(
        () => generateSites(SITE_COUNT),
        [],
    );

    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Sites
                </h1>

                <p className="text-body-secondary mb-0">
                    Large infrastructure dataset.
                </p>
            </div>

            <SitesTable sites={sites} />
        </div>
    );
}