import { useMemo } from "react";

import { generateSites } from "../data/generateSites";
import { VirtualizedSitesTable } from "../components/VirtualizedSitesTable";
// import {SitesTable} from "../components/SitesTable.tsx";

const SITE_COUNT = 100;

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

            <VirtualizedSitesTable
                sites={sites}
            />
        </div>
    );
}
