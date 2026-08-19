import { useMemo, useState } from "react";

import { SitesTable } from "../components/SitesTable";
import { VirtualizedSitesTable } from "../components/VirtualizedSitesTable";
import { generateSites } from "../data/generateSites";

type RenderMode = "naive" | "virtualized";

type DatasetSize = 1_000 | 10_000 | 100_000;

const DATASET_OPTIONS: DatasetSize[] = [
    1_000,
    10_000,
    100_000,
];

export function SitesPage() {
    const [renderMode, setRenderMode] =
        useState<RenderMode>("virtualized");

    const [datasetSize, setDatasetSize] =
        useState<DatasetSize>(100_000);

    const sites = useMemo(
        () => generateSites(datasetSize),
        [datasetSize],
    );

    const isNaive = renderMode === "naive";

    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Sites Performance Lab
                </h1>

                <p className="text-body-secondary mb-0">
                    Compare naive DOM rendering with virtualized rendering.
                </p>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-12 col-md-6">
                            <div className="fw-semibold mb-2">
                                Rendering mode
                            </div>

                            <div
                                className="btn-group"
                                role="group"
                                aria-label="Rendering mode"
                            >
                                <button
                                    type="button"
                                    className={
                                        renderMode === "naive"
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    onClick={() =>
                                        setRenderMode("naive")
                                    }
                                >
                                    Naive
                                </button>

                                <button
                                    type="button"
                                    className={
                                        renderMode === "virtualized"
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    onClick={() =>
                                        setRenderMode("virtualized")
                                    }
                                >
                                    Virtualized
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="fw-semibold mb-2">
                                Dataset size
                            </div>

                            <div
                                className="btn-group"
                                role="group"
                                aria-label="Dataset size"
                            >
                                {DATASET_OPTIONS.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={
                                            datasetSize === size
                                                ? "btn btn-secondary"
                                                : "btn btn-outline-secondary"
                                        }
                                        onClick={() =>
                                            setDatasetSize(size)
                                        }
                                    >
                                        {formatDatasetSize(size)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isNaive && datasetSize === 100_000 && (
                        <div
                            className="alert alert-warning mt-4 mb-0"
                            role="alert"
                        >
                            <strong>Performance warning:</strong>{" "}
                            Rendering 100,000 rows in naive mode may temporarily
                            freeze or crash the browser tab.
                        </div>
                    )}
                </div>
            </div>

            <div className="row g-3 mb-4">
                <MetricCard
                    title="Dataset"
                    value={datasetSize.toLocaleString()}
                />

                <MetricCard
                    title="Render mode"
                    value={
                        renderMode === "naive"
                            ? "Naive"
                            : "Virtualized"
                    }
                />

                <MetricCard
                    title="Rows in dataset"
                    value={sites.length.toLocaleString()}
                />

                <MetricCard
                    title="Strategy"
                    value={
                        renderMode === "naive"
                            ? "Render all"
                            : "Viewport only"
                    }
                />
            </div>

            {renderMode === "naive" ? (
                <SitesTable sites={sites} />
            ) : (
                <VirtualizedSitesTable sites={sites} />
            )}
        </div>
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
                    <div className="text-body-secondary small mb-1">
                        {title}
                    </div>

                    <div className="fs-4 fw-semibold">
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatDatasetSize(
    size: DatasetSize,
): string {
    if (size >= 1_000) {
        return `${size / 1_000}K`;
    }

    return size.toString();
}
