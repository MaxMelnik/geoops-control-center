import type { Site } from "../features/sites/types/site";

import {
    aggregateSites,
    type RegionAggregation,
} from "../features/performance/utils/aggregateSites";

interface WorkerRequest {
    sites: Site[];
}

interface WorkerResponse {
    duration: number;
    result: RegionAggregation[];
}

self.onmessage = (
    event: MessageEvent<WorkerRequest>,
) => {
    const startTime = performance.now();

    const result = aggregateSites(
        event.data.sites,
    );

    const duration =
        performance.now() - startTime;

    const response: WorkerResponse = {
        duration,
        result,
    };

    self.postMessage(response);
};