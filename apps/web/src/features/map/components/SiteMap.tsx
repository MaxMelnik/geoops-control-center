import {
    MapContainer,
    TileLayer,
} from "react-leaflet";

import type { Site } from "../../sites/types/site";
import type { MarkerRenderingMode } from "../types/map";

import { ClusteredSiteMarkers } from "./ClusteredSiteMarkers";
import { IndividualSiteMarkers } from "./IndividualSiteMarkers";

interface SiteMapProps {
    sites: Site[];
    markerRenderingMode: MarkerRenderingMode;
}

const DEFAULT_CENTER: [number, number] = [
    49.0,
    31.0,
];

const DEFAULT_ZOOM = 6;

export function SiteMap({
                            sites,
                            markerRenderingMode,
                        }: SiteMapProps) {
    return (
        <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            className="site-map"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markerRenderingMode === "individual" ? (
                <IndividualSiteMarkers sites={sites} />
            ) : (
                <ClusteredSiteMarkers sites={sites} />
            )}
        </MapContainer>
    );
}