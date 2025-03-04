<template>
  <section>
    <section class="grid grid-cols-1 gap-x-8 gap-y-6 mb-4">
      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="flex flex-col gap-2 w-full"
        tag="section"
        name="Kota/Kabupaten"
      >
        <label
          for="city"
          class="font-roboto font-medium text-black text-[14px] leading-[20px]"
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
        class="flex flex-col gap-2 w-full"
        tag="section"
        name="Kecamatan"
      >
        <label
          for="subdistrict"
          class="font-roboto font-medium text-black text-[14px] leading-[20px]"
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
          class="font-roboto font-medium text-black text-[14px] leading-[20px]"
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

      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="flex flex-col gap-2"
        name="Lokasi Aduan"
      >
        <label
          for="location"
          class="font-roboto font-medium text-black text-[14px] leading-[20px]"
        >
          Lokasi Aduan <span class="text-red-500">*</span>
        </label>
        <JdsInputText
          id="location"
          v-model="address"
          class="w-full"
          placeholder="Tambah Titik Lokasi Aduan"
          :error-message="errors[0]"
          readonly
        >
          <template #prefix-icon>
            <Icon src="/icons/location-picker.svg" size="15px" />
          </template>
          <template #suffix-icon>
            <svg
              v-if="false"
              class="animate-spin h-5 w-5 text-green-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="#424242"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <button
              v-else
              class="text-green-700 text-sm font-lato font-semibold"
              @click="open = !open"
            >
              Pilih
            </button>
          </template>
        </JdsInputText>
      </ValidationProvider>

      <ValidationProvider class="flex flex-col gap-2" name="Detail Lokasi">
        <label
          for="additionalLocation"
          class="font-roboto font-medium text-black text-[14px] leading-[20px]"
        >
          Detail lokasi tambahan <span class="text-gray-300"> (opsional) </span>
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

    <!-- Pick Location by Google Maps -->
    <BaseModal :show="open" button-label="Pilih Lokasi ini" @close="closeMaps">
      <template #header>
        <div class="w-full flex flex-row justify-between px-7 py-6">
          <h4
            class="font-roboto font-medium text-[21px] leading-[34px] text-green-700"
          >
            Tentukan Pinpoint
          </h4>

          <button
            class="h-10 w-10 bg-white md:flex md:items-center border border-gray-300 justify-center rounded-full hidden"
            tabindex="1"
            aria-label="Tutup Pop Up"
            @click="closeMaps"
          >
            <Icon
              name="times"
              size="22px"
              class="text-gray-800"
              aria-hidden="true"
            />
          </button>
        </div>
      </template>

      <div class="h-full overflow-y-auto min-w-[375px] max-w-[500px]">
        <BaseMap
          :coords="cloneLoc"
          :zoom="16"
          @set:place="getPlaceDetail"
          @dragend:marker="setCoords"
          @click:map="setCoords"
        />

        <div class="py-4 px-6 flex flex-col gap-2">
          <h5 class="text-base font-lato font-semibold">
            {{ clonePlace.name || '-' }}
          </h5>
          <p class="text-sm font-lato text-gray-500">
            {{ clonePlace.address || '-' }}
          </p>
          <p class="text-sm font-lato text-gray-400">
            <span>{{ cloneLoc.lat || '-' }}</span>
            ,
            <span>{{ cloneLoc.lng || '-' }}</span>
          </p>
        </div>
      </div>

      <template #footer>
        <div
          class="bg-gray-100 flex w-full items-center justify-end p-4 z-[100] mt-auto"
        >
          <Button
            type="button"
            class="w-full md:w-auto !justify-center"
            tabindex="-1"
            @click="handleLocation"
          >
            Pilih Lokasi ini
          </Button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      open: false,
      cloneLocation: cloneDeep(
        this.$store.state.citizenComplaintForm.lokasi_aduan
      ),
    }
  },
  computed: {
    ...mapGetters('location', [
      'citiesOption',
      'subDitrictsOption',
      'villagesOption',
    ]),
    getCitiesOption() {
      return this.citiesOption
    },
    getSubDitrictsOption() {
      return this.subDitrictsOption
    },
    getVillagesOption() {
      return this.villagesOption
    },
    // Clone Deep lokasi aduan state
    cloneLoc() {
      return this.cloneLocation.location
    },
    clonePlace() {
      return this.cloneLocation.place
    },
    place() {
      return this.$store.state.citizenComplaintForm.lokasi_aduan.place
    },
    address() {
      return this.$store.state.citizenComplaintForm.lokasi_aduan.place.address
    },
    setValueAddressDetail() {
      return this.$store.state.citizenComplaintForm.lokasi_aduan.address_detail
    },
    setValueCity: {
      get() {
        return this.$store.state.citizenComplaintForm.lokasi_aduan.city_name
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_LOKASI_ADUAN_CITY_NAME',
          value
        )
        this.handleCitySelected()
      },
    },
    setValueSubDistrict: {
      get() {
        return this.$store.state.citizenComplaintForm.lokasi_aduan.district_name
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_LOKASI_ADUAN_DISTRICT_NAME',
          value
        )
        this.handleSubdistrictSelected()
      },
    },
    setValueVillage: {
      get() {
        return this.$store.state.citizenComplaintForm.lokasi_aduan.village_name
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_LOKASI_ADUAN_VILLAGE_NAME',
          value
        )
        this.handleVillageSelected()
      },
    },
  },
  created() {
    this.setCitiesOption('cities')
  },
  mounted() {
    this.setCurrentLocation()
  },
  methods: {
    ...mapActions('location', ['setCitiesOption']),
    ...mapActions('citizenComplaintForm', [
      'handleCitySelected',
      'handleSubdistrictSelected',
      'handleVillageSelected',
      'handleLocationComplaint',
    ]),
    setAddressDetail(value) {
      this.$store.commit(
        'citizenComplaintForm/SET_LOKASI_ADUAN_ADDRESS_DETAIL',
        value
      )
    },
    getPlaceDetail(place) {
      this.cloneLocation.place.name = place.name ?? ''
      this.cloneLocation.place.address = place.formatted_address ?? ''
    },
    setCoords({ position, map, event }) {
      this.cloneLocation.location.lat = event.latLng.lat()
      this.cloneLocation.location.lng = event.latLng.lng()
    },
    handleLocation() {
      this.handleLocationComplaint(this.cloneLocation)
      setTimeout(() => {
        this.closeMaps()
      }, 2000)
    },
    closeMaps() {
      this.open = false
    },
    /**
     *  @function: to get current location if the props coords not defined
     */
    setCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // Success Callback
          (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude

            this.cloneLocation.location.lat = lat
            this.cloneLocation.location.lng = lng
          },
          // Error Callback
          () => {
            // Set default location (Bandung) if user not allowed share the location
            this.cloneLocation.location.lat = -6.9025
            this.cloneLocation.location.lng = 107.6187
          }
        )
      } else {
        throw new Error('Geolocation is not supported by this browser')
      }
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
