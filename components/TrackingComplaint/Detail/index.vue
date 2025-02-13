<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex items-center justify-center">
      <div
        class="border-t-transparent border-solid animate-spin rounded-full border-green-600 border-8 h-14 w-14"
      />
    </div>

    <template v-else>
      <TrackingComplaintNoData
        v-if="!complaintData || complaintData.complaint_id === ''"
      />

      <section v-else class="flex flex-col gap-3">
        <!-- Image section -->
        <div class="flex flex-col gap-3">
          <div class="max-w-[900px] max-h-fit self-center">
            <img
              v-if="complaintData.photos.length > 0"
              loading="eager"
              :src="selectedImage"
              width="900"
              height="290"
              class="rounded-lg mx-auto object-cover"
              alt="gambar aduan"
            />
          </div>
          <div class="w-full overflow-x-auto flex flex-row gap-1">
            <button
              v-for="(image, index) in complaintData.photos"
              :key="'gambar' + index"
              @click="selectedImage = image.url"
            >
              <img
                loading="eager"
                :src="image.url"
                width="105"
                height="65"
                class="rounded-md max-w-[105px] max-h-[65px] object-cover"
                :class="{
                  'opacity-50 transition-opacity duration-300':
                    selectedImage === image.url,
                }"
                alt="gambar aduan"
              />
            </button>
          </div>
        </div>

        <hr class="my-3" />

        <div class="flex flex-col gap-1">
          <h3 class="font-lato text-xs text-gray-500">Kategori Aduan</h3>
          <p class="font-lato text-sm text-gray-900">
            {{ complaintData.complaint_category }}
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <h3 class="font-lato text-xs text-gray-500">Permasalahan</h3>
          <p class="font-lato text-sm text-gray-900">
            {{ complaintData.description }}
          </p>
        </div>

        <div class="grid grid-cols-[1fr,60px] gap-3 justify-between">
          <div class="flex flex-col gap-1">
            <h3 class="font-lato text-xs text-gray-500">Lokasi Aduan</h3>
            <p class="font-lato text-sm text-gray-900">
              {{ location.address }}
            </p>
            <p class="font-lato text-xs text-gray-500">
              <span>Lat: {{ complaintData.address.lat }}</span>
              <span>Long: {{ complaintData.address.long }}</span>
            </p>
          </div>
          <button @click="showLocationModal = true">
            <img
              src="/images/see-map.webp"
              width="55"
              height="45"
              alt="gambar lihat peta"
            />
          </button>
        </div>

        <div class="flex flex-col gap-1">
          <h3 class="font-lato text-xs text-gray-500">Detail Lokasi</h3>
          <p class="font-lato text-sm text-gray-900">
            {{ complaintData.address.detail }}
          </p>
        </div>
      </section>
    </template>

    <TrackingComplaintLocationModal
      :is-open="showLocationModal"
      title="Lokasi Aduan"
      @close="showLocationModal = false"
    >
      <div class="space-y-3">
        <BaseMap
          v-if="coordsLocation"
          :coords="coordsLocation"
          :zoom="16"
          @set:place="getPlaceDetail"
        />
      </div>

      <div class="space-y-2 mt-2">
        <h5 class="text-base text-black font-bold">{{ location.name }}</h5>
        <p class="text-sm text-gray-500">
          {{ location.address }}
        </p>
      </div>
    </TrackingComplaintLocationModal>
  </div>
</template>

<script>
export default {
  props: {
    complaintData: {
      type: Object,
      default: () => ({
        complaint_id: '',
        complaint_category: '',
        description: '',
        address: {
          lat: 0,
          long: 0,
          detail: '',
        },
        photos: [],
        complaint_status_id: '',
      }),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedImage: null,
      showLocationModal: false,
      location: {
        name: '',
        address: '',
      },
    }
  },
  computed: {
    coordsLocation() {
      if (
        this.complaintData?.address?.lat &&
        this.complaintData?.address?.long
      ) {
        return {
          lat: this.complaintData.address.lat,
          lng: this.complaintData.address.long,
        }
      }
      return null
    },
  },
  watch: {
    complaintData: {
      immediate: true,
      handler(newData) {
        if (newData && newData.photos && newData.photos.length > 0) {
          this.selectedImage = newData.photos[0].url
        }
      },
    },
  },
  methods: {
    getPlaceDetail(place) {
      this.location.name = place.name ?? ''
      this.location.address = place.formatted_address ?? ''
    },
  },
}
</script>
