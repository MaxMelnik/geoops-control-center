import {
    useMemo,
    useRef,
    useState,
} from "react";

import { generateSites } from "../../sites/data/generateSites";

import {
    aggregateSites,
    type RegionAggregation,
} from "../utils/aggregateSites";

type ComputationMode =
    | "main-thread"
    | "worker";

interface BenchmarkResult {
    duration: number;
    result: RegionAggregation[];
}

const SITE_COUNT = 100_000;

export function PerformancePage() {
    const [mode, setMode] =
        useState<ComputationMode>(
            "main-thread",
        );

    const [benchmark, setBenchmark] =
        useState<BenchmarkResult | null>(
            null,
        );

    const [isRunning, setIsRunning] =
        useState(false);

    const workerRef =
        useRef<Worker | null>(null);

    const sites = useMemo(
        () => generateSites(SITE_COUNT),
        [],
    );

    function runMainThreadBenchmark() {
        setIsRunning(true);
        setBenchmark(null);

        requestAnimationFrame(() => {
            const startTime =
                performance.now();

            const result =
                aggregateSites(sites);

            const duration =
                performance.now() -
                startTime;

            setBenchmark({
                duration,
                result,
            });

            setIsRunning(false);
        });
    }

    function runWorkerBenchmark() {
        setIsRunning(true);
        setBenchmark(null);

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
            event: MessageEvent<BenchmarkResult>,
        ) => {
            setBenchmark(event.data);
            setIsRunning(false);

            worker.terminate();
            workerRef.current = null;
        };

        worker.postMessage({
            sites,
        });
    }

    function runBenchmark() {
        if (mode === "main-thread") {
            runMainThreadBenchmark();
            return;
        }

        runWorkerBenchmark();
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Performance
                </h1>

                <p className="text-body-secondary mb-0">
                    Compare heavy computation on the main
                    thread and in a Web Worker.
                </p>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="fw-semibold mb-2">
                        Computation mode
                    </div>

                    <div
                        className="btn-group mb-4"
                        role="group"
                    >
                        <button
                            type="button"
                            className={
                                mode === "main-thread"
                                    ? "btn btn-primary"
                                    : "btn btn-outline-primary"
                            }
                            onClick={() =>
                                setMode("main-thread")
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
                            onClick={() =>
                                setMode("worker")
                            }
                        >
                            Web Worker
                        </button>
                    </div>

                    <div className="mb-4">
                        <div className="fw-semibold">
                            Task
                        </div>

                        <div className="text-body-secondary">
                            Aggregate 100,000 sites by
                            region and status.
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
                    value={SITE_COUNT.toLocaleString()}
                />

                <MetricCard
                    title="Mode"
                    value={
                        mode === "main-thread"
                            ? "Main Thread"
                            : "Web Worker"
                    }
                />

                <MetricCard
                    title="Duration"
                    value={
                        benchmark
                            ? `${benchmark.duration.toFixed(1)} ms`
                            : "—"
                    }
                />

                <MetricCard
                    title="Regions"
                    value={
                        benchmark
                            ? benchmark.result.length.toString()
                            : "—"
                    }
                />
            </div>

            {benchmark && (
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
                            {benchmark.result.map(
                                (region) => (
                                    <tr key={region.region}>
                                        <td>
                                            {region.region}
                                        </td>

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
                                ),
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
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