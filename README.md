# GeoOps Control Center

A high-performance geospatial SPA built to explore frontend
architecture, large dataset rendering, TypeScript, and browser
performance optimization.

> 🚧 Work in progress

The project is being developed incrementally. Each performance
optimization is implemented only after establishing and measuring a
baseline.

## Tech Stack

Currently implemented:

-   React
-   TypeScript
-   Vite
-   Bootstrap 5
-   SCSS

Planned:

-   TanStack Virtual
-   Web Workers
-   Leaflet
-   Protocol Buffers
-   Connect RPC / gRPC-Web
-   REST API
-   XLSX import/export
-   KMZ parsing
-   Playwright
-   Vitest

## Project Structure

``` text
geoops-control-center/
├── apps/
│   └── web/
│       └── src/
│           ├── app/
│           ├── components/
│           ├── features/
│           │   └── sites/
│           │       ├── components/
│           │       ├── data/
│           │       ├── pages/
│           │       └── types/
│           ├── hooks/
│           ├── services/
│           ├── styles/
│           ├── types/
│           └── workers/
│
├── packages/
│   ├── proto/
│   └── shared/
│
├── sample-data/
└── docs/
```

The frontend is organized primarily by feature rather than by component
type.

For example, everything related to sites is located under:

``` text
features/sites/
```

This keeps domain-specific components, types, data utilities, and pages
close together.

## Sites Dataset

The current implementation generates a synthetic infrastructure dataset.

Each site contains:

``` ts
interface Site {
  id: string;
  name: string;
  location: GeoPoint;
  status: SiteStatus;
  users: number;
  region: string;
}
```

Site status is represented as a TypeScript union:

``` ts
type SiteStatus =
  | "online"
  | "offline"
  | "maintenance";
```

This prevents invalid status values from entering the application at
compile time.

## Performance

Performance optimization is one of the main goals of the project.

Instead of immediately introducing optimization libraries, the project
first implements a naive solution to establish a baseline.

### Naive Table Rendering

The initial sites table renders every record directly using React:

``` tsx
<tbody>
  {sites.map((site) => (
    <SiteRow
      key={site.id}
      site={site}
    />
  ))}
</tbody>
```

A dataset containing **100,000 sites** therefore attempts to create:

-   100,000 `<tr>` elements
-   700,000 `<td>` elements
-   more than 800,000 DOM elements in total

During testing, attempting to render the complete 100,000-record dataset
caused the browser tab to become temporarily unresponsive.

This behavior is intentionally documented as the performance baseline
rather than treated as the final implementation.

For development, the naive implementation currently uses a smaller
dataset so that the page remains usable.

### Optimization Target

The next implementation will introduce list virtualization.

The goal is to keep the complete 100,000-record dataset in memory while
rendering only the rows currently visible inside the viewport.

The results will be compared against the naive implementation.

Metric                                       Naive   Virtualized
  -------------------- ----------------------------- -------------
Dataset size                               100,000       100,000
Rendered rows                              100,000           TBD
Approx. DOM nodes                         800,000+           TBD
UI responsiveness      Browser became unresponsive           TBD
Render performance                             TBD           TBD

Actual performance measurements will be added after the virtualized
implementation is completed.

## TypeScript

The project uses strict TypeScript typing.

Examples include:

-   explicit domain models
-   union types
-   generic utility functions
-   typed React props
-   `Record` mappings for exhaustive status handling
-   avoiding `any`

Example:

``` ts
const STATUS_CLASSES: Record<SiteStatus, string> = {
  online: "text-bg-success",
  offline: "text-bg-danger",
  maintenance: "text-bg-warning",
};
```

Adding a new `SiteStatus` without defining its corresponding UI
representation will therefore produce a TypeScript error.

## Roadmap

### Phase 1 --- Foundation

-   [x] React + TypeScript + Vite
-   [x] Bootstrap / SCSS
-   [x] Feature-based project structure
-   [x] Typed Site domain model
-   [x] Synthetic large dataset
-   [x] Naive table implementation
-   [x] Establish large-DOM performance baseline

### Phase 2 --- Rendering Performance

-   [ ] Virtualized table
-   [ ] Naive vs virtualized mode
-   [ ] React Profiler measurements
-   [ ] Performance dashboard

### Phase 3 --- Heavy Computation

-   [ ] Web Worker
-   [ ] Main thread vs Worker comparison
-   [ ] Large dataset filtering
-   [ ] Aggregation and statistics

### Phase 4 --- Geospatial

-   [ ] Leaflet map
-   [ ] Site markers
-   [ ] GeoJSON
-   [ ] KMZ import
-   [ ] Geographic filtering

### Phase 5 --- Data Import / Export

-   [ ] XLSX import
-   [ ] XLSX validation
-   [ ] Invalid row reporting
-   [ ] XLSX export

### Phase 6 --- API

-   [ ] Node.js API
-   [ ] REST JSON transport
-   [ ] Protocol Buffers
-   [ ] Connect RPC / gRPC-Web
-   [ ] REST vs Protobuf comparison
-   [ ] Server streaming

### Phase 7 --- Quality

-   [ ] Unit tests
-   [ ] Playwright E2E tests
-   [ ] CI
-   [ ] Architecture documentation
-   [ ] Final performance benchmarks

## Running Locally

Install dependencies:

``` bash
npm install
```

Start the frontend from the repository root:

``` bash
npm run dev:web
```

Or from `apps/web`:

``` bash
npm run dev
```

Create a production build:

``` bash
npm run build
```

## Project Goal

GeoOps Control Center is not intended to be a production geospatial
product.

Its goal is to demonstrate practical frontend engineering skills through
realistic technical problems, including:

-   working with large datasets
-   browser rendering performance
-   TypeScript domain modeling
-   React rendering optimization
-   off-main-thread computation
-   binary RPC communication
-   geospatial data processing
-   large file processing in the browser
-   responsive UI development

Performance-related features are implemented using a **baseline →
problem → optimization → measurement** approach rather than adding
optimization techniques without measurable justification.
