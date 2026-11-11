<template>
  <aside
    :class="
      mobileOpen
        ? 'is-sheet fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[800] flex h-[68svh] w-full max-w-none translate-y-0 flex-col rounded-t-[16px] border border-t shadow-2xl md:static md:bottom-auto md:h-full md:translate-y-0 md:rounded-none md:border-0 md:shadow-none'
        : 'fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[800] flex h-[68svh] w-full max-w-none translate-y-full pointer-events-none flex-col rounded-t-[16px] border border-t shadow-2xl md:static md:bottom-auto md:h-full md:translate-y-0 md:pointer-events-auto md:rounded-none md:border-0 md:shadow-none'
    "
    :style="
      sheetDragging
        ? { transform: `translateY(${sheetDragY}px)`, transition: 'none' }
        : null
    "
    class="ja-layer-panel flex-col flex-shrink-0 min-h-0 overflow-hidden bg-white border-slate-200 font-lato text-slate-800"
  >
    <div
      class="ja-layer-head"
      :class="mobileOpen ? 'touch-none select-none' : ''"
      @pointerdown="startSheetGesture"
      @pointermove="moveSheetGesture"
      @pointerup="endSheetGesture"
      @pointercancel="cancelSheetGesture"
    >
      <span v-if="mobileOpen" class="ja-layer-grabber" aria-hidden="true" />
      <div class="ja-layer-head-row">
        <div class="min-w-0">
          <h2 class="ja-layer-title">Layer peta</h2>
          <p class="ja-layer-count" aria-live="polite">
            {{
              activeCount
                ? `${activeCount} layer aktif`
                : 'Belum ada layer aktif'
            }}
          </p>
        </div>
        <button
          v-if="activeCount"
          type="button"
          class="ja-layer-reset"
          @pointerdown.stop
          @click="$emit('reset-layers')"
        >
          Reset <span class="ja-layer-badge">{{ activeCount }}</span>
        </button>
        <button
          v-if="mobileOpen"
          type="button"
          class="ja-layer-close"
          aria-label="Tutup layer"
          @pointerdown.stop
          @click="$emit('close')"
        >
          <Icon name="times" size="18px" />
        </button>
      </div>
    </div>

    <div class="ja-layer-scroll">
      <section
        v-for="section in visibleSections"
        :key="section.id"
        class="ja-layer-section"
      >
        <button
          type="button"
          class="ja-layer-section-toggle"
          :aria-expanded="String(openSections[section.id])"
          @click="toggleSection(section.id)"
        >
          <span class="ja-layer-section-label">{{ section.label }}</span>
          <span
            v-if="sectionActiveCount(section)"
            class="ja-layer-section-count"
            >{{ sectionActiveCount(section) }}</span
          >
          <span
            class="ja-layer-chevron"
            :class="{ 'is-open': openSections[section.id] }"
            ><Icon name="chevron-down" size="16px"
          /></span>
        </button>

        <transition name="layer-expand">
          <ul v-if="openSections[section.id]" class="ja-layer-list">
            <li
              v-for="item in section.items"
              :key="item.id"
              class="ja-layer-row"
              :class="{
                'is-on': layerVisibility[item.id],
                'is-unavailable': !dataAvailability[item.id],
              }"
            >
              <div class="ja-layer-row-main">
                <span class="ja-layer-text">
                  <span class="ja-layer-name">{{ item.label }}</span>
                  <span class="ja-layer-meta">
                    {{
                      !dataAvailability[item.id]
                        ? 'Gagal dimuat · nyalakan untuk coba lagi'
                        : layerLoading[item.id] && layerVisibility[item.id]
                        ? 'Memuat data…'
                        : section.label
                    }}
                  </span>
                </span>
                <button
                  type="button"
                  role="switch"
                  class="ja-layer-switch"
                  :class="{
                    'is-on': layerVisibility[item.id],
                    'is-loading':
                      layerLoading[item.id] && layerVisibility[item.id],
                  }"
                  :aria-busy="
                    String(Boolean(layerLoading[item.id] && layerVisibility[item.id]))
                  "
                  :aria-checked="String(Boolean(layerVisibility[item.id]))"
                  :aria-label="item.label"
                  @click="toggleLayer(item.id)"
                >
                  <span class="ja-layer-knob" aria-hidden="true" />
                </button>
              </div>

              <div
                v-if="layerLoading[item.id] && layerVisibility[item.id]"
                class="ja-layer-progress"
                role="progressbar"
                :aria-label="`Memuat ${item.label}`"
              />
              <div
                v-if="item.id === 'ruasJalan' && layerVisibility[item.id]"
                class="ja-layer-filters"
                role="group"
                aria-label="Kelas jalan"
              >
                <button
                  v-for="status in roadStatuses"
                  :key="status.value"
                  type="button"
                  class="ja-layer-filter"
                  :class="{ 'is-on': filterStatus.roadClass === status.value }"
                  :aria-pressed="String(filterStatus.roadClass === status.value)"
                  @click="updateFilter('roadClass', status.value)"
                >
                  {{ status.label }}
                </button>
              </div>
            </li>
          </ul>
        </transition>
      </section>
    </div>

    <div v-if="activeLegendItems.length" class="ja-layer-legend">
      <h3>Legenda</h3>
      <ul>
        <li v-for="legend in activeLegendItems" :key="legend.id">
          <span class="ja-layer-legend-bar" :style="legendStyle(legend)" />
          <span>{{ legend.label }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
const HAZARD_LEGEND_ITEMS = [
  { id: 'hazard-low', label: 'Tingkat bahaya rendah', color: '#16A34A' },
  { id: 'hazard-medium', label: 'Tingkat bahaya sedang', color: '#F59E0B' },
  { id: 'hazard-high', label: 'Tingkat bahaya tinggi', color: '#DC2626' },
]

export default {
  name: 'JalanAingLayerPanel',
  props: {
    hospitalMode: { type: Boolean, default: false },
    mobileOpen: { type: Boolean, default: false },
    layerVisibility: { type: Object, required: true },
    filterStatus: { type: Object, required: true },
    dataAvailability: { type: Object, required: true },
    layerLoading: { type: Object, default: () => ({}) },
    legendColors: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      sheetDragY: 0,
      sheetPointerId: null,
      sheetDragStartY: 0,
      sheetDragging: false,
      sheetLastY: 0,
      sheetLastTime: 0,
      sheetVelocity: 0,
      openSections: {
        bus: true,
        dbmpr: false,
        dinkes: false,
        dishub: false,
        bpbd: false,
      },
      roadStatuses: [
        { value: 'semua', label: 'Semua' },
        { value: 'arteri_primer', label: 'Arteri Primer' },
        { value: 'kolektor_primer', label: 'Kolektor Primer' },
        { value: 'jalan_tol', label: 'Jalan Tol' },
      ],
      sections: [
        {
          id: 'bus',
          label: 'Bus',
          color: 'bg-sky-500',
          items: [
            { id: 'bus', label: 'Posisi Bus Real-time', color: '#0EA5E9' },
            { id: 'busStops', label: 'Halte Bus', color: '#2563EB' },
          ],
        },
        {
          id: 'dbmpr',
          label: 'Dinas Bina Marga (DBMPR)',
          color: 'bg-emerald-600',
          items: [
            { id: 'ruasJalan', label: 'Jalan Provinsi', color: '#008444' },
            { id: 'apj', label: 'APJ', color: '#F59E0B' },
          ],
        },
        {
          id: 'dinkes',
          label: 'Kesehatan',
          color: 'bg-teal-700',
          items: [
            { id: 'rumahSakit', label: 'Rumah Sakit', color: '#0F766E' },
            { id: 'puskesmas', label: 'Puskesmas', color: '#2563EB' },
          ],
        },
        {
          id: 'dishub',
          label: 'Dinas Perhubungan (Dishub)',
          color: 'bg-amber-500',
          items: [{ id: 'restArea', label: 'Rest Area', color: '#D97706' }],
        },
        {
          id: 'bpbd',
          label: 'Kebencanaan (BPBD)',
          color: 'bg-rose-600',
          items: [
            { id: 'bahayaBanjir', label: 'Bahaya Banjir', color: '#0284C7' },
            {
              id: 'bahayaBanjirBandang',
              label: 'Bahaya Banjir Bandang',
              color: '#0369A1',
            },
            {
              id: 'bahayaCuacaEkstrem',
              label: 'Bahaya Cuaca Ekstrem',
              color: '#7C3AED',
            },
            {
              id: 'bahayaGempaBumi',
              label: 'Bahaya Gempa Bumi',
              color: '#DC2626',
            },
            {
              id: 'bahayaKebakaranHutanDanLahan',
              label: 'Bahaya Kebakaran Hutan dan Lahan',
              color: '#EA580C',
            },
            {
              id: 'bahayaKekeringan',
              label: 'Bahaya Kekeringan',
              color: '#CA8A04',
            },
            {
              id: 'bahayaTanahLongsor',
              label: 'Bahaya Tanah Longsor',
              color: '#92400E',
            },
            { id: 'bahayaTsunami', label: 'Bahaya Tsunami', color: '#0891B2' },
            {
              id: 'indeksMultibahayaBencana',
              label: 'Indeks Multibahaya Bencana',
              color: '#BE123C',
            },
          ],
        },
      ],
    }
  },
  computed: {
    activeCount() {
      return this.visibleSections
        .flatMap((section) => section.items)
        .filter((item) => this.layerVisibility[item.id]).length
    },
    visibleSections() {
      return this.hospitalMode
        ? this.sections.filter((section) => section.id === 'dinkes')
        : this.sections
    },
    activeLegendItems() {
      const activeItems = this.visibleSections
        .flatMap((section) => section.items)
        .filter((item) => this.layerVisibility[item.id])
      const hazardActive = activeItems.some(
        (item) =>
          item.id.startsWith('bahaya') || item.id === 'indeksMultibahayaBencana'
      )
      return [
        ...activeItems.filter(
          (item) =>
            !item.id.startsWith('bahaya') &&
            item.id !== 'indeksMultibahayaBencana'
        ),
        ...(hazardActive ? HAZARD_LEGEND_ITEMS : []),
      ]
    },
  },
  watch: {
    hospitalMode: {
      immediate: true,
      handler(value) {
        this.openSections.dinkes = value
      },
    },
    mobileOpen(value) {
      if (value) this.openSections.bus = true
    },
  },
  methods: {
    startSheetGesture(event) {
      if (
        !this.mobileOpen ||
        (event.pointerType === 'mouse' && event.button !== 0)
      )
        return

      this.sheetPointerId = event.pointerId
      this.sheetDragStartY = event.clientY
      this.sheetLastY = event.clientY
      this.sheetLastTime = event.timeStamp
      this.sheetVelocity = 0
      this.sheetDragY = 0
      this.sheetDragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    moveSheetGesture(event) {
      if (!this.sheetDragging || event.pointerId !== this.sheetPointerId) return

      const delta = event.clientY - this.sheetDragStartY
      // Follow the finger downwards; resist upward pulls like a native sheet.
      this.sheetDragY = delta >= 0 ? delta : -Math.min(24, Math.sqrt(-delta) * 3)
      const elapsed = event.timeStamp - this.sheetLastTime
      if (elapsed > 0)
        this.sheetVelocity = (event.clientY - this.sheetLastY) / elapsed
      this.sheetLastY = event.clientY
      this.sheetLastTime = event.timeStamp
      event.preventDefault()
    },
    endSheetGesture(event) {
      if (!this.sheetDragging || event.pointerId !== this.sheetPointerId) return

      const shouldClose =
        this.sheetDragY >= 96 ||
        (this.sheetVelocity > 0.45 && this.sheetDragY > 12)
      this.cancelSheetGesture(event)
      if (shouldClose) this.$emit('close')
    },
    cancelSheetGesture(event) {
      if (
        this.sheetPointerId !== null &&
        event.pointerId !== this.sheetPointerId
      )
        return

      this.sheetDragY = 0
      this.sheetPointerId = null
      this.sheetDragging = false
    },
    sectionActiveCount(section) {
      return section.items.filter((item) => this.layerVisibility[item.id])
        .length
    },
    toggleSection(id) {
      this.openSections[id] = !this.openSections[id]
    },
    toggleLayer(id) {
      this.$emit('toggle-layer', { id, value: !this.layerVisibility[id] })
    },
    legendStyle(legend) {
      const colors = this.legendColors[legend.id]
      if (!colors?.length) return { backgroundColor: legend.color }
      const width = 100 / colors.length
      const stripes = colors.map(
        (color, index) =>
          `${color} ${index * width}%, ${color} ${(index + 1) * width}%`
      )
      return { background: `linear-gradient(90deg, ${stripes.join(', ')})` }
    },
    updateFilter(key, value) {
      this.$emit('update-filter', { key, value })
    },
  },
}
</script>

<style scoped>
aside {
  flex-direction: column;
}
.ja-layer-panel {
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
  --ja-ink: #14233f;
  --ja-muted: #68758a;
  --ja-rule: #e7ece9;
  --ja-green: #0d6d43;
  --ja-green-soft: #e6f6ec;
}
.ja-layer-head {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--ja-rule);
}
.ja-layer-grabber {
  display: block;
  width: 40px;
  height: 4px;
  margin: -8px auto 12px;
  border-radius: 999px;
  background: #d5dbe3;
}
.ja-layer-head-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ja-layer-head-row > .min-w-0 {
  flex: 1;
}
.ja-layer-title {
  margin: 0;
  color: var(--ja-ink);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
}
.ja-layer-count {
  margin: 2px 0 0;
  color: var(--ja-muted);
  font-size: 12px;
}
.ja-layer-reset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 6px 0 12px;
  border: 1px solid #d9dfe6;
  border-radius: 9px;
  background: #fff;
  color: var(--ja-ink);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.ja-layer-reset:hover {
  border-color: var(--ja-green);
}
.ja-layer-badge {
  display: inline-grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  padding: 0 6px;
  border-radius: 6px;
  background: var(--ja-green);
  color: #fff;
  font-size: 12px;
}
.ja-layer-close {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
}
.ja-layer-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px 0 12px;
}
.ja-layer-section + .ja-layer-section {
  border-top: 1px solid var(--ja-rule);
}
.ja-layer-section-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 14px 20px 10px;
  border: 0;
  background: transparent;
  color: var(--ja-muted);
  cursor: pointer;
  text-align: left;
}
.ja-layer-section-label {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ja-layer-section-count {
  display: inline-grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  padding: 0 6px;
  border-radius: 6px;
  background: var(--ja-green-soft);
  color: var(--ja-green);
  font-size: 11px;
  font-weight: 800;
}
.ja-layer-chevron {
  display: grid;
  transition: transform 200ms ease;
}
.ja-layer-chevron.is-open {
  transform: rotate(180deg);
}
.ja-layer-list {
  margin: 0;
  padding: 0 0 6px;
  list-style: none;
}
.ja-layer-row {
  margin: 0 12px;
  padding: 10px 8px;
  border-radius: 12px;
  transition: background-color 160ms ease;
}
.ja-layer-row + .ja-layer-row {
  margin-top: 2px;
}
.ja-layer-row:hover {
  background: #f6f8f7;
}
.ja-layer-row.is-on {
  background: #f1f8f4;
}
.ja-layer-row-main {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ja-layer-text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}
.ja-layer-name {
  color: var(--ja-ink);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}
.ja-layer-meta {
  margin-top: 1px;
  overflow: hidden;
  color: var(--ja-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ja-layer-row.is-unavailable .ja-layer-meta {
  color: #b45309;
}
.ja-layer-switch {
  position: relative;
  width: 40px;
  height: 24px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #d6dce3;
  cursor: pointer;
  transition: background-color 180ms ease;
}
.ja-layer-switch.is-on {
  background: var(--ja-green);
}
.ja-layer-switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.ja-layer-switch.is-loading {
  cursor: wait;
  opacity: 1;
}
.ja-layer-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(20, 35, 63, 0.25);
  transition: transform 200ms cubic-bezier(0.3, 1.3, 0.5, 1);
}
.ja-layer-switch.is-on .ja-layer-knob {
  transform: translateX(16px);
}
.ja-layer-progress {
  position: relative;
  height: 3px;
  margin: 10px 0 0;
  overflow: hidden;
  border-radius: 999px;
  background: #dcebe2;
}
.ja-layer-progress::after {
  position: absolute;
  inset: 0 auto 0 0;
  width: 35%;
  border-radius: inherit;
  background: var(--ja-green);
  content: '';
  animation: ja-layer-progress 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.ja-layer-switch:focus-visible,
.ja-layer-reset:focus-visible,
.ja-layer-filter:focus-visible,
.ja-layer-section-toggle:focus-visible {
  outline: 2px solid var(--ja-green);
  outline-offset: 2px;
}
.ja-layer-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 2px;
}
.ja-layer-filter {
  height: 30px;
  padding: 0 12px;
  border: 1px solid #d9dfe6;
  border-radius: 999px;
  background: #fff;
  color: #4b5567;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.ja-layer-filter:hover {
  border-color: var(--ja-green);
  color: var(--ja-green);
}
.ja-layer-filter.is-on {
  border-color: var(--ja-green);
  background: var(--ja-green);
  color: #fff;
}
.ja-layer-legend {
  padding: 14px 20px 16px;
  border-top: 1px solid var(--ja-rule);
  background: #fafbfa;
}
.ja-layer-legend h3 {
  margin: 0 0 10px;
  color: var(--ja-muted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ja-layer-legend ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.ja-layer-legend li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4b5567;
  font-size: 12px;
}
.ja-layer-legend-bar {
  width: 24px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 999px;
}
.is-sheet .ja-layer-head {
  padding: 16px 16px 12px;
}
.is-sheet .ja-layer-grabber {
  width: 36px;
  border-radius: 2px;
}
.is-sheet .ja-layer-reset,
.is-sheet .ja-layer-close {
  height: 40px;
  border-radius: 8px;
}
.is-sheet .ja-layer-close {
  width: 40px;
}
.is-sheet .ja-layer-section-toggle {
  min-height: 44px;
  padding: 12px 16px 8px;
}
.is-sheet .ja-layer-row {
  margin: 0 8px;
  padding: 12px 8px;
  border-radius: 8px;
}
.is-sheet .ja-layer-filter {
  height: 36px;
  border-radius: 6px;
}
.is-sheet .ja-layer-legend {
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
}
.is-sheet .ja-layer-legend ul {
  grid-template-columns: 1fr 1fr;
}
@keyframes ja-layer-progress {
  from {
    transform: translateX(-110%);
  }
  to {
    transform: translateX(300%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ja-layer-panel {
    transition-duration: 1ms;
  }
  .ja-layer-progress::after {
    animation-duration: 2.4s;
  }
  .ja-layer-knob,
  .ja-layer-chevron {
    transition: none;
  }
}

.layer-expand-enter-active,
.layer-expand-leave-active {
  max-height: 1000px;
  overflow: hidden;
  transition: max-height 240ms ease, opacity 180ms ease, transform 180ms ease;
}

.layer-expand-enter,
.layer-expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}
</style>
