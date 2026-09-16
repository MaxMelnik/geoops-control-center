import type { Site } from "../../sites/types/site";

export interface GeoAnalysisResult {
    processedSites: number;
    comparisons: number;
    averageNearestDistanceKm: number;
    minNearestDistanceKm: number;
    maxNearestDistanceKm: number;
}

// brute-force nearest-neighbour algorithm O(n²)
export function analyzeNearestSites(
    sites: Site[],
): GeoAnalysisResult {
    if (sites.length < 2) {
        return {
            processedSites: sites.length,
            comparisons: 0,
            averageNearestDistanceKm: 0,
            minNearestDistanceKm: 0,
            maxNearestDistanceKm: 0,
        };
    }

    let totalNearestDistance = 0;
    let minNearestDistance = Number.POSITIVE_INFINITY;
    let maxNearestDistance = 0;
    let comparisons = 0;

    for (let i = 0; i < sites.length; i += 1) {
        const currentSite = sites[i];

        if (!currentSite) {
            continue;
        }

        let nearestDistance =
            Number.POSITIVE_INFINITY;

        for (let j = 0; j < sites.length; j += 1) {
            if (i === j) {
                continue;
            }

            const candidateSite = sites[j];

            if (!candidateSite) {
                continue;
            }

            const distance = haversineDistance(
                currentSite.location.lat,
                currentSite.location.lng,
                candidateSite.location.lat,
                candidateSite.location.lng,
            );

            comparisons += 1;

            if (distance < nearestDistance) {
                nearestDistance = distance;
            }
        }

        totalNearestDistance += nearestDistance;

        minNearestDistance = Math.min(
            minNearestDistance,
            nearestDistance,
        );

        maxNearestDistance = Math.max(
            maxNearestDistance,
            nearestDistance,
        );
    }

    return {
        processedSites: sites.length,
        comparisons,
        averageNearestDistanceKm:
            totalNearestDistance / sites.length,
        minNearestDistanceKm:
        minNearestDistance,
        maxNearestDistanceKm:
        maxNearestDistance,
    };
}

function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const EARTH_RADIUS_KM = 6371;

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const deltaLat = toRadians(
        lat2 - lat1,
    );

    const deltaLng = toRadians(
        lng2 - lng1,
    );

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLng / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a),
        );

    return EARTH_RADIUS_KM * c;
}

function toRadians(
    degrees: number,
): number {
    return degrees * (Math.PI / 180);
}