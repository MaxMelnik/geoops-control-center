import {
    useEffect,
    useRef,
} from "react";
import {
    useVirtualizer,
    type VirtualItem,
} from "@tanstack/react-virtual";

import type {Site} from "../types/site";

interface VirtualizedSitesTableProps {
    sites: Site[];
    onRenderedRowsChange?: (
        count: number,
    ) => void;
}

const ROW_HEIGHT = 45;

const STATUS_CLASSES: Record<Site["status"], string> = {
    online: "text-bg-success",
    offline: "text-bg-danger",
    maintenance: "text-bg-warning",
};

export function VirtualizedSitesTable({
                                          sites,
                                          onRenderedRowsChange,
                                      }: VirtualizedSitesTableProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: sites.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 10,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    useEffect(() => {
        onRenderedRowsChange?.(
            virtualRows.length,
        );
    }, [
        virtualRows.length,
        onRenderedRowsChange,
    ]);

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold">
          Sites
        </span>

                <span className="text-body-secondary small">
          {sites.length.toLocaleString()} records
        </span>
            </div>

            <div className="table-responsive">
                <div className="virtual-table-header">
                    <div>ID</div>
                    <div>Name</div>
                    <div>Region</div>
                    <div>Status</div>
                    <div>Users</div>
                    <div>Latitude</div>
                    <div>Longitude</div>
                </div>

                <div
                    ref={parentRef}
                    style={{
                        height: "400px",
                        overflow: "auto",
                    }}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: "relative",
                        }}
                    >
                        {virtualRows.map((virtualRow: VirtualItem) => {
                            const site = sites[virtualRow.index];

                            if (!site) {
                                return null;
                            }

                            return (
                                <div
                                    key={site.id}
                                    className="virtual-table-row"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    <div>{site.id}</div>

                                    <div>{site.name}</div>

                                    <div>{site.region}</div>

                                    <div>
                                        <StatusBadge
                                            status={site.status}
                                        />
                                    </div>

                                    <div>
                                        {site.users.toLocaleString()}
                                    </div>

                                    <div>
                                        {site.location.lat.toFixed(4)}
                                    </div>

                                    <div>
                                        {site.location.lng.toFixed(4)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatusBadgeProps {
    status: Site["status"];
}

function StatusBadge({
                         status,
                     }: StatusBadgeProps) {
    return (
        <span
            className={`badge ${STATUS_CLASSES[status]}`}
        >
      {status}
    </span>
    );
}
