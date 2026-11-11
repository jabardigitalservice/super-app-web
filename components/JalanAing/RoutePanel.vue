<template>
  <section class="ja-route" aria-label="Cari rute">
    <div class="ja-route-top">
      <div class="ja-route-head">
        <button
          type="button"
          class="ja-route-icon-button"
          aria-label="Tutup rute"
          @click="$emit('close')"
        >
          <Icon name="chevron-left" size="18px" aria-hidden="true" />
        </button>
        <div><h2>Rencanakan perjalanan</h2><p class="ja-route-intro">Tentukan titik awal dan tujuan Anda.</p></div>
      </div>

      <div class="ja-route-fields">
        <div
          v-for="field in fields"
          :key="field.id"
          class="ja-route-field"
          :class="{
            'is-active': activeField === field.id,
            'is-picking': pickField === field.id,
          }"
        >
          <span class="ja-route-marker" :class="`is-${field.id}`">{{
            field.id === 'from' ? 'A' : 'B'
          }}</span>
          <input
            :ref="`input-${field.id}`"
            :value="texts[field.id]"
            type="search"
            autocomplete="off"
            :placeholder="
              pickField === field.id
                ? 'Ketuk titik di peta…'
                : field.placeholder
            "
            :aria-label="field.label"
            :aria-expanded="String(activeField === field.id)"
            :aria-controls="`ja-route-options-${field.id}`"
            @focus="openField(field.id)"
            @input="onInput(field.id, $event.target.value)"
            @keydown.esc="closeField"
            @keydown.down.prevent="moveOption(1)"
            @keydown.up.prevent="moveOption(-1)"
            @keydown.enter.prevent="chooseActiveOption"
          />
          <button
            v-if="texts[field.id]"
            type="button"
            class="ja-route-clear"
            :aria-label="`Hapus ${field.label}`"
            @mousedown.prevent
            @click="clearField(field.id)"
          >
            <Icon name="times" size="13px" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          class="ja-route-swap"
          aria-label="Tukar titik awal dan tujuan"
          @click="$emit('swap')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M7 4v16M7 4 3 8M7 4l4 4M17 20V4M17 20l-4-4M17 20l4-4" />
          </svg>
        </button>

        <transition name="ja-route-pop">
          <div
            v-if="activeField"
            :id="`ja-route-options-${activeField}`"
            class="ja-route-options"
            role="listbox"
          >
            <button
              v-for="(option, index) in options"
              :key="option.key"
              type="button"
              role="option"
              class="ja-route-option"
              :class="{
                'is-active': activeOption === index,
                'is-action': option.action,
              }"
              :aria-selected="String(activeOption === index)"
              @mousedown.prevent
              @mouseenter="activeOption = index"
              @click="choose(option)"
            >
              <strong>{{ option.name }}</strong>
              <span v-if="option.detail">{{ option.detail }}</span>
            </button>
            <p v-if="searching" class="ja-route-note">Mencari…</p>
            <p
              v-else-if="texts[activeField].length >= 3 && texts[activeField] !== (activeField === 'from' ? from && from.label : to && to.label) && !results.length"
              class="ja-route-note"
            >
              Tidak ada hasil.
            </p>
            <p
              v-else-if="texts[activeField].length && texts[activeField].length < 3"
              class="ja-route-note"
            >
              Ketik minimal 3 huruf.
            </p>
          </div>
        </transition>
      </div>
    </div>

    <div
      class="ja-route-body"
      :class="{ 'is-expanded': sheetExpanded, 'is-searching': activeField, 'is-picking': pickField }"
      aria-live="polite"
    >
      <button
        type="button"
        class="ja-route-handle"
        :aria-label="sheetExpanded ? 'Perkecil panel rute' : 'Perbesar panel rute'"
        @click="sheetExpanded = !sheetExpanded"
      />

      <p v-if="pickField" class="ja-route-status">
        Ketuk peta untuk memilih
        {{ pickField === 'from' ? 'titik awal' : 'tujuan' }}.
        <button type="button" @click="$emit('pick-on-map', null)">
          Batal
        </button>
      </p>
      <p v-else-if="locationLoading" class="ja-route-status" role="status">
        <span class="ja-route-progress" aria-hidden="true" />
        Mencari lokasi Anda…
      </p>
      <p v-else-if="nearestLoading" class="ja-route-status">
        <span class="ja-route-progress" aria-hidden="true" />
        {{ nearestLoading }}
      </p>
      <p v-else-if="nearestError" class="ja-route-status is-error">
        {{ nearestError }}
      </p>

      <template v-if="!from || !to">
        <div v-if="!pickField" class="ja-route-start-actions">
          <button type="button" :disabled="locationLoading" @click="closeField(); $emit('use-my-location', !from ? 'from' : 'to')">Gunakan lokasi saya</button>
          <button type="button" @click="$emit('pick-on-map', !from ? 'from' : 'to'); closeField()">Pilih titik di peta</button>
        </div>
        <p v-if="!pickField" class="ja-route-status">
          {{
            !from
              ? 'Pilih titik awal: lokasi Anda, hasil pencarian, atau titik di peta.'
              : 'Mau ke mana? Pilih tujuan atau tujuan terdekat di bawah.'
          }}
        </p>
        <div v-if="from && !to" class="ja-route-quick">
          <p class="ja-route-label">Terdekat dari titik awal</p>
          <button
            v-for="item in quickTargets"
            :key="item.id"
            type="button"
            @click="$emit('nearest', item.id)"
          >
            <strong>{{ item.label }}</strong>
            <span>{{ item.detail }}</span>
          </button>
        </div>
      </template>

      <!-- Comparison list -->
      <div v-else-if="!selected" class="ja-route-list">
        <p class="ja-route-label">Pilihan perjalanan</p><p class="ja-route-list-hint">Pilih perjalanan untuk melihat detail rute.</p>

        <template v-if="journey.transit.status === 'loading'">
          <div class="ja-route-row is-pending">
            <span class="ja-route-row-kind">Bus MJT</span>
            <span class="ja-route-row-sub">Mencari koridor dan halte…</span>
          </div>
        </template>
        <template v-else-if="journey.transit.options.length">
          <button
            v-for="(option, index) in journey.transit.options"
            :key="option.id"
            type="button"
            class="ja-route-row"
            :class="{ 'is-preview': previewKey === `transit-${index}` }"
            @click="$emit('select-option', { type: 'transit', index })"
          >
            <span class="ja-route-row-kind">
              <span
                v-for="leg in rides(option)"
                :key="leg.corridorKey + leg.board.name"
                class="ja-route-kor"
                :style="{ backgroundColor: leg.color }"
                >{{ leg.kor }}</span
              >
            </span>
            <span class="ja-route-row-main">
              <strong>{{ formatDuration(option.duration) }}</strong>
              <span>· jalan {{ formatDistance(option.walkDistance) }}</span>
              <span v-if="option.transfers">· 1 kali transit</span>
            </span>
            <span
              class="ja-route-row-sub"
              :class="{ 'is-warning': option.closed }"
            >
              {{ transitNote(option) }}
            </span>
          </button>
        </template>
        <div v-else class="ja-route-row is-empty">
          <span class="ja-route-row-kind">Bus MJT</span>
          <span class="ja-route-row-sub">{{ transitEmptyNote }}</span>
        </div>

        <component
          :is="journey.car.route ? 'button' : 'div'"
          :type="journey.car.route ? 'button' : undefined"
          class="ja-route-row"
          :class="{
            'is-pending': journey.car.status === 'loading',
            'is-empty': journey.car.status === 'error',
            'is-preview': previewKey === 'car',
          }"
          @click="journey.car.route && $emit('select-option', { type: 'car' })"
        >
          <span class="ja-route-row-kind">Kendaraan</span>
          <span v-if="journey.car.route" class="ja-route-row-main">
            <strong>{{ formatDuration(journey.car.route.duration) }}</strong>
            <span>· {{ formatDistance(journey.car.route.distance) }}</span>
          </span>
          <span class="ja-route-row-sub" :class="{ 'is-warning': carWarning }">
            {{ carNote }}
          </span>
        </component>

        <button
          v-if="journey.walk.route"
          type="button"
          class="ja-route-row"
          :class="{ 'is-preview': previewKey === 'walk' }"
          @click="$emit('select-option', { type: 'walk' })"
        >
          <span class="ja-route-row-kind">Jalan kaki</span>
          <span class="ja-route-row-main">
            <strong>{{ formatDuration(journey.walk.route.duration) }}</strong>
            <span>· {{ formatDistance(journey.walk.route.distance) }}</span>
          </span>
        </button>

        <p class="ja-route-credit">
          Bus MJT dari data koridor, halte, dan posisi bus real-time Jalan Aing.
          Jalur kendaraan dari OpenStreetMap, kondisi dari data OPD Jawa Barat.
        </p>
      </div>

      <!-- Detail: Bus MJT -->
      <div v-else-if="selected.type === 'transit' && selectedTransit" class="ja-route-detail">
        <button type="button" class="ja-route-back" @click="$emit('back-to-list')">
          <Icon name="chevron-left" size="16px" aria-hidden="true" /> Semua pilihan
        </button>
        <div class="ja-route-summary">
          <span class="ja-route-time">{{ formatDuration(selectedTransit.duration) }}</span>
          <span class="ja-route-distance">Bus MJT · jalan {{ formatDistance(selectedTransit.walkDistance) }}</span>
        </div>
        <p v-if="selectedTransit.closed" class="ja-route-alert">
          Di luar jam operasional ({{ selectedTransit.hours.join(', ') }}).
        </p>
        <ol class="ja-route-timeline">
          <li
            v-for="(leg, index) in selectedTransit.legs"
            :key="index"
            :class="`is-${leg.type}`"
            :style="leg.type === 'ride' ? { '--leg-color': leg.color } : null"
          >
            <button type="button" @click="$emit('focus-point', leg.type === 'ride' ? leg.board : leg.to)">
              <template v-if="leg.type === 'walk'">
                <strong>Jalan kaki {{ formatDistance(leg.distance) }}</strong>
                <span>{{ formatDuration(leg.duration) }} ke {{ leg.to.name || leg.to.label || 'tujuan' }}</span>
              </template>
              <template v-else>
                <span class="ja-route-ride-head">
                  <span class="ja-route-kor" :style="{ backgroundColor: leg.color }">{{ leg.kor }}</span>
                  <strong>arah {{ leg.toward }}</strong>
                </span>
                <span>Naik di <b>{{ leg.board.name }}</b></span>
                <span>
                  {{ leg.waitSource === 'live'
                    ? `Bus berikutnya ±${formatDuration(leg.wait)} (posisi real-time)`
                    : `Perkiraan tunggu ${formatDuration(leg.wait)}` }}
                </span>
                <span>{{ leg.stops }} halte · {{ formatDuration(leg.duration) }}</span>
                <span>Turun di <b>{{ leg.alight.name }}</b></span>
                <span v-if="leg.hours" class="ja-route-muted">Beroperasi {{ leg.hours }}</span>
              </template>
            </button>
          </li>
        </ol>
        <p class="ja-route-credit">
          Waktu tunggu dihitung dari posisi bus terakhir; perjalanan bus dan jalan kaki adalah perkiraan.
        </p>
      </div>

      <!-- Detail: Kendaraan / Jalan kaki -->
      <div v-else-if="selectedRoute" class="ja-route-detail">
        <button type="button" class="ja-route-back" @click="$emit('back-to-list')">
          <Icon name="chevron-left" size="16px" aria-hidden="true" /> Semua pilihan
        </button>
        <div class="ja-route-summary">
          <span class="ja-route-time">{{ formatDuration(selectedRoute.duration) }}</span>
          <span class="ja-route-distance">
            {{ selected.type === 'car' ? 'Kendaraan' : 'Jalan kaki' }} ·
            {{ formatDistance(selectedRoute.distance) }}
          </span>
        </div>

        <section v-if="selected.type === 'car'" class="ja-route-section">
          <h3>Kondisi di rute</h3>
          <p v-if="insightsPendingLabel" class="ja-route-muted">
            <span class="ja-route-progress" aria-hidden="true" />
            Memuat {{ insightsPendingLabel }}…
          </p>

          <div v-if="insights && insights.roads" class="ja-route-group">
            <h4>Jalan Provinsi ({{ insights.roads.length }} ruas)</h4>
            <p v-if="!insights.roads.length" class="ja-route-muted">
              Rute tidak melewati ruas Jalan Provinsi.
            </p>
            <div v-for="(road, index) in insights.roads" :key="`road-${index}`" class="ja-route-item">
              <button type="button" class="ja-route-item-main" @click="$emit('focus-point', road)">
                <strong>{{ road.name }}</strong>
                <span>{{ formatDistance(road.length) }} dilewati<template v-if="road.condition"> · kondisi {{ road.condition }}</template></span>
              </button>
              <button type="button" class="ja-route-item-action" @click="$emit('report', road)">
                Laporkan
              </button>
            </div>
          </div>

          <div v-if="insights && insights.hazards" class="ja-route-group">
            <h4>Rawan bencana (BPBD)</h4>
            <p v-if="!insights.hazards.length" class="ja-route-muted">
              Tidak ada zona rawan banjir atau longsor di rute ini.
            </p>
            <button
              v-for="zone in insights.hazards"
              :key="zone.id"
              type="button"
              class="ja-route-item-main"
              @click="$emit('focus-point', zone)"
            >
              <strong>{{ zone.label }}<span v-if="zone.level" class="ja-route-level" :class="`is-${zone.level.toLowerCase()}`">{{ levelLabel(zone.level) }}</span></strong>
              <span>sekitar {{ formatDistance(zone.length) }} di dalam zona</span>
            </button>
          </div>

          <div v-if="insights" class="ja-route-group">
            <h4>Fasilitas dekat rute</h4>
            <template v-for="facility in facilityGroups">
              <p
                v-if="insights.facilities[facility.id] && !insights.facilities[facility.id].length"
                :key="`${facility.id}-none`"
                class="ja-route-muted"
              >
                Tidak ada {{ facility.label.toLowerCase() }} dalam {{ facility.radius }}.
              </p>
              <button
                v-for="(item, index) in (insights.facilities[facility.id] || []).slice(0, 3)"
                :key="`${facility.id}-${index}`"
                type="button"
                class="ja-route-item-main"
                @click="$emit('focus-point', item)"
              >
                <strong>{{ item.name }}</strong>
                <span>{{ facility.label }} · {{ formatDistance(item.distance) }} dari rute</span>
              </button>
            </template>
          </div>

          <div v-if="insights && insights.apj !== null" class="ja-route-group">
            <h4>Penerangan jalan (APJ)</h4>
            <p class="ja-route-muted">
              {{ insights.apj
                ? `${insights.apj} titik APJ tercatat di sepanjang rute.`
                : 'Tidak ada titik APJ tercatat di sepanjang rute.' }}
            </p>
          </div>
        </section>

        <section class="ja-route-section">
          <button
            type="button"
            class="ja-route-steps-toggle"
            :aria-expanded="String(stepsOpen)"
            @click="stepsOpen = !stepsOpen"
          >
            Petunjuk arah ({{ selectedRoute.steps.length }} langkah)
            <Icon :name="stepsOpen ? 'chevron-up' : 'chevron-down'" size="14px" aria-hidden="true" />
          </button>
          <ol v-if="stepsOpen" class="ja-route-steps">
            <li v-for="(step, index) in selectedRoute.steps" :key="index">
              <button type="button" @click="$emit('focus-point', step)">
                <span class="ja-route-step-index">{{ index + 1 }}</span>
                <span class="ja-route-step-text">{{ step.text }}</span>
                <span v-if="step.distance" class="ja-route-step-distance">{{ formatDistance(step.distance) }}</span>
              </button>
            </li>
          </ol>
        </section>
        <p class="ja-route-credit">
          Jalur dari OpenStreetMap (OSRM FOSSGIS), waktu tempuh perkiraan tanpa lalu lintas.
          Kondisi dari data Jalan Aing (DBMPR, BPBD, Dinkes, Dishub).
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { formatDistance, formatDuration } from '~/utils/jalan-aing-routing'

const LAYER_NAMES = {
  ruasJalan: 'Jalan Provinsi',
  rumahSakit: 'rumah sakit',
  puskesmas: 'puskesmas',
  restArea: 'rest area',
  apj: 'APJ',
  bahayaBanjir: 'zona banjir',
  bahayaBanjirBandang: 'zona banjir bandang',
  bahayaTanahLongsor: 'zona longsor',
}

export default {
  name: 'JalanAingRoutePanel',
  props: {
    from: { type: Object, default: null },
    to: { type: Object, default: null },
    pickField: { type: String, default: null },
    userLocation: { type: Object, default: null },
    searchPlaces: { type: Function, required: true },
    journey: { type: Object, required: true },
    selected: { type: Object, default: null },
    previewKey: { type: String, default: '' },
    locationLoading: { type: Boolean, default: false },
    nearestLoading: { type: String, default: '' },
    nearestError: { type: String, default: '' },
  },
  data() {
    return {
      fields: [
        { id: 'from', label: 'Titik awal', placeholder: 'Dari mana?' },
        { id: 'to', label: 'Tujuan', placeholder: 'Mau ke mana?' },
      ],
      texts: { from: '', to: '' },
      activeField: null,
      activeOption: -1,
      results: [],
      searching: false,
      searchTimer: null,
      controller: null,
      stepsOpen: false,
      sheetExpanded: false,
      quickTargets: [
        { id: 'halte', label: 'Halte Bus MJT', detail: 'Data koridor MJT' },
        { id: 'rumahSakit', label: 'Rumah Sakit', detail: 'Data Dinas Kesehatan' },
        { id: 'puskesmas', label: 'Puskesmas', detail: 'Data Dinas Kesehatan' },
        { id: 'restArea', label: 'Rest Area', detail: 'Data Dinas Perhubungan' },
      ],
      facilityGroups: [
        { id: 'rumahSakit', label: 'Rumah Sakit', radius: '800 m' },
        { id: 'puskesmas', label: 'Puskesmas', radius: '800 m' },
        { id: 'restArea', label: 'Rest Area', radius: '1,5 km' },
      ],
    }
  },
  computed: {
    options() {
      const field = this.activeField
      if (!field) return []
      const actions = []
      actions.push({
          key: 'me',
          action: 'me',
          name: 'Lokasi saya',
          detail: this.userLocation
            ? 'Gunakan posisi Anda saat ini'
            : 'Izinkan akses lokasi di browser',
        })
        actions.push({
          key: 'map',
          action: 'map',
          name: 'Pilih di peta',
          detail: 'Ketuk titik pada peta',
        })
      return [
        ...actions,
        ...this.results.map((place) => ({
          key: place.place_id,
          name: place.name,
          detail: place.display_name,
          place,
        })),
      ]
    },
    selectedTransit() {
      return this.selected?.type === 'transit'
        ? this.journey.transit.options[this.selected.index]
        : null
    },
    selectedRoute() {
      if (this.selected?.type === 'car') return this.journey.car.route
      if (this.selected?.type === 'walk') return this.journey.walk.route
      return null
    },
    insights() {
      return this.journey.car.insights
    },
    insightsPendingLabel() {
      const pending = this.insights?.pending || []
      return pending
        .map((id) => LAYER_NAMES[id])
        .filter(Boolean)
        .slice(0, 3)
        .join(', ')
    },
    transitEmptyNote() {
      const transit = this.journey.transit
      if (transit.status === 'error')
        return 'Data Bus MJT sedang tidak dapat dimuat.'
      const halte = transit.nearestHalte
      return halte
        ? `Tidak ada koridor yang menghubungkan kedua titik dalam jarak jalan kaki. Halte terdekat: ${halte.name} (${formatDistance(halte.distance)}).`
        : 'Tidak ada koridor Bus MJT di sekitar titik ini.'
    },
    carWarning() {
      return Boolean(
        this.insights?.hazards?.some((zone) =>
          ['TINGGI', 'SEDANG'].includes(zone.level)
        )
      )
    },
    carNote() {
      const car = this.journey.car
      if (car.status === 'loading') return 'Menghitung rute…'
      if (car.status === 'error') return car.message
      const insights = this.insights
      if (!insights) return 'Memeriksa kondisi rute…'
      const parts = []
      if (insights.roads?.length)
        parts.push(`${insights.roads.length} ruas Jalan Provinsi`)
      if (insights.hazards?.length)
        parts.push(
          insights.hazards
            .map((zone) =>
              zone.level ? `${zone.label.toLowerCase()} ${this.levelLabel(zone.level).toLowerCase()}` : zone.label.toLowerCase()
            )
            .join(', ')
        )
      const facilities = insights.facilities || {}
      const nearby = ['rumahSakit', 'puskesmas', 'restArea'].reduce(
        (total, id) => total + (facilities[id]?.length || 0),
        0
      )
      if (nearby) parts.push(`${nearby} fasilitas dekat rute`)
      if (!parts.length)
        return insights.pending.length
          ? 'Memeriksa kondisi rute…'
          : 'Tidak ada catatan kondisi dari data Jalan Aing.'
      return parts.join(' · ')
    },
  },
  watch: {
    from: {
      immediate: true,
      handler(value) {
        this.texts.from = value?.label || ''
        if (value && this.activeField === 'from') this.closeField()
      },
    },
    to: {
      immediate: true,
      handler(value) {
        this.texts.to = value?.label || ''
        if (value && this.activeField === 'to') this.closeField()
      },
    },
    selected() {
      this.stepsOpen = false
    },
  },
  mounted() {
    if (window.matchMedia('(min-width: 768px)').matches)
      this.$nextTick(() => this.$refs[this.from ? 'input-to' : 'input-from']?.[0]?.focus())
  },
  beforeDestroy() {
    window.clearTimeout(this.searchTimer)
    this.controller?.abort()
  },
  methods: {
    formatDistance,
    formatDuration,
    rides(option) {
      return option.legs.filter((leg) => leg.type === 'ride')
    },
    levelLabel(level) {
      return { TINGGI: 'Tinggi', SEDANG: 'Sedang', RENDAH: 'Rendah' }[level] || ''
    },
    transitNote(option) {
      if (option.closed)
        return `Di luar jam operasional (${option.hours.join(', ')})`
      const first = this.rides(option)[0]
      const wait = formatDuration(option.firstWait)
      return option.firstWaitSource === 'live'
        ? `Bus ${first.kor} berikutnya ±${wait} di ${first.board.name}`
        : `Naik di ${first.board.name} · perkiraan tunggu ${wait}`
    },
    openField(id) {
      this.activeField = id
      this.activeOption = -1
      this.results = []
      if (this.texts[id] && this.texts[id] === this[id]?.label) return
      this.queueSearch(this.texts[id])
    },
    closeField() {
      this.activeField = null
      this.results = []
      this.controller?.abort()
      window.clearTimeout(this.searchTimer)
      this.searching = false
    },
    onInput(id, value) {
      this.texts[id] = value
      this.activeField = id
      this.queueSearch(value)
    },
    clearField(id) {
      this.texts[id] = ''
      this.$emit('set-point', { field: id, point: null })
      this.$refs[`input-${id}`]?.[0]?.focus()
      this.openField(id)
    },
    queueSearch(value) {
      window.clearTimeout(this.searchTimer)
      this.controller?.abort()
      this.results = []
      this.activeOption = -1
      const query = (value || '').trim()
      this.searching = query.length >= 3
      if (!this.searching) return
      this.searchTimer = window.setTimeout(async () => {
        this.controller = new AbortController()
        const { signal } = this.controller
        try {
          const results = await this.searchPlaces(query, signal)
          if (signal.aborted) return
          this.results = results.slice(0, 8)
          this.activeOption = this.results.length ? 0 : -1
        } catch (error) {
          if (!signal.aborted) this.results = []
        } finally {
          if (!signal.aborted) this.searching = false
        }
      }, 350)
    },
    moveOption(change) {
      if (!this.options.length) return
      this.activeOption =
        (this.activeOption + change + this.options.length) %
        this.options.length
    },
    chooseActiveOption() {
      const option = this.options[this.activeOption]
      if (option) this.choose(option)
    },
    choose(option) {
      const field = this.activeField
      if (!field) return
      if (option.action === 'me') {
        this.$emit('use-my-location', field)
      } else if (option.action === 'map') {
        this.$emit('pick-on-map', field)
      } else {
        this.$emit('set-point', {
          field,
          point: {
            lat: Number(option.place.lat),
            lng: Number(option.place.lon),
            label: option.place.name,
          },
        })
      }
      this.closeField()
      this.$refs[`input-${field}`]?.[0]?.blur()
    },
  },
}
</script>

<style scoped>
.ja-route {
  --ja-ink: #14233f;
  --ja-muted: #68758a;
  --ja-rule: #e7ece9;
  --ja-green: #0d6d43;
  --ja-ease: cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  font-family: Lato, sans-serif;
  color: var(--ja-ink);
}
.ja-route-top {
  position: relative;
  padding: 15px 25px 14px;
  border-bottom: 1px solid var(--ja-rule);
  background: #fff;
}
.ja-route-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.ja-route-head h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}
.ja-route-icon-button {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  margin-left: -6px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ja-ink);
  cursor: pointer;
}
.ja-route-icon-button:hover {
  background: #f1f4f2;
}
.ja-route-fields {
  position: relative;
  display: grid;
  gap: 8px;
  padding-right: 44px;
}
.ja-route-field {
  display: flex;
  height: 44px;
  align-items: center;
  gap: 10px;
  padding: 0 8px 0 10px;
  border: 1px solid #d5dbe2;
  border-radius: 8px;
  background: #fff;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.ja-route-field.is-active,
.ja-route-field.is-picking {
  border-color: var(--ja-green);
  box-shadow: 0 0 0 3px rgba(13, 109, 67, 0.12);
}
.ja-route-marker {
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 5px;
  background: var(--ja-ink);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.ja-route-marker.is-to {
  background: var(--ja-green);
}
.ja-route-field input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ja-ink);
  font: inherit;
  font-size: 14px;
}
.ja-route-field input::-webkit-search-cancel-button {
  display: none;
}
.ja-route-field input::placeholder {
  color: #8791a3;
}
.ja-route-clear {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #596273;
  cursor: pointer;
}
.ja-route-clear:hover {
  background: #eef1f4;
}
.ja-route-swap {
  position: absolute;
  top: 50%;
  right: 0;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid #d5dbe2;
  border-radius: 8px;
  background: #fff;
  color: var(--ja-ink);
  cursor: pointer;
  transform: translateY(-50%);
  transition: transform 300ms var(--ja-ease);
}
.ja-route-swap:active {
  transform: translateY(-50%) rotate(180deg);
}
.ja-route-options {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  z-index: 20;
  max-height: min(360px, 45dvh);
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid #d9dde4;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 26px rgba(20, 35, 63, 0.14);
}
.ja-route-option {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 0;
  border-bottom: 1px solid var(--ja-rule);
  background: transparent;
  color: var(--ja-ink);
  text-align: left;
  cursor: pointer;
}
.ja-route-option strong {
  font-size: 13px;
}
.ja-route-option span {
  overflow: hidden;
  color: var(--ja-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ja-route-option.is-action strong {
  color: var(--ja-green);
}
.ja-route-option.is-active,
.ja-route-option:hover {
  background: #f5f7f9;
}
.ja-route-note {
  margin: 0;
  padding: 10px 12px;
  color: var(--ja-muted);
  font-size: 12px;
}

/* Body */
.ja-route-body {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: #fff;
}
.ja-route-handle {
  display: none;
}
.ja-route-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 14px 25px 0;
  color: var(--ja-muted);
  font-size: 13px;
  line-height: 1.45;
}
.ja-route-status.is-error {
  color: #b45309;
}
.ja-route-status button {
  margin-left: auto;
  padding: 6px 10px;
  border: 1px solid #d5dbe2;
  border-radius: 6px;
  background: #fff;
  color: var(--ja-ink);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.ja-route-progress {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 3px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 2px;
  background: #dcebe2;
  vertical-align: middle;
}
.ja-route-progress::after {
  position: absolute;
  inset: 0 auto 0 0;
  width: 45%;
  background: var(--ja-green);
  content: '';
  animation: ja-route-progress 1s var(--ja-ease) infinite;
}
.ja-route-label {
  margin: 0;
  padding: 16px 25px 8px;
  color: var(--ja-muted);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: normal;
  text-transform: none;
}
.ja-route-quick {
  display: grid;
  padding-bottom: 12px;
}
.ja-route-quick button {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 12px;
  padding: 10px 13px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ja-ink);
  text-align: left;
  cursor: pointer;
}
.ja-route-quick button:hover {
  background: #f5f7f9;
}
.ja-route-quick strong {
  font-size: 14px;
}
.ja-route-quick span {
  color: var(--ja-muted);
  font-size: 12px;
}
.ja-route-list {
  display: flex;
  flex-direction: column;
}
.ja-route-row {
  display: grid;
  gap: 4px;
  margin: 0 12px 6px;
  padding: 12px 13px;
  border: 1px solid var(--ja-rule);
  border-radius: 8px;
  background: #fff;
  color: var(--ja-ink);
  font: inherit;
  text-align: left;
  transition: border-color 160ms ease, background-color 160ms ease,
    transform 160ms var(--ja-ease);
}
button.ja-route-row {
  cursor: pointer;
}
button.ja-route-row:hover {
  border-color: #bfd3c6;
}
button.ja-route-row:active {
  transform: scale(0.985);
}
.ja-route-row.is-preview {
  border-color: var(--ja-green);
  box-shadow: inset 3px 0 0 var(--ja-green);
}
.ja-route-row.is-pending,
.ja-route-row.is-empty {
  background: #fafbfa;
}
.ja-route-row-kind {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  color: var(--ja-muted);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: normal;
  text-transform: none;
}
.ja-route-kor {
  display: inline-flex;
  height: 20px;
  align-items: center;
  padding: 0 6px;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
}
.ja-route-kor + .ja-route-kor::before {
  margin: 0 4px 0 -2px;
  content: '';
}
.ja-route-row-main {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
  color: var(--ja-muted);
  font-size: 13px;
  font-weight: 700;
}
.ja-route-row-main strong {
  color: var(--ja-ink);
  font-size: 18px;
  font-weight: 900;
}
.ja-route-row-sub {
  color: var(--ja-muted);
  font-size: 12px;
  line-height: 1.4;
}
.ja-route-row-sub.is-warning {
  color: #b45309;
}
.ja-route-credit {
  margin: auto 0 0;
  padding: 12px 25px 16px;
  color: #8a94a3;
  font-size: 11px;
  line-height: 1.45;
}

/* Detail */
.ja-route-detail {
  display: flex;
  flex-direction: column;
}
.ja-route-back {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 4px;
  margin: 12px 0 0 18px;
  padding: 6px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ja-green);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.ja-route-back:hover {
  background: #f1f8f4;
}
.ja-route-summary {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 25px 12px;
}
.ja-route-time {
  color: var(--ja-green);
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
}
.ja-route-distance {
  color: var(--ja-muted);
  font-size: 14px;
  font-weight: 700;
}
.ja-route-alert {
  margin: 0 25px 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: #fff7ed;
  color: #b45309;
  font-size: 12px;
  font-weight: 700;
}
.ja-route-timeline {
  margin: 0;
  padding: 0 12px 8px;
  list-style: none;
}
.ja-route-timeline li {
  position: relative;
  padding-left: 22px;
}
.ja-route-timeline li::before {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 11px;
  width: 4px;
  border-radius: 2px;
  background: var(--leg-color, #c9d1d9);
  content: '';
}
.ja-route-timeline li.is-walk::before {
  width: 0;
  border-left: 3px dotted #9aa5b4;
  background: none;
}
.ja-route-timeline button {
  display: grid;
  width: 100%;
  gap: 3px;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ja-ink);
  font: inherit;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
}
.ja-route-timeline button:hover {
  background: #f5f7f9;
}
.ja-route-timeline span {
  color: #4b5567;
}
.ja-route-ride-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ja-route-ride-head strong {
  color: var(--ja-ink);
}
.ja-route-muted {
  margin: 0;
  color: var(--ja-muted) !important;
  font-size: 12px;
}
.ja-route-section {
  padding: 4px 25px 12px;
  border-top: 1px solid var(--ja-rule);
}
.ja-route-section h3 {
  margin: 12px 0 4px;
  font-size: 14px;
  font-weight: 800;
}
.ja-route-section .ja-route-muted {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}
.ja-route-group {
  padding-top: 8px;
}
.ja-route-group h4 {
  margin: 0 0 4px;
  color: var(--ja-muted);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: normal;
  text-transform: none;
}
.ja-route-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ja-route-item-main {
  display: grid;
  width: 100%;
  min-width: 0;
  flex: 1;
  gap: 2px;
  margin: 0 -10px;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ja-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.ja-route-item-main:hover {
  background: #f5f7f9;
}
.ja-route-item-main strong {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.ja-route-item-main span {
  color: var(--ja-muted);
  font-size: 12px;
}
.ja-route-item-action {
  flex: 0 0 auto;
  height: 30px;
  margin-left: 10px;
  padding: 0 10px;
  border: 1px solid var(--ja-green);
  border-radius: 6px;
  background: #fff;
  color: var(--ja-green);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
.ja-route-item-action:hover {
  background: #f1f8f4;
}
.ja-route-level {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
}
.ja-route-level.is-tinggi {
  background: #fee2e2;
  color: #b91c1c !important;
}
.ja-route-level.is-sedang {
  background: #fef3c7;
  color: #b45309 !important;
}
.ja-route-level.is-rendah {
  background: #dcfce7;
  color: #15803d !important;
}
.ja-route-steps-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 10px 0;
  border: 0;
  background: transparent;
  color: var(--ja-ink);
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.ja-route-steps {
  margin: 0 -13px;
  padding: 0;
  list-style: none;
}
.ja-route-steps button {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 12px;
  padding: 9px 13px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ja-ink);
  text-align: left;
  cursor: pointer;
}
.ja-route-steps button:hover {
  background: #f5f7f9;
}
.ja-route-step-index {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 5px;
  background: #eef3f0;
  color: var(--ja-green);
  font-size: 11px;
  font-weight: 800;
}
.ja-route-step-text {
  flex: 1;
  font-size: 13px;
  line-height: 1.45;
}
.ja-route-step-distance {
  color: var(--ja-muted);
  font-size: 12px;
  white-space: nowrap;
}
.ja-route button:focus-visible,
.ja-route input:focus-visible {
  outline: 2px solid var(--ja-green);
  outline-offset: 2px;
}
.ja-route-pop-enter-active,
.ja-route-pop-leave-active {
  transition: opacity 180ms var(--ja-ease), transform 220ms var(--ja-ease);
}
.ja-route-pop-enter,
.ja-route-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
@keyframes ja-route-progress {
  from {
    transform: translateX(-110%);
  }
  to {
    transform: translateX(260%);
  }
}

/* Mobile: fields float on top, everything else is a bottom sheet. */
@media (max-width: 767px) {
  .ja-route {
    display: contents;
  }
  .ja-route-top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 760;
    padding: 10px 12px 12px;
    box-shadow: 0 4px 16px rgba(20, 35, 63, 0.12);
    animation: ja-route-drop 360ms var(--ja-ease);
  }
  .ja-route-head {
    margin-bottom: 10px;
  }
  .ja-route-field input {
    font-size: 16px;
  }
  .ja-route-body {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 740;
    max-height: 46%;
    flex: none;
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 1px solid var(--ja-rule);
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -6px 24px rgba(20, 35, 63, 0.14);
    transition: max-height 420ms var(--ja-ease);
    animation: ja-route-rise 420ms var(--ja-ease);
  }
  .ja-route-body.is-expanded {
    max-height: calc(100% - 196px);
  }
  .ja-route-handle {
    position: sticky;
    top: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 22px;
    flex: 0 0 auto;
    border: 0;
    background: #fff;
    cursor: pointer;
  }
  .ja-route-handle::before {
    display: block;
    width: 36px;
    height: 4px;
    margin: 0 auto;
    border-radius: 2px;
    background: #d5dbe2;
    content: '';
  }
  .ja-route-status,
  .ja-route-label {
    padding-right: 16px;
    padding-left: 16px;
  }
  .ja-route-status {
    padding-top: 4px;
  }
  .ja-route-label {
    padding-top: 4px;
  }
  .ja-route-row,
  .ja-route-quick button {
    margin-right: 8px;
    margin-left: 8px;
  }
  .ja-route-back {
    margin: 0 0 0 10px;
  }
  .ja-route-summary,
  .ja-route-section,
  .ja-route-credit {
    padding-right: 16px;
    padding-left: 16px;
  }
  .ja-route-alert {
    margin-right: 16px;
    margin-left: 16px;
  }
  .ja-route-timeline {
    padding: 0 4px 8px;
  }
}
@keyframes ja-route-drop {
  from {
    transform: translateY(-100%);
  }
}
@keyframes ja-route-rise {
  from {
    transform: translateY(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ja-route-top,
  .ja-route-body {
    animation: none;
    transition: none;
  }
}
.ja-route-intro, .ja-route-list-hint {
  margin: 4px 0 0;
  color: var(--ja-muted);
  font-size: 12px;
  line-height: 1.5;
}
.ja-route-list-hint { padding: 0 25px 16px; }
.ja-route-start-actions {
  display: grid;
  gap: 8px;
  padding: 20px 25px 0;
}
.ja-route-start-actions button {
  min-height: 44px;
  border: 1px solid var(--ja-rule);
  border-radius: 6px;
  color: var(--ja-green);
  background: transparent;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.ja-route-start-actions button:hover { border-color: var(--ja-green); }
.ja-route-row { padding: 16px; margin-bottom: 10px; }
.ja-route-row.is-preview { background: #e6f6ec; }
.ja-route-back { position: sticky; top: 0; z-index: 2; background: white; }
@media (max-width: 767px) {
  .ja-route-intro { display: none; }
  .ja-route-body.is-searching { visibility: hidden; }
  .ja-route-body.is-picking { max-height: 100px; }
  .ja-route-body.is-picking .ja-route-quick { display: none; }
  .ja-route-start-actions { grid-template-columns: 1fr 1fr; padding: 12px 16px 0; }
  .ja-route-start-actions button { font-size: 12px; }
  .ja-route-list-hint { padding: 0 16px 12px; }
}
</style>
