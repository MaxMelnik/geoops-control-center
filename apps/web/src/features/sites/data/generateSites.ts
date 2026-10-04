import type {
    Site,
    SiteStatus,
} from "../types/site";

interface RegionDefinition {
    name: string;
    lat: number;
    lng: number;
    spread: number;
}

const REGIONS = [
    {
        name: "Kyiv",
        lat: 50.4501,
        lng: 30.5234,
        spread: 0.7,
    },
    {
        name: "Lviv",
        lat: 49.8397,
        lng: 24.0297,
        spread: 0.65,
    },
    {
        name: "Odesa",
        lat: 46.4825,
        lng: 30.7233,
        spread: 0.65,
    },
    {
        name: "Dnipro",
        lat: 48.4647,
        lng: 35.0462,
        spread: 0.65,
    },
    {
        name: "Kharkiv",
        lat: 49.9935,
        lng: 36.2304,
        spread: 0.65,
    },
    {
        name: "Vinnytsia",
        lat: 49.2331,
        lng: 28.4682,
        spread: 0.6,
    },
    {
        name: "Poltava",
        lat: 49.5883,
        lng: 34.5514,
        spread: 0.65,
    },
    {
        name: "Cherkasy",
        lat: 49.4444,
        lng: 32.0598,
        spread: 0.65,
    },
    {
        name: "Zhytomyr",
        lat: 50.2547,
        lng: 28.6587,
        spread: 0.65,
    },
    {
        name: "Chernihiv",
        lat: 51.4982,
        lng: 31.2893,
        spread: 0.7,
    },
] as const satisfies readonly RegionDefinition[];

const STATUSES = [
    "online",
    "offline",
    "maintenance",
] as const satisfies readonly SiteStatus[];

function randomItem<T>(
    items: readonly T[],
): T {
    if (items.length === 0) {
        throw new Error(
            "Cannot select item from an empty array",
        );
    }

    const index = Math.floor(
        Math.random() * items.length,
    );

    return items[index]!;
}

function randomInteger(
    min: number,
    max: number,
): number {
    return Math.floor(
        Math.random() * (max - min + 1) + min,
    );
}

function randomOffset(
    spread: number,
): number {
    return (Math.random() - 0.5) * spread * 2;
}

function generateLocation(
    region: RegionDefinition,
): Site["location"] {
    return {
        lat:
            region.lat +
            randomOffset(region.spread),
        lng:
            region.lng +
            randomOffset(region.spread),
    };
}

export function generateSites(
    count: number,
): Site[] {
    return Array.from(
        { length: count },
        (_, index): Site => {
            const id = index + 1;
            const region = randomItem(REGIONS);

            return {
                id: `site-${id}`,
                name: `Site ${id
                    .toString()
                    .padStart(6, "0")}`,

                location: generateLocation(region),

                status: randomItem(STATUSES),

                users: randomInteger(0, 5000),

                region: region.name,
            };
        },
    );
}