import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";

import type { Site } from "../../sites/types/site";

interface SiteMapProps {
    sites: Site[];
}

const DEFAULT_CENTER: [number, number] = [
    50.4501,
    30.5234,
];

const DEFAULT_ZOOM = 6;

export function SiteMap({
                            sites,
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

            {sites.map((site) => (
                <Marker
                    key={site.id}
                    position={[
                        site.location.lat,
                        site.location.lng,
                    ]}
                >
                    <Popup>
                        <SitePopup site={site} />
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

interface SitePopupProps {
    site: Site;
}

function SitePopup({
                       site,
                   }: SitePopupProps) {
    return (
        <div>
            <div className="fw-semibold">
                {site.name}
            </div>

            <div>
                Region: {site.region}
            </div>

            <div>
                Status: {site.status}
            </div>

            <div>
                Users: {site.users.toLocaleString()}
            </div>

            <div className="small text-body-secondary mt-1">
                {site.location.lat.toFixed(5)},{" "}
                {site.location.lng.toFixed(5)}
            </div>
        </div>
    );
}