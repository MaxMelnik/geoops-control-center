import {
    Profiler,
    useCallback,
    useMemo,
    useRef,
    useState,
    type ProfilerOnRenderCallback,
} from "react";

import {SitesTable} from "../components/SitesTable";
import {VirtualizedSitesTable} from "../components/VirtualizedSitesTable";
import {generateSites} from "../data/generateSites";

type RenderMode = "naive" | "virtualized";
type DatasetSize = 1_000 | 10_000 | 100_000;

type ProfilerPhase =
    Parameters<ProfilerOnRenderCallback>[1];

interface RenderMetrics {
    duration: number | null;
    phase: ProfilerPhase | null;
}

const DATASET_OPTIONS: DatasetSize[] = [
    1_000,
    10_000,
    100_000,
];

const MAX_NAIVE_DATASET = 10_000;

export function SitesPage() {
    const [renderMode, setRenderMode] =
        useState<RenderMode>("virtualized");

    const [datasetSize, setDatasetSize] =
        useState<DatasetSize>(100_000);

    const [renderMetrics, setRenderMetrics] =
        useState<RenderMetrics>({
            duration: null,
            phase: null,
        });

    const [
        virtualizedRenderedRows,
        setVirtualizedRenderedRows,
    ] = useState(0);

    const shouldCaptureRenderRef = useRef(true);

    const sites = useMemo(
        () => generateSites(datasetSize),
        [datasetSize],
    );

    const isNaive = renderMode === "naive";

    const renderedRows = isNaive
        ? datasetSize
        : virtualizedRenderedRows;

    const handleProfilerRender =
        useCallback<ProfilerOnRenderCallback>(
            (
                _id,
                phase,
                actualDuration,
            ) => {
                if (!shouldCaptureRenderRef.current) {
                    return;
                }

                // Важливо вимкнути capture ДО setState,
                // інакше оновлення метрики саме породить
                // наступний Profiler callback.
                shouldCaptureRenderRef.current = false;

                requestAnimationFrame(() => {
                    setRenderMetrics({
                        duration: actualDuration,
                        phase,
                    });
                });
            },
            [],
        );

    function handleRenderModeChange(
        mode: RenderMode,
    ) {
        shouldCaptureRenderRef.current = true;

        if (
            mode === "naive" &&
            datasetSize > MAX_NAIVE_DATASET
        ) {
            setDatasetSize(MAX_NAIVE_DATASET);
        }

        setRenderMode(mode);
    }

    function handleDatasetChange(
        size: DatasetSize,
    ) {
        if (
            renderMode === "naive" &&
            size > MAX_NAIVE_DATASET
        ) {
            return;
        }

        shouldCaptureRenderRef.current = true;

        setDatasetSize(size);
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Sites Performance Lab
                </h1>

                <p className="text-body-secondary mb-0">
                    Compare full DOM rendering with viewport
                    virtualization.
                </p>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-12 col-lg-6">
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
                                        isNaive
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    onClick={() =>
                                        handleRenderModeChange("naive")
                                    }
                                >
                                    Naive
                                </button>

                                <button
                                    type="button"
                                    className={
                                        !isNaive
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    onClick={() =>
                                        handleRenderModeChange(
                                            "virtualized",
                                        )
                                    }
                                >
                                    Virtualized
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="fw-semibold mb-2">
                                Dataset size
                            </div>

                            <div className="d-flex flex-wrap gap-2">
                                {DATASET_OPTIONS.map((size) => {
                                    const disabled =
                                        isNaive &&
                                        size > MAX_NAIVE_DATASET;

                                    const selected =
                                        datasetSize === size;

                                    return (
                                        <div
                                            key={size}
                                            className="position-relative"
                                        >
                                            <button
                                                type="button"
                                                disabled={disabled}
                                                className={
                                                    selected
                                                        ? "btn btn-secondary"
                                                        : "btn btn-outline-secondary"
                                                }
                                                onClick={() =>
                                                    handleDatasetChange(size)
                                                }
                                                title={
                                                    disabled
                                                        ? "100K is disabled in Naive mode because rendering all rows can freeze the browser."
                                                        : undefined
                                                }
                                            >
                                                {formatDatasetSize(size)}

                                                {disabled && (
                                                    <span
                                                        className="ms-2"
                                                        aria-hidden="true"
                                                    >
                            🔒
                          </span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {isNaive && (
                                <div className="form-text mt-2">
                                    Naive mode is limited to{" "}
                                    <strong>10K rows</strong> to prevent
                                    browser lockups. Use Virtualized mode
                                    for the 100K dataset.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <MetricCard
                    title="Dataset"
                    value={datasetSize.toLocaleString()}
                    description="Records in memory"
                />

                <MetricCard
                    title="React render"
                    value={
                        renderMetrics.duration === null
                            ? "—"
                            : `${renderMetrics.duration.toFixed(1)} ms`
                    }
                    description={
                        renderMetrics.phase
                            ? `Last ${renderMetrics.phase} benchmark`
                            : "Waiting for measurement"
                    }
                />

                <MetricCard
                    title="Rendered rows"
                    value={renderedRows.toLocaleString()}
                    description={
                        isNaive
                            ? "All rows mounted"
                            : "Visible rows + overscan"
                    }
                />

                <MetricCard
                    title="Strategy"
                    value={
                        isNaive
                            ? "Full DOM"
                            : "Virtualized"
                    }
                    description={
                        isNaive
                            ? "One DOM row per record"
                            : "Viewport-based rendering"
                    }
                />
            </div>

            {isNaive && (
                <div className="alert alert-warning d-flex gap-3 align-items-start">
          <span className="fs-4">
            ⚠️
          </span>

                    <div>
                        <div className="fw-semibold">
                            Naive rendering safety limit
                        </div>

                        <div>
                            A previous 100,000-row baseline caused
                            the browser tab to become unresponsive.
                            The interactive demo therefore caps naive
                            rendering at 10,000 records.
                        </div>
                    </div>
                </div>
            )}

            <Profiler
                id="SitesTable"
                onRender={handleProfilerRender}
            >
                {isNaive ? (
                    <SitesTable sites={sites}/>
                ) : (
                    <VirtualizedSitesTable
                        sites={sites}
                        onRenderedRowsChange={
                            setVirtualizedRenderedRows
                        }
                    />
                )}
            </Profiler>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
}

function MetricCard({
                        title,
                        value,
                        description,
                    }: MetricCardProps) {
    return (
        <div className="col-12 col-sm-6 col-xl-3">
            <div className="card h-100">
                <div className="card-body">
                    <div className="text-body-secondary small mb-1">
                        {title}
                    </div>

                    <div className="fs-4 fw-semibold mb-1">
                        {value}
                    </div>

                    <div className="text-body-secondary small">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatDatasetSize(
    size: DatasetSize,
): string {
    return `${size / 1_000}K`;
}