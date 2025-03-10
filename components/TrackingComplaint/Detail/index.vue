<template>
  <div class="w-full">
    <TrackingComplaintLoading v-show="isLoadingDetail" />

    <section v-show="!isLoadingDetail" class="flex flex-col gap-3">
      <TrackingComplaintNoData
        v-show="!complaintData.complaint_id"
        :title="
          errorMessage
            ? 'Data aduan tidak ditemukan'
            : `Cari aduan terlebih dahulu`
        "
      />

      <div v-show="complaintData.complaint_id">
        <BaseSelectImages
          v-show="imagesArray.length > 0"
          :images-array="imagesArray"
        />

        <hr class="my-3" />

        <div class="flex flex-col gap-y-3">
          <div class="flex flex-col gap-1">
            <h3 class="font-lato text-xs text-gray-500">Judul Aduan</h3>
            <p class="font-lato text-sm text-gray-900">
              {{ complaintData.title || '-' }}
            </p>
          </div>

          <div class="flex flex-col gap-1">
            <h3 class="font-lato text-xs text-gray-500">Kategori Aduan</h3>
            <p class="font-lato text-sm text-gray-900">
              {{ getCategoryName() }}
            </p>
          </div>

          <div v-if="getSubCategoryName() !== ''" class="flex flex-col gap-1">
            <h3 class="font-lato text-xs text-gray-500">Sub Kategori Aduan</h3>
            <p class="font-lato text-sm text-gray-900">
              {{ getSubCategoryName() }}
            </p>
          </div>

          <div class="flex flex-col gap-1">
            <h3 class="font-lato text-xs text-gray-500">Permasalahan</h3>
            <p class="font-lato text-sm text-gray-900">
              {{ complaintData.description || '-' }}
            </p>
          </div>

          <div class="grid grid-cols-[1fr,60px] gap-3 justify-between">
            <div class="flex flex-col gap-1">
              <h3 class="font-lato text-xs text-gray-500">Lokasi Aduan</h3>
              <p class="font-lato text-sm text-gray-900">
                {{ location.address || '-' }}
              </p>
              <p class="font-lato text-xs text-gray-500">
                <span>Lat: {{ complaintData?.address?.lat || '-' }}</span>
                <span>Long: {{ complaintData?.address?.long || '-' }}</span>
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
              {{ complaintData?.address?.detail || '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <TrackingComplaintLocationModal
      :is-open="showLocationModal"
      title="Lokasi Aduan"
      @close="showLocationModal = false"
    >
      <div class="space-y-3">
        <BaseMap
          v-show="coordsLocation"
          :coords="coordsLocation"
          :zoom="16"
          @set:place="getPlaceDetail"
        />
      </div>

      <div class="space-y-2 mt-2">
        <h5 class="text-base text-black font-bold dark:text-dark-emphasis-high">
          {{ location.name || '-' }}
        </h5>
        <p class="text-sm text-gray-500 dark:text-dark-emphasis-high">
          {{ location.address || '-' }}
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
        complaint_sub_category: '',
        description: '',
        address: {
          lat: 0,
          long: 0,
          detail: '',
        },
        photos: [],
        complaint_status_id: '',
        title: '',
        complaint_category_child_name: '',
        complaint_subcategory_child_name: '',
      }),
    },
    isLoadingDetail: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showLocationModal: false,
      location: {
        name: '',
        address: '',
      },
      imagesArray: [],
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
          this.imagesArray = []
          newData.photos.forEach((image) => {
            this.imagesArray.push(image.url)
          })
        }
      },
    },
  },
  methods: {
    getPlaceDetail(place) {
      this.location.name = place.name ?? ''
      this.location.address = place.formatted_address ?? ''
    },
    getCategoryName() {
      const category = this.complaintData?.complaint_category || '-'
      if (this.complaintData?.complaint_category_child_name) {
        return `${category} - ${this.complaintData?.complaint_category_child_name}`
      }
      return category
    },
    getSubCategoryName() {
      let subCategory = ''
      if (this.complaintData?.complaint_sub_category) {
        subCategory = this.complaintData?.complaint_sub_category
        subCategory = subCategory
          .replace(this.complaintData?.complaint_category, ' ')
          .trim()
      }

      if (this.complaintData?.complaint_subcategory_child_name) {
        return `${subCategory} - ${this.complaintData?.complaint_subcategory_child_name}`
      }
      return subCategory
    },
  },
}
</script>
