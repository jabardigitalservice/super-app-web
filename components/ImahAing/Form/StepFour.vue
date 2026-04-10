<template>
  <ValidationObserver ref="observer">
  <section class="grid grid-cols-1 gap-y-4 mb-4">
    <h4 class="font-roboto font-medium text-black dark:text-dark-emphasis-high text-sm mb-4">
      Lokasi Tanah untuk Pembangunan/Perbaikan Rumah
    </h4>

    <!-- Show selected village summary -->
    <div class="mb-4 text-sm text-gray-700 dark:text-dark-emphasis-medium">
      <div class="mb-1">Kecamatan / Kelurahan: <strong class="text-black dark:text-dark-emphasis-high">{{ lokasiTanah.districtName || '-' }} / {{ lokasiTanah.villageName || '-' }}</strong></div>
      <div class="mb-1">Titik tengah desa: <strong class="text-black dark:text-dark-emphasis-high">{{ villageCenterCoordsText }}</strong></div>
    </div>

    <!-- Dusun (optional) -->
    <!-- Kota / Kecamatan / Kelurahan (cascading) -->
    <section class="grid grid-cols-1 gap-y-4 mb-4">
      <ValidationProvider v-slot="{ errors }" rules="required" class="flex flex-col gap-2 w-full" tag="section" name="Kota/Kabupaten">
        <label class="font-roboto font-medium text-black text-sm dark:text-dark-emphasis-high">Kota/Kabupaten <span class="text-red-500">*</span></label>
        <JdsSelect
          v-model="setValueCity"
          filterable
          filter-type="contain"
          placeholder="Pilih kota/kabupaten"
          :error-message="errors[0]"
          :options="citiesOption"
        />
      </ValidationProvider>

      <ValidationProvider v-slot="{ errors }" rules="required" class="flex flex-col gap-2 w-full" tag="section" name="Kecamatan">
        <label class="font-roboto font-medium text-black text-sm dark:text-dark-emphasis-high">Kecamatan <span class="text-red-500">*</span></label>
        <JdsSelect
          v-model="setValueSubDistrict"
          filterable
          filter-type="contain"
          placeholder="Pilih kecamatan"
          :error-message="errors[0]"
          :options="subDitrictsOption"
          :disabled="subDitrictsOption.length === 0"
        />
      </ValidationProvider>

      <ValidationProvider v-slot="{ errors }" rules="required" class="flex flex-col gap-2" tag="section" name="Kelurahan/Desa">
        <label class="font-roboto font-medium text-black text-sm dark:text-dark-emphasis-high">Kelurahan/Desa <span class="text-red-500">*</span></label>
        <JdsSelect
          v-model="setValueVillage"
          filterable
          filter-type="contain"
          placeholder="Pilih kelurahan/desa"
          :error-message="errors[0]"
          :options="villagesOption"
          :disabled="villagesOption.length === 0"
        />
      </ValidationProvider>
    </section>

    <div class="flex flex-col gap-2 mb-4">
      <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">Dusun</label>
      <JdsInputText :value="dusun" placeholder="Masukkan nama dusun (opsional)" @input="setDusun($event)" />
    </div>

    <!-- RW & RT -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <ValidationProvider v-slot="{ errors }" rules="required|numeric" name="RW">
        <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">RW <span class="text-red-500">*</span></label>
        <JdsInputText :value="rw" :error-message="errors[0]" placeholder="Contoh: 001" @input="setRw($event)" />
      </ValidationProvider>

      <ValidationProvider v-slot="{ errors }" rules="required|numeric" name="RT">
        <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">RT <span class="text-red-500">*</span></label>
        <JdsInputText :value="rt" :error-message="errors[0]" placeholder="Contoh: 002" @input="setRt($event)" />
      </ValidationProvider>
    </div>

    <!-- Address detail -->
    <div class="flex flex-col gap-2 mb-4">
      <label class="text-sm font-medium text-black dark:text-dark-emphasis-high">Detail Alamat (opsional)</label>
      <textarea
        class="border rounded p-2 min-h-[80px] text-sm dark:bg-dark-emphasis-low dark:border-dark-emphasis-medium"
        :value="addressDetail"
        maxlength="1000"
        placeholder="Tambahkan keterangan alamat jika diperlukan"
        @input="setAddressDetail($event.target.value)"
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
        <button type="button" class="jds-button jds-button--secondary" :disabled="!isMapEnabled" @click="openLocationModal">
          Pilih Titik Lokasi Tanah
        </button>
      </div>
    </div>

    <TrackingComplaintLocationModal v-if="showLocationModal" :is-open="showLocationModal" title="Tentukan Titik Lokasi Tanah" @close="showLocationModal = false">
      <div class="space-y-3">
        <BaseMap
          v-show="cloneLocation"
          :coords="cloneLocation.location"
          :zoom="16"
          @set:place="getPlaceDetail"
          @dragend:marker="setCoords"
          @click:map="setCoords"
        />
      </div>

      <div class="py-4 px-6 flex flex-col gap-2">
        <h5 class="text-base text-black font-lato font-semibold dark:text-dark-emphasis-high">{{ cloneLocation.place.name || '-' }}</h5>
        <p class="text-sm font-lato text-gray-500 dark:text-dark-emphasis-high">{{ cloneLocation.place.address || '-' }}</p>
        <p class="text-sm font-lato text-gray-400 dark:text-dark-emphasis-high">
          <span>{{ cloneLocation.location.lat || '-' }}</span>, <span>{{ cloneLocation.location.lng || '-' }}</span>
        </p>
      </div>

      <template #footer>
        <button class="jds-button jds-button--primary ml-auto" @click="handleLocation">Pilih Lokasi ini</button>
      </template>
    </TrackingComplaintLocationModal>
  </section>
  </ValidationObserver>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'
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
      cloneLocation: cloneDeep(this.$store.state.imahAingForm.lokasiTanah),
    }
  },
  computed: {
    ...mapState('imahAingForm', {
      lokasiTanah: (s) => s.lokasiTanah,
    }),

    ...mapGetters('location', ['citiesOption', 'subDitrictsOption', 'villagesOption']),

    isMapEnabled() {
      return !!(this.lokasiTanah && this.lokasiTanah.villageId)
    },

    defaultMapCoords() {
      return (this.lokasiTanah && this.lokasiTanah.villageCenterCoords) || { lat: -6.914744, lng: 107.60981 }
    },

    villageCenterCoordsText() {
      const c = this.lokasiTanah?.villageCenterCoords
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
      return this.lokasiTanah?.addressDetail || ''
    },
    // v-model computed setters for selects
    setValueCity: {
      get() {
        return this.$store.state.imahAingForm.lokasiTanah.cityName
      },
      set(value) {
        this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'city_name', value })
        this.handleCitySelected()
      },
    },
    setValueSubDistrict: {
      get() {
        return this.$store.state.imahAingForm.lokasiTanah.districtName
      },
      set(value) {
        this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'district_name', value })
        this.handleSubdistrictSelected()
      },
    },
    setValueVillage: {
      get() {
        return this.$store.state.imahAingForm.lokasiTanah.villageName
      },
      set(value) {
        this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'village_name', value })
        this.handleVillageSelected()
      },
    },
  },
  created() {
    this.setCitiesOption('cities')
  },

  mounted() {
    // initialize cloneLocation coordinates with geolocation fallback
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.cloneLocation.location.lat = position.coords.latitude
          this.cloneLocation.location.lng = position.coords.longitude
        },
        () => {
          this.cloneLocation.location.lat = -6.9025
          this.cloneLocation.location.lng = 107.6187
        }
      )
    } else {
      this.cloneLocation.location.lat = -6.9025
      this.cloneLocation.location.lng = 107.6187
    }
  },

  methods: {
    ...mapActions('location', ['setCitiesOption']),
    ...mapActions('imahAingForm', ['handleCitySelected', 'handleSubdistrictSelected', 'handleVillageSelected']),

    openLocationModal() {
      this.cloneLocation = cloneDeep(this.lokasiTanah)
      this.showLocationModal = true
    },

    // Modal + BaseMap integration
    getPlaceDetail(place) {
      this.cloneLocation.place.name = place.name ?? ''
      this.cloneLocation.place.address = place.formatted_address ?? ''
    },

    setCoords({ event }) {
      if (event && event.latLng) {
        this.cloneLocation.location.lat = event.latLng.lat()
        this.cloneLocation.location.lng = event.latLng.lng()
      }
    },

    handleLocation() {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'location', value: { ...this.cloneLocation.location } })
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', { field: 'place', value: { ...this.cloneLocation.place } })
      this.showLocationModal = false
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

    async validate() {
      return await this.$refs.observer.validate()
    },
  },
}
</script>

<style scoped>
.h-64 {
  height: 16rem;
}
</style>
