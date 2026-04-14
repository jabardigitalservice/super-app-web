<template>
  <ValidationObserver ref="observer">
    <section>
      <section class="grid grid-cols-1 mb-4 gap-x-8 gap-y-6">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          class="flex flex-col w-full gap-2"
          tag="section"
          name="Kota/Kabupaten"
        >
          <label
            for="city"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Kota/Kabupaten <span class="text-red-500">*</span>
          </label>
          <JdsSelect
            id="city"
            v-model="setValueCity"
            filterable
            filter-type="contain"
            placeholder="Pilih kota/kabupaten"
            :error-message="errors[0]"
            :options="getCitiesOption"
          />
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          class="flex flex-col w-full gap-2"
          tag="section"
          name="Kecamatan"
        >
          <label
            for="subdistrict"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Kecamatan <span class="text-red-500">*</span>
          </label>
          <JdsSelect
            id="subdistrict"
            v-model="setValueSubDistrict"
            filterable
            filter-type="contain"
            placeholder="Pilih kecamatan"
            :error-message="errors[0]"
            :options="getSubDitrictsOption"
            :disabled="getSubDitrictsOption.length === 0"
          />
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          class="flex flex-col gap-2"
          tag="section"
          name="Kelurahan/Desa"
        >
          <label
            for="village"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Kelurahan/Desa <span class="text-red-500">*</span>
          </label>
          <JdsSelect
            id="village"
            v-model="setValueVillage"
            filterable
            filter-type="contain"
            placeholder="Pilih kelurahan/desa"
            :error-message="errors[0]"
            :options="getVillagesOption"
            :disabled="getVillagesOption.length === 0"
          />
        </ValidationProvider>

        <div class="flex flex-col gap-2">
          <label
            for="dusun"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Dusun
            <span class="text-gray-300 dark:text-dark-emphasis-high">
              (opsional)
            </span>
          </label>
          <JdsInputText
            id="dusun"
            :value="dusun"
            class="w-full"
            placeholder="Masukkan nama dusun"
            @input="setDusun($event)"
          />
        </div>

        <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|numeric"
            class="flex flex-col gap-2"
            name="RW"
          >
            <label
              for="rw"
              class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
            >
              RW <span class="text-red-500">*</span>
            </label>
            <JdsInputText
              id="rw"
              :value="rw"
              class="w-full"
              :error-message="errors[0]"
              placeholder="Contoh: 001"
              @input="setRw($event)"
            />
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            rules="required|numeric"
            class="flex flex-col gap-2"
            name="RT"
          >
            <label
              for="rt"
              class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
            >
              RT <span class="text-red-500">*</span>
            </label>
            <JdsInputText
              id="rt"
              :value="rt"
              class="w-full"
              :error-message="errors[0]"
              placeholder="Contoh: 002"
              @input="setRt($event)"
            />
          </ValidationProvider>
        </section>

        <ValidationProvider
          v-slot="{ errors }"
          class="flex flex-col gap-2"
          name="Titik Lokasi Tanah"
        >
          <label
            for="location"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Titik Lokasi Tanah
            <span class="text-gray-300 dark:text-dark-emphasis-high">
              (opsional)
            </span>
          </label>
          <JdsInputText
            id="location"
            :value="address"
            class="w-full"
            placeholder="Tambah Titik Lokasi Tanah"
            :error-message="errors[0]"
            readonly
          >
            <template #prefix-icon>
              <Icon src="/icon/location-picker.svg" size="15px" />
            </template>
            <template #suffix-icon>
              <button
                type="button"
                class="text-sm font-semibold text-green-700 font-lato"
                @click="openLocationModal"
              >
                Pilih
              </button>
            </template>
          </JdsInputText>
        </ValidationProvider>

        <ValidationProvider
          class="flex flex-col gap-2"
          name="Detail Lokasi Tambahan"
        >
          <label
            for="additionalLocation"
            class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
          >
            Detail lokasi tambahan
            <span class="text-gray-300 dark:text-dark-emphasis-high">
              (opsional)
            </span>
          </label>
          <textarea
            id="additionalLocation"
            placeholder="Masukkan disini"
            :value="setValueAddressDetail"
            rows="3"
            maxlength="1000"
            class="w-full border border-gray-500 rounded-lg px-2 py-1 bg-gray-50 mb-1 hover:bg-white disabled:bg-gray-200 disabled:border-gray-500 hover:border-green-600 focus:outline-none focus:border-green-500 focus:outline-1 focus:outline-offset-[-2px] focus:outline-yellow-500 text-black"
            @input="setAddressDetail($event.target.value)"
          />
          <p class="text-xs text-left text-gray-600">
            Tersisa {{ 1000 - setValueAddressDetail.length }} karakter
          </p>
        </ValidationProvider>
      </section>

      <TrackingComplaintLocationModal
        v-if="showLocationModal"
        :is-open="showLocationModal"
        title="Tentukan Titik Lokasi Tanah"
        @close="closeMaps"
      >
        <div class="space-y-3">
          <BaseMap
            v-show="cloneLoc"
            :coords="cloneLoc"
            :zoom="16"
            @set:place="getPlaceDetail"
            @dragend:marker="setCoords"
            @click:map="setCoords"
          />
        </div>

        <div class="flex flex-col gap-2 px-6 py-4">
          <h5
            class="text-base font-semibold text-black font-lato dark:text-dark-emphasis-high"
          >
            {{ clonePlace.name || '-' }}
          </h5>
          <p
            class="text-sm text-gray-500 font-lato dark:text-dark-emphasis-high"
          >
            {{ clonePlace.address || '-' }}
          </p>
          <p
            class="text-sm text-gray-400 font-lato dark:text-dark-emphasis-high"
          >
            <span>{{ cloneLoc.lat || '-' }}</span>
            ,
            <span>{{ cloneLoc.lng || '-' }}</span>
          </p>
        </div>

        <template #footer>
          <BaseButton
            class="ml-auto mr-2 text-sm font-bold text-white bg-green-700 dark:border-0 hover:bg-green-600"
            @click="handleLocation"
          >
            Pilih Lokasi ini
          </BaseButton>
        </template>
      </TrackingComplaintLocationModal>
    </section>
  </ValidationObserver>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapActions, mapGetters, mapState } from 'vuex'
import { IMAH_AING_DEFAULT_LOCATION } from '~/store/imah-aing/imahAingForm.js'
import BaseMap from '~/components/Base/Map.vue'
import TrackingComplaintLocationModal from '~/components/TrackingComplaint/LocationModal.vue'

export default {
  name: 'ImahAingFormStepFour',
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
      lokasiTanah: (state) => state.lokasiTanah,
    }),
    ...mapGetters('location', [
      'citiesOption',
      'subDitrictsOption',
      'villagesOption',
    ]),
    getCitiesOption() {
      return this.citiesOption || []
    },
    getSubDitrictsOption() {
      return this.subDitrictsOption || []
    },
    getVillagesOption() {
      return this.villagesOption || []
    },
    cloneLoc() {
      return this.cloneLocation.location
    },
    clonePlace() {
      return this.cloneLocation.place
    },
    address() {
      return this.lokasiTanah.place.address
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
    setValueAddressDetail() {
      return this.lokasiTanah?.addressDetail || ''
    },
    setValueCity: {
      get() {
        return this.lokasiTanah.cityName
      },
      set(value) {
        this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
          field: 'city_name',
          value,
        })
        this.handleCitySelected()
      },
    },
    setValueSubDistrict: {
      get() {
        return this.lokasiTanah.districtName
      },
      set(value) {
        this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
          field: 'district_name',
          value,
        })
        this.handleSubdistrictSelected()
      },
    },
    setValueVillage: {
      get() {
        return this.lokasiTanah.villageName
      },
      set(value) {
        this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
          field: 'village_name',
          value,
        })
        this.handleVillageSelected()
      },
    },
  },
  created() {
    this.setCitiesOption('cities')
  },
  methods: {
    ...mapActions('location', ['setCitiesOption']),
    ...mapActions('imahAingForm', [
      'handleCitySelected',
      'handleSubdistrictSelected',
      'handleVillageSelected',
    ]),
    openLocationModal() {
      this.cloneLocation = cloneDeep(this.lokasiTanah)
      const { lat, lng } = this.cloneLocation.location
      const unset =
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        (lat === 0 && lng === 0)
      if (unset) {
        this.cloneLocation.location = { ...IMAH_AING_DEFAULT_LOCATION }
      }
      this.showLocationModal = true
    },
    closeMaps() {
      this.showLocationModal = false
    },
    getPlaceDetail(place) {
      this.cloneLocation.place.name = place.name ?? ''
      this.cloneLocation.place.address = place.formatted_address ?? ''
    },
    setCoords({ event }) {
      if (event?.latLng) {
        this.cloneLocation.location.lat = event.latLng.lat()
        this.cloneLocation.location.lng = event.latLng.lng()
      }
    },
    handleLocation() {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
        field: 'location',
        value: { ...this.cloneLocation.location },
      })
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
        field: 'place',
        value: { ...this.cloneLocation.place },
      })
      this.closeMaps()
    },
    setDusun(value) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
        field: 'dusun',
        value,
      })
    },
    setRw(value) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
        field: 'rw',
        value: String(value),
      })
    },
    setRt(value) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
        field: 'rt',
        value: String(value),
      })
    },
    setAddressDetail(value) {
      this.$store.commit('imahAingForm/SET_LOKASI_TANAH_FIELD', {
        field: 'address_detail',
        value,
      })
    },
    async validate() {
      return await this.$refs.observer.validate()
    },
  },
}
</script>

<style scoped>
textarea:focus {
  border: 1px solid white;
  outline: none;
  box-shadow: inset 0px 0px 0px 1px #069550, inset 0px 0px 0px 2px #ffc800;
}
</style>
