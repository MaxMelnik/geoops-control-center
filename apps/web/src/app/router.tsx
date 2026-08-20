import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { ImportsPage } from "../features/imports/pages/ImportsPage";
import { MapPage } from "../features/map/pages/MapPage";
import { PerformancePage } from "../features/performance/pages/PerformancePage";
import { SitesPage } from "../features/sites/pages/SitesPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "sites",
                element: <SitesPage />,
            },
            {
                path: "map",
                element: <MapPage />,
            },
            {
                path: "imports",
                element: <ImportsPage />,
            },
            {
                path: "performance",
                element: <PerformancePage />,
            },
        ],
    },
]);