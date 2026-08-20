interface ComingSoonProps {
    title: string;
    description: string;
}

export function ComingSoon({
                               title,
                               description,
                           }: ComingSoonProps) {
    return (
        <div>
            <div className="mb-4">
                <h1 className="h3 mb-1">
                    {title}
                </h1>

                <p className="text-body-secondary mb-0">
                    {description}
                </p>
            </div>

            <div className="card">
                <div className="card-body py-5 text-center">
                    <div className="fs-4 fw-semibold mb-2">
                        Coming soon
                    </div>

                    <p className="text-body-secondary mb-0">
                        This feature is planned for a future development phase.
                    </p>
                </div>
            </div>
        </div>
    );
}