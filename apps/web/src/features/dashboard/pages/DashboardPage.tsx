export function DashboardPage() {
    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    Operations Dashboard
                </h1>

                <p className="text-body-secondary mb-0">
                    GeoOps Control Center overview.
                </p>
            </div>

            <div className="row g-3">
                <DashboardCard
                    title="Sites"
                    value="100,000"
                    description="Synthetic infrastructure dataset"
                />

                <DashboardCard
                    title="Rendering"
                    value="Virtualized"
                    description="Large dataset optimization"
                />

                <DashboardCard
                    title="Max dataset"
                    value="100K"
                    description="Available in virtualized mode"
                />

                <DashboardCard
                    title="Status"
                    value="In progress"
                    description="Demo project development"
                />
            </div>
        </div>
    );
}

interface DashboardCardProps {
    title: string;
    value: string;
    description: string;
}

function DashboardCard({
                           title,
                           value,
                           description,
                       }: DashboardCardProps) {
    return (
        <div className="col-12 col-sm-6 col-xl-3">
            <div className="card h-100">
                <div className="card-body">
                    <div className="text-body-secondary small mb-1">
                        {title}
                    </div>

                    <div className="fs-4 fw-semibold mb-1">
                        {value}
                    </div>

                    <div className="text-body-secondary small">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}