<template>
  <section class="grid grid-cols-1 gap-y-4 mb-4">
    <h4 class="font-roboto font-medium text-black dark:text-dark-emphasis-high text-sm mb-4">
      Lokasi Tanah untuk Pembangunan/Perbaikan Rumah
    </h4>

    <!-- Show selected village summary -->
    <div class="mb-4 text-sm text-gray-700 dark:text-dark-emphasis-medium">
      <div class="mb-1">Kecamatan / Kelurahan: <strong class="text-black dark:text-dark-emphasis-high">{{ lokasiTanah.district_name || '-' }} / {{ lokasiTanah.village_name || '-' }}</strong></div>
      <div class="mb-1">Titik tengah desa: <strong class="text-black dark:text-dark-emphasis-high">{{ villageCenterCoordsText }}</strong></div>
    </div>

    <!-- Dusun (optional) -->
    <div class="flex flex-col gap-2 mb-4">
      <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">Dusun</label>
      <JdsInputText :value="dusun" @input="setDusun($event)" placeholder="Masukkan nama dusun (opsional)" />
    </div>

    <!-- RW & RT -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <ValidationProvider rules="required|numeric" name="RW" v-slot="{ errors }">
        <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">RW <span class="text-red-500">*</span></label>
        <JdsInputText :value="rw" @input="setRw($event)" :error-message="errors[0]" placeholder="Contoh: 001" />
      </ValidationProvider>

      <ValidationProvider rules="required|numeric" name="RT" v-slot="{ errors }">
        <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">RT <span class="text-red-500">*</span></label>
        <JdsInputText :value="rt" @input="setRt($event)" :error-message="errors[0]" placeholder="Contoh: 002" />
      </ValidationProvider>
    </div>

    <!-- Address detail -->
    <div class="flex flex-col gap-2 mb-4">
      <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">Detail Alamat (opsional)</label>
      <textarea
        class="border rounded p-2 min-h-[80px] text-sm dark:bg-dark-emphasis-low dark:border-dark-emphasis-medium"
        :value="addressDetail"
        @input="setAddressDetail($event.target.value)"
        maxlength="1000"
        placeholder="Tambahkan keterangan alamat jika diperlukan"
      />
    </div>

    <!-- Map picker -->
    <div class="mb-3">
      <p class="font-lato text-[12px] text-gray-500 mt-1 mb-2">
        Pastikan tagging dilakukan di titik lokasi tanah untuk perbaikan/pembangunan rumah
      </p>

      <div class="h-64 rounded overflow-hidden border dark:border-dark-emphasis-medium">
        <BaseMap
          :center="defaultMapCoords"
          :zoom="15"
          :readonly="!isMapEnabled"
        />
      </div>

      <div class="mt-3">
        <button type="button" class="jds-button jds-button--secondary" @click="openLocationModal" :disabled="!isMapEnabled">
          Pilih Titik Lokasi Tanah
        </button>
      </div>
    </div>

    <TrackingComplaintLocationModal v-if="showLocationModal" @close="showLocationModal = false" @select="onLocationSelected" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import BaseMap from '~/components/Base/Map.vue'
import TrackingComplaintLocationModal from '~/components/TrackingComplaint/LocationModal.vue'

export default {
  components: {
    BaseMap,
    TrackingComplaintLocationModal,
  },
  data() {
    return {
      showLocationModal: false,
    }
  },
  computed: {
    ...mapState('imahAingForm', {
      lokasiTanah: (s) => s.lokasiTanah,
    }),

    isMapEnabled() {
      return !!(this.lokasiTanah && this.lokasiTanah.village_id)
    },

    defaultMapCoords() {
      return (this.lokasiTanah && this.lokasiTanah.village_center_coords) || { lat: -6.914744, lng: 107.60981 }
    },

    villageCenterCoordsText() {
      const c = this.lokasiTanah?.village_center_coords
      return c ? `${c.lat}, ${c.lng}` : '-'
    },

    dusun() {
      return this.lokasiTanah?.dusun || ''
    },
    rw() {
      return this.lokasiTanah?.rw || ''
    },
    rt() {
      return this.lokasiTanah?.rt || ''
    },
    addressDetail() {
      return this.lokasiTanah?.address_detail || ''
    },
  },
  methods: {
    openLocationModal() {
      this.showLocationModal = true
    },

    onLocationSelected(payload) {
      // Expect payload: { location: { lat, lng }, place: { name, address }, village_id, village_name, district_id, district_name, city_id, city_name }
      this.showLocationModal = false
      if (!payload) return

      // Commit fields to store
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'location', value: payload.location })
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'place', value: payload.place })
      if (payload.village_id) this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: payload.village_id })
      if (payload.village_name) this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'village_name', value: payload.village_name })
      if (payload.district_id) this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'district_id', value: payload.district_id })
      if (payload.district_name) this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'district_name', value: payload.district_name })
      if (payload.city_id) this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'city_id', value: payload.city_id })
      if (payload.city_name) this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'city_name', value: payload.city_name })
    },

    setDusun(val) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'dusun', value: val })
    },

    setRw(val) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'rw', value: String(val) })
    },

    setRt(val) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'rt', value: String(val) })
    },

    setAddressDetail(val) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'address_detail', value: val })
    },
  },
}
</script>

<style scoped>
.h-64 {
  height: 16rem;
}
</style>
