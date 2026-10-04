import {
    MapContainer,
    TileLayer,
} from "react-leaflet";

const DEFAULT_CENTER: [number, number] = [
    50.4501,
    30.5234,
];

const DEFAULT_ZOOM = 6;

export function SiteMap() {
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
        </MapContainer>
    );
}