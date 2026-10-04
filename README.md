# GeoOps Control Center

A high-performance geospatial SPA built to explore frontend architecture, large dataset rendering, TypeScript, browser performance, and off-main-thread computation.

> 🚧 Work in progress

The project is developed incrementally. Optimizations are introduced only after establishing a baseline, identifying a measurable problem, and comparing alternative implementations.

## Tech Stack

Currently implemented:

- React
- TypeScript
- Vite
- React Router
- Bootstrap 5
- SCSS
- TanStack Virtual
- React Profiler
- Web Workers

Planned:

- Leaflet
- GeoJSON
- Protocol Buffers
- Connect RPC / gRPC-Web
- REST API
- XLSX import/export
- KMZ parsing
- Playwright
- Vitest

## Project Structure

```text
geoops-control-center/
├── apps/
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── App.tsx
│           │   └── router.tsx
│           │
│           ├── components/
│           │   ├── layout/
│           │   └── ui/
│           │
│           ├── features/
│           │   ├── dashboard/
│           │   ├── imports/
│           │   ├── map/
│           │   ├── performance/
│           │   └── sites/
│           │       ├── components/
│           │       ├── data/
│           │       ├── pages/
│           │       └── types/
│           │
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

The frontend is organized primarily by feature rather than by component type.

For example:

```text
features/sites/
features/performance/
features/map/
```

This keeps domain-specific components, types, utilities, and pages close together while shared UI and application infrastructure remain outside individual features.

## SPA Navigation

The application uses React Router for client-side navigation.

Current routes include:

```text
/             → Dashboard
/sites        → Sites Performance Lab
/map          → Map
/imports      → Imports
/performance  → Web Worker Performance Lab
```

The application uses a shared responsive Bootstrap layout with active navigation state and mobile navigation support.

Navigation happens client-side without full page reloads.

## Sites Dataset

The current implementation generates a synthetic infrastructure dataset.

Each site contains:

```ts
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

```ts
type SiteStatus =
  | "online"
  | "offline"
  | "maintenance";
```

This prevents invalid status values from entering the application at compile time.

The rendering performance lab supports datasets containing:

- 1,000 sites
- 10,000 sites
- 100,000 sites

## Rendering Performance

Rendering large datasets is one of the first performance problems explored by the project.

Instead of immediately introducing virtualization, the project first implements a naive solution to establish a measurable baseline.

### Naive Table Rendering

The initial sites table renders every record directly using React:

```tsx
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

- 100,000 `<tr>` elements
- 700,000 `<td>` elements
- more than 800,000 DOM elements in total

During baseline testing, attempting to render the complete 100,000-record dataset caused the browser tab to become temporarily unresponsive.

This behavior is intentionally documented as the performance baseline rather than hidden from the demo.

To keep the interactive application safe and usable, Naive mode is limited to **10,000 records**.

The 100,000-record option is disabled while Naive mode is active.

### Virtualized Table Rendering

The optimized implementation uses `@tanstack/react-virtual`.

Instead of mounting every record into the DOM, the application keeps the complete dataset available while rendering only the rows currently visible in the scroll viewport together with a small overscan buffer.

This allows the application to work with a dataset of **100,000 sites** without creating 100,000 DOM rows.

The number of mounted rows changes dynamically depending on viewport size and scroll position.

This significantly reduces DOM size and keeps scrolling responsive.

### Interactive Rendering Comparison

The Sites Performance Lab allows switching between two rendering strategies:

**Naive**

- renders every selected dataset row
- creates one DOM row per record
- supports up to 10,000 records in the interactive demo

**Virtualized**

- keeps the complete dataset available
- mounts only visible rows plus overscan
- supports the full 100,000-record dataset

The user can switch between:

```text
Rendering mode

[ Naive ] [ Virtualized ]
```

and select a dataset:

```text
Dataset size

[ 1K ] [ 10K ] [ 100K ]
```

When Naive mode is active, the `100K` option is disabled to prevent browser lockups.

If the user switches from `100K / Virtualized` to Naive mode, the dataset is automatically reduced to the safe 10,000-record limit.

### Rendering Runtime Metrics

The rendering lab displays runtime information for the currently selected configuration:

- dataset size
- number of rendered rows
- React render duration
- rendering strategy

For example, Virtualized mode can maintain:

```text
Dataset:       100,000
Rendered rows: visible rows + overscan
Strategy:      Virtualized
```

while Naive mode mounts every selected record:

```text
Dataset:       10,000
Rendered rows: 10,000
Strategy:      Full DOM
```

The exact number of virtualized rows depends on viewport size and configured overscan.

### React Profiler

React render duration is measured using the React `Profiler` API.

The application records the Profiler `actualDuration` after meaningful benchmark configuration changes such as:

- changing dataset size
- switching between Naive and Virtualized rendering

Profiler-driven state updates are excluded from subsequent measurements to avoid creating a measurement/render loop.

> React Profiler `actualDuration` measures React rendering work. It does not represent the complete amount of time for which the browser may be blocked.

Additional browser work can include:

- DOM updates
- style recalculation
- layout
- paint

Because of this, a naive render may visibly block the interface for longer than the React render duration reported by the Profiler.

### Rendering Comparison

| Metric | Naive | Virtualized |
| --- | ---: | ---: |
| Maximum interactive dataset | 10,000 | 100,000 |
| Rendering strategy | Full DOM | Viewport virtualization |
| Rendered rows | All dataset rows | Visible rows + overscan |
| React render duration | Measured at runtime | Measured at runtime |
| UI responsiveness with large datasets | Noticeable blocking | Responsive |
| 100K mode | Disabled for safety | Supported |

Exact timing values depend on browser, hardware, development/production mode, and current dataset configuration. Live measurements are therefore displayed directly in the application instead of being treated as universal benchmark values.

## Web Worker Performance Lab

The project also explores CPU-bound computation and the effect of moving expensive work away from the browser main thread.

The Performance page compares:

```text
Execution

[ Main Thread ] [ Web Worker ]
```

using two different workloads:

```text
Workload

[ Light Aggregation ] [ Heavy Geo Analysis ]
```

The goal is not to demonstrate that Web Workers are always faster.

Instead, the lab demonstrates the trade-off between:

- computation cost
- Worker startup and communication overhead
- structured cloning
- main-thread blocking
- UI responsiveness

### Light Aggregation

The light workload aggregates **100,000 sites** by region and status.

It calculates values such as:

- number of sites per region
- online sites
- offline sites
- sites under maintenance
- total users

This computation is inexpensive enough to execute efficiently on the main thread.

Observed development measurement:

| Execution | Computation time |
| --- | ---: |
| Main Thread | ~5.2 ms |
| Web Worker | ~157.2 ms |

In this workload, the Worker is significantly slower because the computation itself is cheap while Worker creation and transferring a large object graph introduce additional overhead.

This demonstrates an important optimization principle:

> A large dataset alone is not a sufficient reason to use a Web Worker.

### Heavy Geo Analysis

The heavy workload performs a brute-force nearest-neighbour geospatial analysis.

For every site, the algorithm calculates its distance to every other site and finds the closest neighbour.

Distances are calculated using the Haversine formula.

The algorithm intentionally uses a brute-force approach:

```text
O(n²)
```

It is used as a realistic CPU-bound benchmark rather than as the preferred production algorithm for nearest-neighbour search.

A production implementation could instead use spatial indexing or another specialized nearest-neighbour data structure.

The initial 10,000-site benchmark required approximately:

```text
10,000 × 9,999
≈ 100 million distance comparisons
```

Observed development measurements:

| Execution | Computation time |
| --- | ---: |
| Main Thread | ~20,855.7 ms |
| Web Worker | ~21,435.0 ms |

The Worker did **not** make the computation itself faster.

Its computation time was approximately 2.8% higher in this test.

However, the important difference was main-thread availability:

**Main Thread**

```text
CPU-heavy computation
        ↓
JavaScript main thread blocked
        ↓
UI updates pause
        ↓
heartbeat freezes
```

**Web Worker**

```text
CPU-heavy computation
        ↓
Worker thread
        ↓
main thread remains available
        ↓
UI continues updating
```

The interactive demo now uses a smaller heavy workload to keep benchmark duration practical while still making main-thread blocking visible.

### UI Responsiveness Monitor

The Performance Lab contains a UI heartbeat that updates every 100 ms.

Its purpose is to make main-thread blocking directly visible without requiring DevTools.

During a heavy Main Thread benchmark:

```text
heartbeat running
      ↓
benchmark starts
      ↓
heartbeat freezes
      ↓
computation completes
      ↓
heartbeat continues
```

During the same workload in a Web Worker:

```text
heartbeat running
      ↓
benchmark starts
      ↓
heartbeat continues updating
      ↓
Worker returns result
```

The benchmark UI is rendered before CPU-heavy synchronous work begins so that the user can see the transition to the `Running...` state before the main thread becomes blocked.

### Web Worker Conclusion

The current benchmarks demonstrate two different cases:

| Workload | Main Thread | Web Worker | Conclusion |
| --- | --- | --- | --- |
| Light aggregation | Very fast | Much slower | Worker overhead is not justified |
| Heavy geo analysis | Blocks UI | UI remains responsive | Worker is useful despite additional overhead |

The optimization goal is therefore not:

```text
Web Worker = faster
```

but rather:

```text
Web Worker = move appropriate CPU-bound work off the main thread
```

## TypeScript

The project uses strict TypeScript typing.

Examples include:

- explicit domain models
- discriminated unions
- generic utility functions
- typed React props
- exhaustive `Record` mappings
- typed React Profiler callbacks
- typed Worker messages
- typed benchmark results
- avoiding `any`

Example:

```ts
const STATUS_CLASSES: Record<SiteStatus, string> = {
  online: "text-bg-success",
  offline: "text-bg-danger",
  maintenance: "text-bg-warning",
};
```

Adding a new `SiteStatus` without defining its corresponding UI representation will therefore produce a TypeScript error.

Benchmark results also use discriminated unions so that workload-specific result data can be handled safely.

## Roadmap

### Phase 1 — Foundation

- [x] React + TypeScript + Vite
- [x] Bootstrap / SCSS
- [x] Feature-based project structure
- [x] Typed Site domain model
- [x] Synthetic large dataset
- [x] Naive table implementation
- [x] Establish large-DOM performance baseline
- [x] SPA routing
- [x] Responsive application navigation

### Phase 2 — Rendering Performance

- [x] Virtualized table
- [x] Naive vs Virtualized rendering
- [x] Dataset size selector
- [x] 100K virtualized dataset
- [x] Naive rendering safety limit
- [x] Rendered row metrics
- [x] React Profiler measurements
- [x] Interactive rendering comparison

### Phase 3 — Heavy Computation

- [x] Web Worker integration
- [x] Main Thread vs Web Worker comparison
- [x] Light aggregation workload
- [x] Heavy CPU-bound workload
- [x] Brute-force nearest-neighbor geo analysis
- [x] Haversine distance calculation
- [x] UI responsiveness heartbeat
- [x] Worker overhead comparison
- [ ] Large dataset filtering

### Phase 4 — Geospatial

- [ ] Leaflet map
- [ ] Site markers
- [ ] GeoJSON
- [ ] KMZ import
- [ ] Geographic filtering

### Phase 5 — Data Import / Export

- [ ] XLSX import
- [ ] XLSX validation
- [ ] Invalid row reporting
- [ ] XLSX export

### Phase 6 — API

- [ ] Node.js API
- [ ] REST JSON transport
- [ ] Protocol Buffers
- [ ] Connect RPC / gRPC-Web
- [ ] REST vs Protobuf comparison
- [ ] Server streaming

### Phase 7 — Quality

- [ ] Unit tests
- [ ] Playwright E2E tests
- [ ] CI
- [ ] Architecture documentation
- [ ] Final production performance benchmarks

## Running Locally

Install dependencies:

```bash
npm install
```

Start the frontend from the repository root:

```bash
npm run dev:web
```

Or from `apps/web`:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Project Goal

GeoOps Control Center is not intended to be a production geospatial product.

Its goal is to demonstrate practical frontend engineering skills through realistic technical problems, including:

- working with large datasets
- browser rendering performance
- TypeScript domain modeling
- React rendering optimization
- list virtualization
- Event Loop and main-thread blocking
- off-main-thread computation
- Web Worker communication overhead
- binary RPC communication
- geospatial computation
- large file processing in the browser
- responsive UI development

Performance-related features follow a:

**baseline → problem → optimization → measurement → trade-off analysis**

approach rather than adding optimization techniques without measurable justification.