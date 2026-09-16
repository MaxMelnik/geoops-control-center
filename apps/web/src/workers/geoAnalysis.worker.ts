import type { Site } from "../features/sites/types/site";

import {
    analyzeNearestSites,
    type GeoAnalysisResult,
} from "../features/performance/utils/analyzeNearestSites";

interface GeoWorkerRequest {
    sites: Site[];
}

export interface GeoWorkerResponse {
    duration: number;
    result: GeoAnalysisResult;
}

self.onmessage = (
    event: MessageEvent<GeoWorkerRequest>,
) => {
    const startTime = performance.now();

    const result = analyzeNearestSites(
        event.data.sites,
    );

    const duration =
        performance.now() - startTime;

    const response: GeoWorkerResponse = {
        duration,
        result,
    };

    self.postMessage(response);
};