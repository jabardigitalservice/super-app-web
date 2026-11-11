# Handoff — Jalan Aing `/jalan-aing/peta` revamp

Status as of 2026-11-11, branch `feat/jalan-aing-web`. **Nothing is committed yet**: all work is in the working tree.
The user plans another UX revamp. This file explains what exists now, why, and what is still open.

## 1. Context

- Stack: Nuxt 2 / Vue 2 (Options API), Tailwind + scoped CSS, Leaflet 1.9 + maplibre-gl-leaflet (basemap), Lato.
- Dev server: `npm run dev` → `http://localhost:3873/jalan-aing/peta`.
- Design tokens: `design.md`. Primary `#008444`, primary dark `#006430`; the page uses `--ja-map-green-dark: #0d6d43` and ink `#14233f`. No emoji, no unverified metrics.
- Repo rules in `../AGENTS.md`: never delete DB data or collections (not relevant to this frontend work).
- Visual references the user picked:
  - **Naver Map** (`https://map.naver.com/p?c=13.93,0,0,0,dh`): docked left panel (390px) with search at the top, fold tab on the panel edge, category chips on the map, basemap thumbnails top-right, controls bottom-right.
  - **Dribbble "Grove"** (`https://cdn.dribbble.com/userupload/16198938/file/original-76769f4b6ce847db07602f3932783905.png`): clean list rows, toggle switches, "Filters 8"-style count badge, dark-green selected pills.
  - Measurements of Naver were captured with the Replica skill into `.replica/naver/ref/blueprint.md` (`.replica/` is git-ignored). The Replica score against Naver is not meaningful, because the page mixes two references with our own content.

## 2. User preferences (explicit feedback, keep following)

- **No circles / "buled-buledan"**: no coloured dots on chips or layer rows, and no circular badges. Use rectangles with small radii. The switch knob is the only round element allowed.
- **Mobile: not too rounded**: 6–8px corners, 12–16px only on the tops of bottom sheets.
- **Loading must not be a spinning knob**: use a thin indeterminate progress bar (`.ja-layer-progress`).
- **Must feel native/smooth**: one easing everywhere, `cubic-bezier(0.32, 0.72, 0, 1)` (`--ja-ease-out`). Press feedback is `scale(0.96)`. Respect `prefers-reduced-motion`.
- **Use our own data first** (Jalan Aing datasets, MJT), with OSM as fallback/geometry only.
- Browser testing: use the user's existing Chrome tab via the `browser-harness` skill. **Do not open new tabs**; use `switch_tab` to the existing `localhost:3873` target. Reset `Emulation.clearDeviceMetricsOverride` after mobile checks.
- Communication: Indonesian, concise.

## 3. Files

| File | Role |
|---|---|
| `pages/jalan-aing/peta/index.vue` | Page shell: sidebar (search + layer panel / route panel), map canvas, chips, basemap switcher, fold tab, detail cards, all page state and search/route orchestration. Large (~2k lines): consider splitting. |
| `components/JalanAing/LayerPanel.vue` | Layer list (Grove-style rows + switches, section counts, Reset badge, legend). Desktop: docked in sidebar. Mobile: bottom sheet with native-feel drag (velocity flick, rubber band). |
| `components/JalanAing/RoutePanel.vue` | **New.** Route UI: A/B fields with search, swap, quick "Terdekat" targets, comparison list, detail views (Bus MJT timeline / Kendaraan + "Kondisi di rute" / Jalan kaki). Mobile: fields on top, body is a bottom sheet. |
| `components/JalanAing/LeafletMap.vue` | Map. Added: `basemap` watcher, `refreshSize()`, `searchActiveLayers(query, signal, { layerIds })` (now searches all point/line datasets, not only active), `prefetchSearchData()`, `getDatasets(ids)`, `datasetSnapshot(ids)`, `featureName(feature, id)`, `drawJourney({ lines, pins })`, `showRoute`, `showRoutePoints`, `clearRoute`, `fitRoute(coords, padding)`. `select-marker` payload now includes `lat/lng`. Route pin CSS in the global `<style>`. |
| `utils/jalan-aing-map-search.js` | Photon (OSM) search + MJT halte search. Halte results now tagged `source: 'dataset', layerId: 'busStops'`. |
| `utils/jalan-aing-routing.js` | **New.** OSRM FOSSGIS client (`routing.openstreetmap.de`, keyless, CORS `*`), Indonesian turn instructions, `formatDistance` / `formatDuration`. |
| `utils/jalan-aing-transit.js` | **New.** Bus MJT planner (direct + 1 transfer) from corridor polylines, ordered halte, `jam_ops`, live buses. `planTransit`, `nearestHalte`, `getCorridors`, `getLiveBuses`. |
| `utils/jalan-aing-route-insights.js` | **New.** `analyzeRoute(line, datasets, nameOf)` → provincial road sections, BPBD hazard zones, nearby RS/Puskesmas/Rest Area, APJ count, `pending` layer ids. |
| `utils/jalan-aing-geo.js` | **New.** Haversine, polyline decode, snapping, along-distance, slicing, sampling, bounds, point-in-polygon. |
| `.gitignore` | Added `.replica/`. |

## 4. Current behaviour (what a user sees)

### Desktop (≥768px)
- Header (`JalanAingHeader`) → **left sidebar 390px** (340px at ≤1100px) + map. The fold tab (23×46, radius `0 9 9 0`) collapses the sidebar with a margin-left transition and calls `refreshSize()` on `transitionend`.
- Sidebar top: search box (46px, 2px green border) with a **"Rute"** button inside. Below it, the layer panel.
- Map: **quick layer chips** top-left (text-only; dark green when on; dashed border when the dataset failed). **Basemap thumbnails** top-right (Peta = OpenFreeMap positron, Satelit = Esri, Detail = OSM; hidden ≤1100px). **Controls** bottom-right (37px, radius 4). Detail cards bottom-left.

### Mobile (≤767px)
- Search on top (48px), chips row below (horizontal scroll with a right-edge fade).
- **"Layer" button + count** bottom-right, "Lokasi saya" above it. Reset and the coordinates readout are hidden. Attribution is an (i) icon bottom-left.
- The layer panel, marker card, complaint card and place card all open as **bottom sheets** with a 12px top radius and a grab bar.

### Search
- Sources, grouped and ordered: **Layer aktif** → **Data Jalan Aing** (all point/line datasets, even if the layer is off) → **OpenStreetMap** (Photon, biased to Jawa Barat). Hazard polygons are only searched when that layer is on.
- Datasets load progressively: prefetch on input focus; results re-run in place when each dataset arrives (`refreshSearchResults`). While loading, the list shows "Masih memuat data Jalan Aing, hasil akan bertambah…".
- A result from an off layer shows a **"Tampilkan"** tag. Choosing it turns the layer on (`skipLayerSearch` guard), flies there and opens the detail card. OSM results open a "Hasil pencarian" card with "Rute ke sini".
- Other states: fewer than 3 characters → hint. Outside Jawa Barat → toast "Lokasi ini di luar Jawa Barat.". The first map tap while the list is open only closes the list.
- Hospital mode (`?mode=rumah-sakit`): only Rumah Sakit/Puskesmas, no OSM, header hidden.

### Layers
- Switches are never disabled while loading (background prefetch must not block them). "Memuat data…" and the progress bar show only when the layer is on.
- If a dataset fails, the layer switches itself off and shows "Gagal dimuat · nyalakan untuk coba lagi". Turning it on retries.
- Reset also sets the road filter back to `semua`.

### Routing ("Perjalanan")
- Entry points: "Rute ke sini" on marker/place cards, or the "Rute" button. **Start = Lokasi saya automatically** (asks for geolocation via `pendingLocationField`).
- The B field offers "Terdekat dari titik awal": Halte MJT, Rumah Sakit, Puskesmas, Rest Area (`routeToNearest`).
- Map taps set a point **only** after "Pilih di peta" (`routePickField`). Marker taps in route mode open the card with **"Jadikan titik awal" / "Jadikan tujuan"**.
- `planJourney()` runs in parallel:
  - **Bus MJT** (`planTransit`): our data only. Wait time comes from live bus positions (`waitSource: 'live'`) or falls back to a 12-minute estimate. Operating-hours warning.
  - **Kendaraan**: OSRM car route, then `analyzeRoute` with a dataset snapshot. It re-runs as each dataset lands (`updateDataAvailability` → `updateInsights`).
  - **Jalan kaki**: OSRM foot, only if the straight-line distance is ≤ 3 km.
- UI: comparison list ("Pilihan perjalanan"). The map previews the top option (`journeyPreviewKey`). Tapping a row opens its detail; "Semua pilihan" goes back.
  - Kendaraan detail: Jalan Provinsi sections, each with a **"Laporkan"** button (`reportAt` → `/jalan-aing/aduan?lat&lng`); hazards with level; facilities near the route; APJ count; directions folded away.
- Map drawing: corridor colour for rides, dotted grey for walks, small coloured squares at board/alight halte, yellow stripe over provincial sections, small orange/red squares at hazard entry points. A/B pins are dark/green squares.

## 5. Data sources

| Data | Endpoint | Notes |
|---|---|---|
| Jalan Aing GIS layers | `https://api-superapp-backend.staging.digitalservice.id/v1/jalanaing/geojson/<slug>` | **Very slow on staging**: rest-area ~1.4s, rumah-sakit ~12s, puskesmas ~42s; `jalan-provinsi` and `apj` timed out at more than 60s (curl). Hazard layers are large polygons. |
| MJT routes | `https://tfgb-api.up.railway.app/api/mjt/routes` | 16 records = 8 corridors × 2 directions (FD-1, FD-2, K1–K6). Same `route_id` for both directions; use `toward`. `points` = Google-encoded polyline. `shelters` ordered. `jam_ops` formats vary (`20:00` / `20.00`). Cached 24h in localStorage. |
| MJT live buses | `https://tfgb-api.up.railway.app/api/mjt/buses` | ~136 buses: `route_id`, `toward`, `lat`, `lon`, `ago` (seconds). |
| OSM search | Photon `https://photon.komoot.io/api/` | |
| Routing | `https://routing.openstreetmap.de/routed-{car,bike,foot}/route/v1/driving/...` | FOSSGIS, free, light use only. No traffic, and durations are optimistic. |
| Basemaps | OpenFreeMap positron, Esri World Imagery, OSM | CARTO tiles now return "API key required"; don't use them. |

## 6. Known issues / open decisions

1. **Backend performance** blocks dataset search and "Kondisi di rute". It needs caching, bbox-filtered endpoints, or a lightweight search index on the backend.
2. `pages/jalan-aing/peta/index.vue` is ~2k lines with many leftover overrides (old `.ja-map-header` CSS is dead code; the header lives in `JalanAingHeader`). A revamp should split it into search, cards and route orchestration (e.g. a composable/mixin).
3. Bus planner assumptions: ride speed 4.5 m/s plus a 25s dwell per halte; max walk 900m straight-line ×1.3; transfer radius 250m; at most 1 transfer. The score penalises walking ×0.8 and transfers +6 min. Transfer options are dropped unless they beat the best direct option by 5 min.
4. Leaflet uses `preferCanvas: true`, so CSS classes on polylines (e.g. a route draw animation) do nothing.
5. Desktop: folding the sidebar hides search. Should a floating search appear when folded? Undecided.
6. Mobile: zoom +/− are hidden (pre-existing). Undecided.
7. FOSSGIS routing usage policy: if traffic grows, self-host OSRM or move to OpenRouteService (free tier, needs a key).
8. Not done: a dedicated "Halte terdekat" quick action outside route mode; using the bus `points_offset` polyline; more than one transfer.

## 7. How to verify quickly

```bash
npm run dev   # port 3873
npx eslint --ext .vue,.js pages/jalan-aing/peta/index.vue components/JalanAing/RoutePanel.vue \
  components/JalanAing/LayerPanel.vue components/JalanAing/LeafletMap.vue \
  utils/jalan-aing-transit.js utils/jalan-aing-geo.js utils/jalan-aing-route-insights.js utils/jalan-aing-routing.js
```

Manual checks (desktop and 390×844 mobile):
- Search "hasan sadikin" → a Data Jalan Aing row with "Tampilkan" plus OSM rows.
- Rute: A = Alun-alun Bandung (-6.9218, 107.6070), B = Gedung Sate (-6.9025, 107.6188) → FD-1 (~34 min, live wait), K4, Kendaraan 4.2 km, Jalan kaki 3.4 km.
- Kendaraan detail → "Kondisi di rute" fills progressively.
- Layer sheet on mobile: drag down / flick to close.

In the browser console the page instance is `document.querySelector('.ja-map-page').__vue__` (e.g. `.setRoutePoint({ field, point })`).
