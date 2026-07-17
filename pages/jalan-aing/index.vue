<template>
  <div class="jalan-aing-page min-h-screen overflow-x-hidden bg-slate-50 font-lato text-slate-800">
    <div v-if="notification" class="fixed left-1/2 top-20 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-blue-400/30 bg-jalan-aing-primary px-4 py-2.5 text-xs font-bold text-white shadow-lg">
      <Icon name="check-mark" size="14px" />
      {{ notification }}
    </div>

    <header class="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div class="flex items-center gap-4 sm:gap-8">
        <a href="#beranda" class="group flex items-center gap-3 transition-all active:scale-95">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-jalan-aing-primary text-xs font-bold text-white shadow-lg shadow-blue-500/10"><span class="md:hidden"><Icon name="home-outline" size="22px" /></span><span class="hidden md:inline">JA</span></span>
          <span class="text-left">
            <span class="block text-base font-bold leading-none tracking-tight transition-colors group-hover:text-jalan-aing-primary">Jalan Aing</span>
            <span class="mt-1 block text-xs font-bold uppercase leading-none tracking-wider text-slate-400">Web GIS Jabar</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1.5 md:flex">
          <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`" class="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all" :class="activeTab === item.id ? 'bg-jalan-aing-primary text-white shadow-md shadow-blue-500/10' : 'text-slate-500 hover:bg-slate-50 hover:text-jalan-aing-primary'">
            {{ item.label }}
          </a>
        </nav>
      </div>

      <div class="flex items-center gap-3 sm:gap-4">
        <div class="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 lg:flex"><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Layanan GIS Aktif</div>
        <button type="button" class="rounded-full p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-jalan-aing-primary" title="Pusat Bantuan" @click="showNotification('Layanan Informasi Jalan Provinsi Jawa Barat')">
          <span class="md:hidden"><Icon name="question-mark-circle-outline" size="22px" /></span><span class="hidden md:inline"><Icon name="info-circle-outline" size="18px" /></span>
        </button>
      </div>
    </header>

    <main class="min-h-[calc(100vh-64px)] flex-grow pb-20 pt-16 md:pb-0">
      <JalanAingHomePage v-if="activeTab === 'beranda'" :statistics="statistics" @open-map="selectTab('peta')" @open-complaint="selectTab('aduan')" />
      <JalanAingInteractiveMapPage v-else-if="activeTab === 'peta'" :layer-visibility="layerVisibility" :filter-status="filterStatus" :mobile-layer-open="mobileLayerOpen" @toggle-layer="handleLayerToggle" @update-filter="handleFilterUpdate" @notify="showNotification" @close-layer="mobileLayerOpen = false" @create-complaint="selectTab('aduan')" />
      <JalanAingComplaintPage v-else-if="activeTab === 'aduan'" :complaint-steps="complaintSteps" @track="trackSubmittedTicket" />
      <JalanAingTrackingPage v-else-if="activeTab === 'lacak'" v-model="trackingNumber" @submit="openTracking" />
    </main>

    <nav class="fixed bottom-0 left-0 z-40 flex h-20 w-full items-center justify-around border-t border-slate-200 bg-white px-2 pb-safe shadow-lg md:hidden">
      <template v-for="item in mobileNavItems">
        <button v-if="item.id === 'layer'" :key="item.id" type="button" class="relative -mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-white bg-jalan-aing-primary text-white transition-transform active:scale-95" :aria-expanded="mobileLayerOpen" aria-label="Buka layer peta" @click="openMobileLayer">
          <Icon :name="item.icon" size="24px" />
          <span class="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider">{{ item.label }}</span>
        </button>
        <a v-else :key="item.id" :href="`#${item.id}`" :aria-current="activeTab === item.id ? 'page' : undefined" class="flex h-full flex-1 flex-col items-center justify-center py-2 transition-all" :class="activeTab === item.id ? 'font-bold text-jalan-aing-primary' : 'text-slate-400'" @click="mobileLayerOpen = false">
          <Icon v-if="item.iconSrc" :src="item.iconSrc" size="18px" />
          <Icon v-else :name="item.icon" size="18px" />
          <span class="mt-1 text-xs font-bold tracking-wide">{{ item.label }}</span>
        </a>
      </template>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'JalanAingPage',
  data() {
    return {
      activeTab: 'beranda',
      mobileLayerOpen: false,
      notification: '',
      notificationTimer: null,
      trackingNumber: '',
      layerVisibility: { apj: true, cctv: true, metro: true, faskes: true, bencana: true, karesidenan: true, ruasJalan: true, aduanPublik: true },
      filterStatus: { apjStatus: 'semua', cctvStatus: 'semua', roadCondition: 'semua' },
      navItems: [
        { id: 'beranda', label: 'Beranda' },
        { id: 'peta', label: 'Peta Interaktif' },
        { id: 'aduan', label: 'Buat Aduan' },
        { id: 'lacak', label: 'Lacak Status' },
      ],
      mobileNavItems: [
        { id: 'beranda', label: 'Beranda', icon: 'home-outline' },
        { id: 'peta', label: 'Peta', iconSrc: '/icon/pin-map.svg' },
        { id: 'layer', label: 'Layer', icon: 'filter' },
        { id: 'aduan', label: 'Lapor', icon: 'pencil-outline' },
        { id: 'lacak', label: 'Lacak', icon: 'magnifier' },
      ],
      statistics: [
        { value: '1,248', unit: 'KM', label: 'Ruas Jalan Provinsi', note: 'Terpantau secara periodik', icon: 'arrow-top-right', iconClass: 'bg-blue-50 text-jalan-aing-primary' },
        { value: '450', unit: 'Titik', label: 'CCTV Arus Lalu Lintas', note: 'Pemantauan aktif 24/7', icon: 'eye', iconClass: 'bg-blue-50 text-jalan-aing-primary' },
        { value: '12,300', unit: 'Unit', label: 'Aset Penerangan Jalan', note: 'Status lampu APJ aktif', icon: 'night-outline', iconClass: 'bg-amber-50 text-amber-600' },
        { value: '98%', unit: '', label: 'Aduan Terselesaikan', note: 'Solusi cepat dinas lapangan', icon: 'check-mark-circle', iconClass: 'bg-emerald-50 text-emerald-600', highlight: true },
      ],
      complaintSteps: ['Pilih Kategori', 'Detail & Foto', 'Data Pelapor'],
    }
  },
  mounted() {
    this.syncTabWithHash()
    window.addEventListener('hashchange', this.syncTabWithHash)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.syncTabWithHash)
    clearTimeout(this.notificationTimer)
  },
  methods: {
    selectTab(tab) {
      this.mobileLayerOpen = false
      window.location.hash = tab
    },
    openMobileLayer() {
      this.selectTab('peta')
      this.mobileLayerOpen = true
    },
    syncTabWithHash() {
      const tab = window.location.hash.slice(1)
      this.activeTab = this.navItems.some(item => item.id === tab) ? tab : 'beranda'
      if (this.activeTab !== 'peta') this.mobileLayerOpen = false
    },
    trackSubmittedTicket(ticket) {
      this.trackingNumber = ticket
      this.selectTab('lacak')
    },
    handleLayerToggle(payload) {
      const id = typeof payload === 'string' ? payload : payload?.id
      if (!id || !(id in this.layerVisibility)) return
      this.layerVisibility[id] = payload?.value === undefined ? !this.layerVisibility[id] : payload.value
    },
    handleFilterUpdate({ key, value }) {
      if (key in this.filterStatus) this.filterStatus[key] = value
    },
    openTracking() {
      if (!this.trackingNumber.trim()) {
        this.showNotification('Masukkan nomor tiket terlebih dahulu')
        return
      }
      this.$router.push({ path: '/new-aduan-warga/detail', query: { ticket: this.trackingNumber.trim() } })
    },
    showNotification(message) {
      this.notification = message
      clearTimeout(this.notificationTimer)
      this.notificationTimer = setTimeout(() => {
        this.notification = ''
      }, 3000)
    },
  },
}
</script>
