import {
    NavLink,
    Outlet,
} from "react-router-dom";

import { Collapse } from "bootstrap";

export function AppLayout() {
    function closeMobileMenu() {
        const menu = document.getElementById(
            "mainNavigation",
        );

        if (!menu) {
            return;
        }

        const collapse =
            Collapse.getInstance(menu) ??
            new Collapse(menu, {
                toggle: false,
            });

        collapse.hide();
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <NavLink
                        className="navbar-brand fw-semibold"
                        to="/"
                        onClick={closeMobileMenu}
                    >
                        GeoOps
                    </NavLink>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavigation"
                        aria-controls="mainNavigation"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="mainNavigation"
                    >
                        <div className="navbar-nav">
                            <NavLink
                                to="/"
                                end
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/sites"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Sites
                            </NavLink>

                            <NavLink
                                to="/map"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Map
                            </NavLink>

                            <NavLink
                                to="/imports"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Imports
                            </NavLink>

                            <NavLink
                                to="/performance"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Performance
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container-fluid py-4">
                <Outlet />
            </main>
        </>
    );
}