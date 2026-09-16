import type { Site } from "../../sites/types/site";

export interface RegionAggregation {
    region: string;
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    users: number;
}

export function aggregateSites(
    sites: Site[],
): RegionAggregation[] {
    const aggregation = new Map<
        string,
        RegionAggregation
    >();

    for (const site of sites) {
        let region = aggregation.get(
            site.region,
        );

        if (!region) {
            region = {
                region: site.region,
                total: 0,
                online: 0,
                offline: 0,
                maintenance: 0,
                users: 0,
            };

            aggregation.set(
                site.region,
                region,
            );
        }

        region.total += 1;
        region.users += site.users;

        switch (site.status) {
            case "online":
                region.online += 1;
                break;

            case "offline":
                region.offline += 1;
                break;

            case "maintenance":
                region.maintenance += 1;
                break;
        }
    }

    return Array.from(
        aggregation.values(),
    );
}