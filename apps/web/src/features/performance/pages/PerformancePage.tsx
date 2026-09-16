import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {generateSites} from "../../sites/data/generateSites";

import {
    aggregateSites,
    type RegionAggregation,
} from "../utils/aggregateSites";

import {
    analyzeNearestSites,
    type GeoAnalysisResult,
} from "../utils/analyzeNearestSites";

type ComputationMode =
    | "main-thread"
    | "worker";

type Workload =
    | "aggregation"
    | "geo-analysis";

interface AggregationBenchmarkResult {
    type: "aggregation";
    duration: number;
    result: RegionAggregation[];
}

interface GeoBenchmarkResult {
    type: "geo-analysis";
    duration: number;
    result: GeoAnalysisResult;
}

type BenchmarkResult =
    | AggregationBenchmarkResult
    | GeoBenchmarkResult;

const AGGREGATION_SITE_COUNT = 100_000;
const GEO_SITE_COUNT = 5_000;

export function PerformancePage() {
    const [mode, setMode] =
        useState<ComputationMode>(
            "main-thread",
        );

    const [workload, setWorkload] =
        useState<Workload>("aggregation");

    const [benchmark, setBenchmark] =
        useState<BenchmarkResult | null>(
            null,
        );

    const [isRunning, setIsRunning] =
        useState(false);

    const [heartbeat, setHeartbeat] =
        useState(0);

    const workerRef =
        useRef<Worker | null>(null);

    const aggregationSites = useMemo(
        () =>
            generateSites(
                AGGREGATION_SITE_COUNT,
            ),
        [],
    );

    const geoSites = useMemo(
        () => generateSites(GEO_SITE_COUNT),
        [],
    );

    useEffect(() => {
        const intervalId =
            window.setInterval(() => {
                setHeartbeat(
                    (current) => current + 1,
                );
            }, 100);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    function handleWorkloadChange(
        nextWorkload: Workload,
    ) {
        setWorkload(nextWorkload);
        setBenchmark(null);
    }

    function handleModeChange(
        nextMode: ComputationMode,
    ) {
        setMode(nextMode);
        setBenchmark(null);
    }

    function runBenchmark() {
        setBenchmark(null);
        setIsRunning(true);

        /*
         * Allow React to render "Running..."
         * before intentionally blocking the main thread.
         */
        requestAnimationFrame(() => {
            if (workload === "aggregation") {
                if (mode === "main-thread") {
                    runAggregationMainThread();
                } else {
                    runAggregationWorker();
                }

                return;
            }

            if (mode === "main-thread") {
                runGeoMainThread();
            } else {
                runGeoWorker();
            }
        });
    }

    function runAggregationMainThread() {
        const startTime =
            performance.now();

        const result =
            aggregateSites(
                aggregationSites,
            );

        const duration =
            performance.now() -
            startTime;

        setBenchmark({
            type: "aggregation",
            duration,
            result,
        });

        setIsRunning(false);
    }

    function runAggregationWorker() {
        const worker = new Worker(
            new URL(
                "../../../workers/siteAggregation.worker.ts",
                import.meta.url,
            ),
            {
                type: "module",
            },
        );

        workerRef.current = worker;

        worker.onmessage = (
            event: MessageEvent<{
                duration: number;
                result: RegionAggregation[];
            }>,
        ) => {
            setBenchmark({
                type: "aggregation",
                duration: event.data.duration,
                result: event.data.result,
            });

            setIsRunning(false);

            worker.terminate();
            workerRef.current = null;
        };

        worker.onerror = () => {
            setIsRunning(false);

            worker.terminate();
            workerRef.current = null;
        };

        worker.postMessage({
            sites: aggregationSites,
        });
    }

    function runGeoMainThread() {
        const startTime =
            performance.now();

        const result =
            analyzeNearestSites(
                geoSites,
            );

        const duration =
            performance.now() -
            startTime;

        setBenchmark({
            type: "geo-analysis",
            duration,
            result,
        });

        setIsRunning(false);
    }

    function runGeoWorker() {
        const worker = new Worker(
            new URL(
                "../../../workers/geoAnalysis.worker.ts",
                import.meta.url,
            ),
            {
                type: "module",
            },
        );

        workerRef.current = worker;

        worker.onmessage = (
            event: MessageEvent<{
                duration: number;
                result: GeoAnalysisResult;
            }>,
        ) => {
            setBenchmark({
                type: "geo-analysis",
                duration: event.data.duration,
                result: event.data.result,
            });

            setIsRunning(false);

            worker.terminate();
            workerRef.current = null;
        };

        worker.onerror = () => {
            setIsRunning(false);

            worker.terminate();
            workerRef.current = null;
        };

        worker.postMessage({
            sites: geoSites,
        });
    }

    const currentDatasetSize =
        workload === "aggregation"
            ? AGGREGATION_SITE_COUNT
            : GEO_SITE_COUNT;

    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Web Worker Performance Lab
                </h1>

                <p className="text-body-secondary mb-0">
                    Compare CPU-bound work on the
                    browser main thread and a Web Worker.
                </p>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-12 col-lg-6">
                            <div className="fw-semibold mb-2">
                                Workload
                            </div>

                            <div
                                className="btn-group"
                                role="group"
                            >
                                <button
                                    type="button"
                                    className={
                                        workload ===
                                        "aggregation"
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    disabled={isRunning}
                                    onClick={() =>
                                        handleWorkloadChange(
                                            "aggregation",
                                        )
                                    }
                                >
                                    Light Aggregation
                                </button>

                                <button
                                    type="button"
                                    className={
                                        workload ===
                                        "geo-analysis"
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    disabled={isRunning}
                                    onClick={() =>
                                        handleWorkloadChange(
                                            "geo-analysis",
                                        )
                                    }
                                >
                                    Heavy Geo Analysis
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="fw-semibold mb-2">
                                Execution
                            </div>

                            <div
                                className="btn-group"
                                role="group"
                            >
                                <button
                                    type="button"
                                    className={
                                        mode === "main-thread"
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    disabled={isRunning}
                                    onClick={() =>
                                        handleModeChange(
                                            "main-thread",
                                        )
                                    }
                                >
                                    Main Thread
                                </button>

                                <button
                                    type="button"
                                    className={
                                        mode === "worker"
                                            ? "btn btn-primary"
                                            : "btn btn-outline-primary"
                                    }
                                    disabled={isRunning}
                                    onClick={() =>
                                        handleModeChange(
                                            "worker",
                                        )
                                    }
                                >
                                    Web Worker
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr/>

                    <div className="mb-3">
                        <div className="fw-semibold">
                            Current task
                        </div>

                        <div className="text-body-secondary">
                            {workload === "aggregation"
                                ? "Aggregate 100,000 sites by region and status."
                                : "Find the nearest site for every site using brute-force geospatial distance calculations."}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={runBenchmark}
                        disabled={isRunning}
                    >
                        {isRunning
                            ? "Running..."
                            : "Run benchmark"}
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <MetricCard
                    title="Dataset"
                    value={
                        currentDatasetSize.toLocaleString()
                    }
                    description="Sites processed"
                />

                <MetricCard
                    title="Execution"
                    value={
                        mode === "main-thread"
                            ? "Main Thread"
                            : "Web Worker"
                    }
                    description={
                        mode === "main-thread"
                            ? "Runs on UI thread"
                            : "Runs off main thread"
                    }
                />

                <MetricCard
                    title="Computation"
                    value={
                        benchmark
                            ? `${benchmark.duration.toFixed(1)} ms`
                            : "—"
                    }
                    description="Measured computation time"
                />

                <MetricCard
                    title="Workload"
                    value={
                        workload === "aggregation"
                            ? "Light"
                            : "Heavy"
                    }
                    description={
                        workload === "aggregation"
                            ? "Region/status aggregation"
                            : "O(n²) nearest-neighbour search"
                    }
                />
            </div>

            <ResponsivenessMonitor
                heartbeat={heartbeat}
                isRunning={isRunning}
                mode={mode}
            />

            <div className="fw-semibold">
                Main thread responsiveness
            </div>

            <div>
                Heartbeat:{" "}
                <strong>{heartbeat}</strong>
            </div>

            <div className="small mt-1">
                This counter is scheduled every
                100 ms. CPU-heavy work on the main
                thread prevents it from updating,
                while a Web Worker allows the UI
                thread to continue processing
                updates.
            </div>

            {benchmark?.type ===
                "aggregation" && (
                    <AggregationResults
                        result={benchmark.result}
                    />
                )}

            {benchmark?.type ===
                "geo-analysis" && (
                    <GeoResults
                        result={benchmark.result}
                    />
                )}
        </div>
    );
}

interface ResponsivenessMonitorProps {
    heartbeat: number;
    isRunning: boolean;
    mode: ComputationMode;
}

function ResponsivenessMonitor({
                                   heartbeat,
                                   isRunning,
                                   mode,
                               }: ResponsivenessMonitorProps) {
    const progress = (heartbeat * 5) % 100;

    return (
        <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold">
          UI Responsiveness Monitor
        </span>

                <span
                    className={
                        isRunning
                            ? "badge text-bg-success"
                            : "badge text-bg-secondary"
                    }
                >
          {isRunning
              ? "Benchmark running"
              : "Idle"}
        </span>
            </div>

            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
          <span>
            Main thread heartbeat
          </span>

                    <span className="font-monospace">
            #{heartbeat.toLocaleString()}
          </span>
                </div>

                <div
                    className="progress mb-3"
                    role="progressbar"
                    aria-label="UI heartbeat"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="progress-bar"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div className="small text-body-secondary">
                    {isRunning ? (
                        mode === "main-thread" ? (
                            <>
                                Heavy computation is running on the{" "}
                                <strong>main thread</strong>. If the
                                workload is expensive enough, this
                                heartbeat and the UI will temporarily
                                freeze.
                            </>
                        ) : (
                            <>
                                Computation is running in a{" "}
                                <strong>Web Worker</strong>. The heartbeat
                                should continue updating because the main
                                thread remains available.
                            </>
                        )
                    ) : (
                        <>
                            The heartbeat updates every 100 ms. Run the
                            same heavy workload using Main Thread and Web
                            Worker to compare UI responsiveness.
                        </>
                    )}
                </div>
            </div>
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

function AggregationResults({
                                result,
                            }: {
    result: RegionAggregation[];
}) {
    return (
        <div className="card">
            <div className="card-header fw-semibold">
                Aggregation result
            </div>

            <div className="table-responsive">
                <table className="table mb-0">
                    <thead>
                    <tr>
                        <th>Region</th>
                        <th>Total</th>
                        <th>Online</th>
                        <th>Offline</th>
                        <th>Maintenance</th>
                        <th>Users</th>
                    </tr>
                    </thead>

                    <tbody>
                    {result.map((region) => (
                        <tr key={region.region}>
                            <td>{region.region}</td>
                            <td>
                                {region.total.toLocaleString()}
                            </td>
                            <td>
                                {region.online.toLocaleString()}
                            </td>
                            <td>
                                {region.offline.toLocaleString()}
                            </td>
                            <td>
                                {region.maintenance.toLocaleString()}
                            </td>
                            <td>
                                {region.users.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function GeoResults({
                        result,
                    }: {
    result: GeoAnalysisResult;
}) {
    return (
        <div className="card">
            <div className="card-header fw-semibold">
                Geo analysis result
            </div>

            <div className="card-body">
                <div className="row g-3">
                    <ResultValue
                        label="Processed sites"
                        value={
                            result.processedSites.toLocaleString()
                        }
                    />

                    <ResultValue
                        label="Distance comparisons"
                        value={
                            result.comparisons.toLocaleString()
                        }
                    />

                    <ResultValue
                        label="Average nearest distance"
                        value={`${result.averageNearestDistanceKm.toFixed(3)} km`}
                    />

                    <ResultValue
                        label="Minimum nearest distance"
                        value={`${result.minNearestDistanceKm.toFixed(3)} km`}
                    />

                    <ResultValue
                        label="Maximum nearest distance"
                        value={`${result.maxNearestDistanceKm.toFixed(3)} km`}
                    />
                </div>
            </div>
        </div>
    );
}

function ResultValue({
                         label,
                         value,
                     }: {
    label: string;
    value: string;
}) {
    return (
        <div className="col-12 col-md-6 col-xl">
            <div className="text-body-secondary small">
                {label}
            </div>

            <div className="fw-semibold">
                {value}
            </div>
        </div>
    );
}