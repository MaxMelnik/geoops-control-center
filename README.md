# GeoOps Control Center

A high-performance geospatial SPA built to explore frontend architecture, large dataset rendering, TypeScript, and browser performance optimization.

> 🚧 Work in progress

The project is being developed incrementally. Performance optimizations are introduced after establishing a baseline and identifying a measurable problem.

## Tech Stack

Currently implemented:

- React
- TypeScript
- Vite
- Bootstrap 5
- SCSS
- TanStack Virtual
- React Profiler

Planned:

- Web Workers
- Leaflet
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

The frontend is organized primarily by feature rather than by component type.

For example, everything related to sites is located under:

```text
features/sites/
```

This keeps domain-specific components, types, data utilities, and pages close together.

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

The performance lab currently supports datasets containing:

- 1,000 sites
- 10,000 sites
- 100,000 sites

## Performance

Performance optimization is one of the main goals of the project.

Instead of immediately introducing optimization libraries, the project first implements a naive solution to establish a baseline and then introduces an optimized implementation for comparison.

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

This behavior is intentionally documented as the performance baseline rather than treated as the final implementation.

To keep the interactive demo safe and usable, Naive mode is limited to **10,000 records**.

The 100,000-record option is disabled while Naive mode is active.

### Virtualized Table Rendering

The optimized implementation uses `@tanstack/react-virtual`.

Instead of mounting every record into the DOM, the application keeps the complete dataset in memory while rendering only the rows currently visible in the scroll viewport, together with a small overscan buffer.

This allows the application to work with a dataset of **100,000 sites** without creating 100,000 DOM rows.

The number of mounted rows changes dynamically depending on the viewport and scroll position.

This significantly reduces DOM size and keeps scrolling responsive.

### Interactive Performance Lab

The application provides an interactive comparison between the two rendering strategies:

**Naive**

- renders every dataset row
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

### Runtime Metrics

The Performance Lab displays runtime information for the currently selected configuration:

- dataset size
- number of rendered rows
- React render duration
- rendering strategy

For example, Virtualized mode can keep:

```text
Dataset:       100,000
Rendered rows: viewport + overscan
Strategy:      Virtualized
```

while Naive mode mounts every selected record:

```text
Dataset:       10,000
Rendered rows: 10,000
Strategy:      Full DOM
```

The exact number of virtualized rows depends on the viewport size and configured overscan.

### React Profiler

React render duration is measured using the React `Profiler` API.

The application records the Profiler `actualDuration` after meaningful benchmark configuration changes, such as:

- changing the dataset size
- switching between Naive and Virtualized rendering

Profiler updates themselves are excluded from repeated measurements to avoid creating a measurement/render loop.

> React Profiler `actualDuration` measures React rendering work. It does not represent the complete amount of time for which the browser may be blocked.

Additional browser work can include:

- DOM updates
- style recalculation
- layout
- paint

Because of this, a naive render may visibly block the interface for longer than the React render duration reported by the Profiler.

### Current Performance Comparison

| Metric | Naive | Virtualized |
| --- | ---: | ---: |
| Maximum interactive dataset | 10,000 | 100,000 |
| Rendering strategy | Full DOM | Viewport virtualization |
| Rendered rows | All dataset rows | Visible rows + overscan |
| React render duration | Measured at runtime | Measured at runtime |
| UI responsiveness with large datasets | Noticeable blocking | Responsive |
| 100K mode | Disabled for safety | Supported |

Exact timing values depend on the browser, hardware, development/production mode, and current dataset configuration. For this reason, live measurements are displayed directly in the Performance Lab rather than hard-coded as universal benchmark results.

## TypeScript

The project uses strict TypeScript typing.

Examples include:

- explicit domain models
- union types
- generic utility functions
- typed React props
- exhaustive `Record` mappings
- typed React Profiler callbacks
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

## Roadmap

### Phase 1 — Foundation

- [x] React + TypeScript + Vite
- [x] Bootstrap / SCSS
- [x] Feature-based project structure
- [x] Typed Site domain model
- [x] Synthetic large dataset
- [x] Naive table implementation
- [x] Establish large-DOM performance baseline

### Phase 2 — Rendering Performance

- [x] Virtualized table
- [x] Naive vs Virtualized rendering
- [x] Dataset size selector
- [x] 100K virtualized dataset
- [x] Naive rendering safety limit
- [x] Rendered row metrics
- [x] React Profiler measurements
- [x] Interactive Performance Lab

### Phase 3 — Heavy Computation

- [ ] Web Worker
- [ ] Main thread vs Worker comparison
- [ ] Large dataset filtering
- [ ] Aggregation and statistics

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
- [ ] Final performance benchmarks

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
- off-main-thread computation
- binary RPC communication
- geospatial data processing
- large file processing in the browser
- responsive UI development

Performance-related features follow a:

**baseline → problem → optimization → measurement**

approach rather than adding optimization techniques without measurable justification.