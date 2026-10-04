import { useMemo, useState } from "react";

import { SiteMap } from "../components/SiteMap";
import { generateSites } from "../../sites/data/generateSites";

type DatasetSize = 100 | 1_000 | 5_000;

const DATASET_OPTIONS: DatasetSize[] = [
    100,
    1_000,
    5_000,
];

export function MapPage() {
    const [datasetSize, setDatasetSize] =
        useState<DatasetSize>(100);

    const sites = useMemo(
        () => generateSites(datasetSize),
        [datasetSize],
    );

    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Infrastructure Map
                </h1>

                <p className="text-body-secondary mb-0">
                    Interactive geospatial visualization of
                    infrastructure sites.
                </p>
            </div>

            <div className="card mb-4">
                <div className="card-header">
          <span className="fw-semibold">
            Map Dataset
          </span>
                </div>

                <div className="card-body">
                    <div className="d-flex flex-wrap gap-2">
                        {DATASET_OPTIONS.map((size) => (
                            <button
                                key={size}
                                type="button"
                                className={
                                    datasetSize === size
                                        ? "btn btn-primary"
                                        : "btn btn-outline-primary"
                                }
                                onClick={() => setDatasetSize(size)}
                            >
                                {size.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <div className="small text-body-secondary mt-2">
                        Sites rendered as individual Leaflet markers.
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-semibold">
            Site Map
          </span>

                    <span className="badge text-bg-secondary">
            {sites.length.toLocaleString()} markers
          </span>
                </div>

                <div className="card-body p-0">
                    <SiteMap sites={sites} />
                </div>
            </div>
        </div>
    );
}