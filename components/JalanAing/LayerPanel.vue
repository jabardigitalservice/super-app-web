<template>
  <aside :class="mobileOpen ? 'fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[800] flex h-[68svh] w-full max-w-none translate-y-0 flex-col rounded-t-[32px] border-t shadow-2xl md:static md:bottom-auto md:h-full md:w-[340px] md:translate-y-0 md:rounded-none md:border-t-0 md:border-r md:shadow-none' : 'fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[800] flex h-[68svh] w-full max-w-none translate-y-full pointer-events-none flex-col rounded-t-[32px] border-t shadow-2xl md:static md:bottom-auto md:h-full md:w-[340px] md:translate-y-0 md:pointer-events-auto md:rounded-none md:border-t-0 md:border-r md:shadow-none'" :style="sheetDragging ? { transform: `translateY(${sheetDragY}px)`, transition: 'none' } : null" class="min-h-0 flex-shrink-0 flex-col overflow-hidden border border-slate-200 bg-white font-lato text-slate-800 transition-transform duration-300 ease-out">
    <div class="border-b border-slate-200 p-4" :class="mobileOpen ? 'touch-none select-none px-5 py-2' : ''" @pointerdown="startSheetGesture" @pointermove="moveSheetGesture" @pointerup="endSheetGesture" @pointercancel="cancelSheetGesture">
      <h2 class="m-0 flex items-center gap-2 text-base font-semibold leading-5 text-jalan-aing-primary">
        <svg v-if="mobileOpen" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
          <path d="m3 8 9-5 9 5-9 5-9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
        <Icon v-else name="info-circle-outline" size="18px" />
        {{ mobileOpen ? 'Layer Jalan Aing' : 'Layer Jalan Aing' }}
        <button v-if="mobileOpen" type="button" class="ml-auto rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup layer" @pointerdown.stop @click="$emit('close')">
          <Icon name="times" size="18px" />
        </button>
      </h2>
      <p v-if="!mobileOpen" class="mt-1 text-xs leading-normal text-slate-500">Aktifkan layer untuk menganalisis data geospasial</p>
    </div>

    <div class="flex min-h-0 flex-1 flex-col divide-y divide-slate-100 overflow-y-auto">
      <section v-for="section in sections" :key="section.id" class="p-2" :class="mobileOpen ? 'border-b border-slate-100 px-5 py-3 last:border-b-0' : ''">
        <button type="button" class="flex w-full items-center justify-between rounded-lg p-3 text-left font-semibold text-slate-700 transition hover:bg-slate-50" :class="mobileOpen ? 'p-1 text-sm' : 'text-sm'" :aria-expanded="openSections[section.id]" @click="toggleSection(section.id)">
          <span class="flex min-w-0 items-center gap-2" :class="mobileOpen ? 'gap-3' : ''">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="[section.color, mobileOpen ? 'h-3 w-3' : '']" />
            <span>{{ section.label }}</span>
          </span>
          <span class="transition-transform duration-200" :class="openSections[section.id] ? 'rotate-180' : ''"><Icon name="chevron-down" :size="mobileOpen ? '18px' : '16px'" /></span>
        </button>

        <transition name="layer-expand">
          <div v-if="openSections[section.id]" class="mt-1 ml-4 space-y-3 border-l border-slate-200 pb-3 pl-4 pr-2" :class="mobileOpen ? 'mt-3 ml-2 space-y-4 pb-1 pl-4' : ''">
          <div v-for="item in section.items" :key="item.id" class="space-y-2 rounded-lg border p-2 transition" :class="layerVisibility[item.id] ? 'border-jalan-aing-primary' : 'border-transparent'">
            <div class="flex items-center justify-between gap-3">
              <span class="flex min-w-0 flex-col font-medium text-slate-600" :class="mobileOpen ? 'text-[13px]' : 'text-xs'"><span>{{ item.label }}</span><span v-if="layerLoading[item.id]" class="mt-0.5 text-[10px] font-medium text-jalan-aing-primary">Memuat…</span></span>
              <button type="button" class="rounded-md p-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jalan-aing-primary" :disabled="!dataAvailability[item.id] || layerLoading[item.id]" :class="!dataAvailability[item.id] ? 'cursor-not-allowed text-slate-300' : layerLoading[item.id] ? 'cursor-wait bg-jalan-aing-primary-soft text-jalan-aing-primary' : layerVisibility[item.id] ? 'bg-jalan-aing-primary-soft text-jalan-aing-primary hover:bg-jalan-aing-primary-border' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-600'" :aria-busy="layerLoading[item.id]" :aria-pressed="layerVisibility[item.id]" :aria-label="layerLoading[item.id] ? `Memuat ${item.label}` : dataAvailability[item.id] ? `${layerVisibility[item.id] ? 'Sembunyikan' : 'Tampilkan'} ${item.label}` : `${item.label} belum tersedia`" @click="toggleLayer(item.id)">
                <span v-if="layerLoading[item.id]" class="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /><Icon v-else :name="layerVisibility[item.id] ? 'eye' : 'eye-off'" :size="mobileOpen ? '22px' : '16px'" />
              </button>
            </div>
            <p v-if="!dataAvailability[item.id]" class="text-[11px] text-slate-400">Data belum tersedia dari OPD</p>

            <div v-if="item.id === 'ruasJalan' && layerVisibility[item.id]" class="grid grid-cols-2 gap-2">
              <button v-for="status in roadStatuses" :key="status.value" type="button" class="flex min-h-10 items-center justify-center rounded-md border px-3 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jalan-aing-primary" :class="[filterStatus.roadClass === status.value ? 'border-jalan-aing-primary bg-jalan-aing-primary-soft text-jalan-aing-primary' : 'border-slate-200 bg-white text-slate-500 hover:border-jalan-aing-primary hover:text-jalan-aing-primary', mobileOpen ? 'text-sm' : 'text-[11px]']" :aria-pressed="filterStatus.roadClass === status.value" @click="updateFilter('roadClass', status.value)">{{ status.label }}</button>
            </div>

          </div>
          </div>
        </transition>
      </section>
    </div>

    <div v-if="activeLegendItems.length" class="border-t border-slate-200 bg-slate-50 p-4" :class="mobileOpen ? 'px-5 py-4' : ''">
      <h3 class="mb-2 text-xs font-semibold text-slate-500" :class="mobileOpen ? 'mb-3 text-sm text-slate-700' : ''">Legenda layer aktif</h3>
      <div class="space-y-2" :class="mobileOpen ? 'grid grid-cols-2 gap-x-6 gap-y-3 space-y-0' : ''">
        <div v-for="legend in activeLegendItems" :key="legend.id" class="flex items-center gap-3 text-xs text-slate-600">
          <span class="h-2 w-6 rounded-full" :style="legendStyle(legend)" />
          <span>{{ legend.label }}</span>
        </div>
      </div>
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
      openSections: { bus: true, dbmpr: false, dinkes: false, dishub: false, bpbd: false },
      roadStatuses: [
        { value: 'semua', label: 'Semua' },
        { value: 'arteri_primer', label: 'Arteri Primer' },
        { value: 'kolektor_primer', label: 'Kolektor Primer' },
        { value: 'jalan_tol', label: 'Jalan Tol' },
      ],
      sections: [
        { id: 'bus', label: 'Bus', color: 'bg-sky-500', items: [{ id: 'bus', label: 'Posisi Bus Real-time', color: '#0EA5E9' }, { id: 'busStops', label: 'Halte Bus', color: '#2563EB' }] },
        { id: 'dbmpr', label: 'Dinas Bina Marga (DBMPR)', color: 'bg-emerald-600', items: [{ id: 'ruasJalan', label: 'Jalan Provinsi', color: '#008444' }, { id: 'apj', label: 'APJ', color: '#F59E0B' }] },
        { id: 'dinkes', label: 'Dinas Kesehatan (Dinkes)', color: 'bg-red-500', items: [{ id: 'rumahSakit', label: 'Rumah Sakit', color: '#DC2626' }, { id: 'puskesmas', label: 'Puskesmas', color: '#2563EB' }] },
        { id: 'dishub', label: 'Dinas Perhubungan (Dishub)', color: 'bg-amber-500', items: [{ id: 'restArea', label: 'Rest Area', color: '#D97706' }] },
        { id: 'bpbd', label: 'Kebencanaan (BPBD)', color: 'bg-rose-600', items: [{ id: 'bahayaBanjir', label: 'Bahaya Banjir', color: '#0284C7' }, { id: 'bahayaBanjirBandang', label: 'Bahaya Banjir Bandang', color: '#0369A1' }, { id: 'bahayaCuacaEkstrem', label: 'Bahaya Cuaca Ekstrem', color: '#7C3AED' }, { id: 'bahayaGempaBumi', label: 'Bahaya Gempa Bumi', color: '#DC2626' }, { id: 'bahayaKebakaranHutanDanLahan', label: 'Bahaya Kebakaran Hutan dan Lahan', color: '#EA580C' }, { id: 'bahayaKekeringan', label: 'Bahaya Kekeringan', color: '#CA8A04' }, { id: 'bahayaTanahLongsor', label: 'Bahaya Tanah Longsor', color: '#92400E' }, { id: 'bahayaTsunami', label: 'Bahaya Tsunami', color: '#0891B2' }, { id: 'indeksMultibahayaBencana', label: 'Indeks Multibahaya Bencana', color: '#BE123C' }] },
      ],
    }
  },
  computed: {
    activeLegendItems() {
      const activeItems = this.sections.flatMap((section) => section.items).filter((item) => this.layerVisibility[item.id])
      const hazardActive = activeItems.some((item) => item.id.startsWith('bahaya') || item.id === 'indeksMultibahayaBencana')
      return [...activeItems.filter((item) => !item.id.startsWith('bahaya') && item.id !== 'indeksMultibahayaBencana'), ...(hazardActive ? HAZARD_LEGEND_ITEMS : [])]
    },
  },
  watch: {
    mobileOpen(value) {
      if (value) this.openSections.bus = true
    },
  },
  methods: {
    startSheetGesture(event) {
      if (!this.mobileOpen || (event.pointerType === 'mouse' && event.button !== 0)) return

      this.sheetPointerId = event.pointerId
      this.sheetDragStartY = event.clientY
      this.sheetDragY = 0
      this.sheetDragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    moveSheetGesture(event) {
      if (!this.sheetDragging || event.pointerId !== this.sheetPointerId) return

      this.sheetDragY = Math.max(0, Math.min(event.clientY - this.sheetDragStartY, 180))
      event.preventDefault()
    },
    endSheetGesture(event) {
      if (!this.sheetDragging || event.pointerId !== this.sheetPointerId) return

      const shouldClose = this.sheetDragY >= 72
      this.cancelSheetGesture(event)
      if (shouldClose) this.$emit('close')
    },
    cancelSheetGesture(event) {
      if (this.sheetPointerId !== null && event.pointerId !== this.sheetPointerId) return

      this.sheetDragY = 0
      this.sheetPointerId = null
      this.sheetDragging = false
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
      const stripes = colors.map((color, index) => `${color} ${index * width}%, ${color} ${(index + 1) * width}%`)
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
