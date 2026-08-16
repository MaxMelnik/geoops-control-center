export type SiteStatus =
    | "online"
    | "offline"
    | "maintenance";

export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface Site {
    id: string;
    name: string;
    location: GeoPoint;
    status: SiteStatus;
    users: number;
    region: string;
}