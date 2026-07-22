<template>
  <aside :class="mobileOpen ? 'fixed inset-x-0 bottom-0 z-[800] flex h-[78vh] w-full max-w-none translate-y-0 flex-col rounded-t-[32px] border-t shadow-2xl md:static md:h-full md:w-[340px] md:translate-y-0 md:rounded-none md:border-t-0 md:border-r md:shadow-none' : 'fixed inset-x-0 bottom-0 z-[800] flex h-[78vh] w-full max-w-none translate-y-full pointer-events-none flex-col rounded-t-[32px] border-t shadow-2xl md:static md:h-full md:w-[340px] md:translate-y-0 md:pointer-events-auto md:rounded-none md:border-t-0 md:border-r md:shadow-none'" :style="sheetDragging ? { transform: `translateY(${sheetDragY}px)`, transition: 'none' } : null" class="min-h-0 flex-shrink-0 flex-col overflow-hidden border border-slate-200 bg-white font-lato text-slate-800 transition-transform duration-300 ease-out">
    <div v-if="mobileOpen" class="mx-auto mt-4 h-1.5 w-12 rounded-full bg-slate-300" />
    <div class="border-b border-slate-200 p-4" :class="mobileOpen ? 'touch-none select-none px-5 py-4' : ''" @pointerdown="startSheetGesture" @pointermove="moveSheetGesture" @pointerup="endSheetGesture" @pointercancel="cancelSheetGesture">
      <h2 class="flex items-center gap-2 text-lg font-bold text-jalan-aing-primary" :class="mobileOpen ? 'text-xl' : ''">
        <svg v-if="mobileOpen" class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
          <path d="m3 8 9-5 9 5-9 5-9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
        <Icon v-else name="info-circle-outline" size="18px" />
        {{ mobileOpen ? 'Layer & Filter OPD Sektoral' : 'Layer OPD Sektoral' }}
        <button v-if="mobileOpen" type="button" class="ml-auto rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup layer" @pointerdown.stop @click="$emit('close')">
          <Icon name="times" size="18px" />
        </button>
      </h2>
      <p v-if="!mobileOpen" class="mt-1 text-xs leading-normal text-slate-500">Aktifkan layer untuk menganalisis data geospasial</p>
    </div>

    <div class="flex min-h-0 flex-1 flex-col divide-y divide-slate-100 overflow-y-auto">
      <section v-for="section in sections" :key="section.id" class="p-2" :class="mobileOpen ? 'border-b border-slate-100 p-4 last:border-b-0' : ''">
        <button type="button" class="flex w-full items-center justify-between rounded-lg p-3 text-left font-semibold text-slate-700 transition hover:bg-slate-50" :class="mobileOpen ? 'p-1 text-lg' : 'text-sm'" :aria-expanded="openSections[section.id]" @click="toggleSection(section.id)">
          <span class="flex min-w-0 items-center gap-2" :class="mobileOpen ? 'gap-3' : ''">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="[section.color, mobileOpen ? 'h-3 w-3' : '']" />
            <span>{{ section.label }}</span>
          </span>
          <span class="transition-transform duration-200" :class="openSections[section.id] ? 'rotate-180' : ''"><Icon name="chevron-down" :size="mobileOpen ? '20px' : '16px'" /></span>
        </button>

        <transition name="layer-expand">
          <div v-if="openSections[section.id]" class="mt-1 ml-4 space-y-3 border-l border-slate-200 pb-3 pl-4 pr-2" :class="mobileOpen ? 'mt-4 ml-2 space-y-5 pb-2 pl-4' : ''">
          <div v-for="item in section.items" :key="item.id" class="space-y-2">
            <div class="flex items-center justify-between gap-3">
              <span class="font-medium text-slate-600" :class="mobileOpen ? 'text-base' : 'text-xs'">{{ item.label }}</span>
              <button type="button" class="rounded-md p-1.5 transition" :disabled="!dataAvailability[item.id]" :class="!dataAvailability[item.id] ? 'cursor-not-allowed text-slate-300' : layerVisibility[item.id] ? 'bg-jalan-aing-primary-soft text-jalan-aing-primary' : 'text-slate-500 hover:text-slate-600'" :aria-label="dataAvailability[item.id] ? `${layerVisibility[item.id] ? 'Sembunyikan' : 'Tampilkan'} ${item.label}` : `${item.label} belum tersedia`" @click="toggleLayer(item.id)">
                <Icon :name="layerVisibility[item.id] ? 'eye' : 'eye-off'" :size="mobileOpen ? '22px' : '16px'" />
              </button>
            </div>
            <p v-if="!dataAvailability[item.id]" class="text-[11px] text-slate-400">Data belum tersedia dari OPD</p>

            <div v-if="item.id === 'apj' && layerVisibility[item.id]" class="grid grid-cols-3 gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
              <button v-for="status in apjStatuses" :key="status" type="button" class="rounded py-1 font-medium capitalize transition" :class="[filterStatus.apjStatus === status ? 'bg-amber-500 font-bold text-white' : 'text-slate-500 hover:bg-white', mobileOpen ? 'py-2 text-sm' : 'text-xs']" @click="updateFilter('apjStatus', status)">{{ status }}</button>
            </div>

            <div v-if="item.id === 'cctv' && layerVisibility[item.id]" class="grid grid-cols-3 gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
              <button v-for="status in cctvStatuses" :key="status" type="button" class="rounded py-1 font-medium capitalize transition" :class="[filterStatus.cctvStatus === status ? 'bg-jalan-aing-primary font-bold text-white' : 'text-slate-500 hover:bg-white', mobileOpen ? 'py-2 text-sm' : 'text-xs']" @click="updateFilter('cctvStatus', status)">{{ status }}</button>
            </div>

          </div>
          </div>
        </transition>
      </section>
    </div>

    <div class="border-t border-slate-200 bg-slate-50 p-4" :class="mobileOpen ? 'p-5' : ''">
      <h3 class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500" :class="mobileOpen ? 'text-sm' : ''">Legenda Kondisi Jalan</h3>
      <div class="space-y-2" :class="mobileOpen ? 'grid grid-cols-2 gap-x-6 gap-y-3 space-y-0' : ''">
        <div v-for="legend in legendItems" :key="legend.label" class="flex items-center gap-3 text-xs text-slate-600">
          <span class="h-2 w-6 rounded-full" :class="legend.color" />
          <span>{{ legend.label }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'JalanAingLayerPanel',
  props: {
    mobileOpen: { type: Boolean, default: false },
    layerVisibility: { type: Object, required: true },
    filterStatus: { type: Object, required: true },
    dataAvailability: { type: Object, required: true },
  },
  data() {
    return {
      sheetDragY: 0,
      sheetPointerId: null,
      sheetDragStartY: 0,
      sheetDragging: false,
      openSections: { dishub: true, dinkes: false, bpbd: false, satpol: false, dbmpr: true },
      apjStatuses: ['semua', 'aktif', 'mati'],
      cctvStatuses: ['semua', 'online', 'offline'],
      sections: [
        { id: 'dishub', label: 'Dinas Perhubungan (Dishub)', color: 'bg-amber-500', items: [{ id: 'apj', label: 'Penerangan Jalan (APJ)' }, { id: 'cctv', label: 'CCTV Lalu Lintas' }, { id: 'metro', label: 'Metro Jabar Trans' }] },
        { id: 'dinkes', label: 'Dinas Kesehatan (Dinkes)', color: 'bg-emerald-500', items: [{ id: 'faskes', label: 'Fasilitas Kesehatan' }] },
        { id: 'bpbd', label: 'Penanggulangan Bencana (BPBD)', color: 'bg-red-500', items: [{ id: 'bencana', label: 'Titik Rawan Bencana' }] },
        { id: 'satpol', label: 'Satuan Polisi Pamong Praja', color: 'bg-indigo-500', items: [{ id: 'karesidenan', label: 'Pos Karesidenan' }] },
      ],
      legendItems: [
        { label: 'Baik / Mantap', color: 'bg-jalan-aing-primary' },
        { label: 'Rusak Ringan', color: 'bg-yellow-500' },
        { label: 'Rusak Sedang', color: 'bg-orange-500' },
        { label: 'Rusak Berat', color: 'bg-red-500' },
      ],
    }
  },
  watch: {
    mobileOpen(value) {
      if (value) {
        this.openSections.dishub = true
        this.openSections.dbmpr = true
      }
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
  max-height: 480px;
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
