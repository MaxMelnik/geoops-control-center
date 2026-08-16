import type {Site, SiteStatus,} from "../types/site";

interface SiteRowProps {
    site: Site;
}

const STATUS_CLASSES: Record<SiteStatus, string> = {
    online: "text-bg-success",
    offline: "text-bg-danger",
    maintenance: "text-bg-warning",
};

export function SiteRow({site,}: SiteRowProps) {
    return (<tr>
        <td>{site.id}</td>
        <td>{site.name}</td>
        <td>{site.region}</td>
        <td><StatusBadge status={site.status}/></td>
        <td>{site.users.toLocaleString()}</td>
        <td>{site.location.lat.toFixed(4)}</td>
        <td>{site.location.lng.toFixed(4)}</td>
    </tr>);
}

interface StatusBadgeProps {
    status: SiteStatus;
}

function StatusBadge({status,}: StatusBadgeProps) {
    return (
        <span
            className={`badge ${STATUS_CLASSES[status]}`}
        >
            {status}
        </span>);
}