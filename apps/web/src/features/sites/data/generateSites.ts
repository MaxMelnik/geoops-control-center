import type { Site, SiteStatus } from "../types/site";

const REGIONS = [
    "Kyiv",
    "Lviv",
    "Odesa",
    "Dnipro",
    "Kharkiv",
    "Vinnytsia",
    "Poltava",
    "Cherkasy",
    "Zhytomyr",
    "Chernihiv",
] as const;

const STATUSES = [
    "online",
    "offline",
    "maintenance",
] as const satisfies readonly SiteStatus[];

function randomItem<T>(items: readonly T[]): T {
    if (items.length === 0) {
        throw new Error("Cannot select item from an empty array");
    }

    const index = Math.floor(Math.random() * items.length);

    return items[index]!;
}

function randomInteger(min: number, max: number): number {
    return Math.floor(
        Math.random() * (max - min + 1) + min,
    );
}

export function generateSites(count: number): Site[] {
    return Array.from(
        { length: count },
        (_, index): Site => {
            const id = index + 1;

            return {
                id: `site-${id}`,
                name: `Site ${id.toString().padStart(6, "0")}`,
                location: {
                    lat: 44 + Math.random() * 8,
                    lng: 22 + Math.random() * 18,
                },
                status: randomItem(STATUSES),
                users: randomInteger(0, 5000),
                region: randomItem(REGIONS),
            };
        },
    );
}