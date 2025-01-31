<template>
  <div class="w-full">
    <TrackingComplaintNoData v-show="false" />

    <!-- Detail Complaint -->
    <section class="flex flex-col gap-3">
      <!-- Image -->
      <div class="flex flex-col gap-3">
        <div class="max-w-[900px] max-h-fit self-center">
          <!-- Image Preview -->
          <img
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
            v-for="(image, index) in images"
            :key="'gambar' + index"
            @click="selectedImage = image"
          >
            <img
              loading="eager"
              :src="image"
              width="105"
              height="65"
              class="rounded-md max-w-[105px] max-h-[65px] object-cover"
              :class="{
                'opacity-50 transition-opacity duration-300':
                  selectedImage === image,
              }"
              alt="gambar aduan"
            />
          </button>
        </div>
      </div>

      <hr class="my-3" />

      <div class="flex flex-col gap-1">
        <h3 class="font-lato text-[12px] leading-[18px] text-gray-500">
          Kategori Aduan
        </h3>
        <p class="font-lato text-[14px] leading-[21px] text-gray-900">
          Infrastruktur / Jalan
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="font-lato text-[12px] leading-[18px] text-gray-500">
          Permasalahan
        </h3>
        <p class="font-lato text-[14px] leading-[21px] text-gray-900">
          Saya ingin melaporkan kondisi jalan di depan rumah saya yang saat ini
          mengalami kerusakan berupa lubang-lubang yang cukup dalam. Hal ini
          menjadi perhatian serius karena dapat membahayakan keselamatan
          pengguna jalan, terutama pengendara sepeda motor dan mobil.
        </p>
      </div>

      <div class="grid grid-cols-[1fr,60px] gap-3 justify-between">
        <div class="flex flex-col gap-1">
          <h3 class="font-lato text-[12px] leading-[18px] text-gray-500">
            Lokasi Aduan
          </h3>
          <p class="font-lato text-[14px] leading-[21px] text-gray-900">
            Situ aksan , Sukahaji, Kec. Babakan Ciparay, Kota Bandung, Jawa
            Barat 40221, Indonesia
          </p>
          <p class="font-lato text-[12px] leading-[18px] text-gray-500">
            <span>Lat: -6.816295</span>
            <span>Lang: 107.6177498</span>
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
        <h3 class="font-lato text-[12px] leading-[18px] text-gray-500">
          Lokasi Aduan
        </h3>
        <p class="font-lato text-[14px] leading-[21px] text-gray-900">
          Depan Ruko Merah
        </p>
      </div>
    </section>

    <TrackingComplaintLocationModal
      :is-open="showLocationModal"
      @close="showLocationModal = false"
    />

  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      coords: { lat: -6.816295, lng: 107.6177498 },
      selectedImage: null,
      showLocationModal: false,
      images: [
        'https://randomwordgenerator.com/img/picture-generator/55e1d14b4a5aac14f1dc8460962e33791c3ad6e04e507440752f72d39748c1_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e3d14b4b5aa514f1dc8460962e33791c3ad6e04e507440702d79d39748cd_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/ice-cubes-1914351_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e0d4474354ae14f1dc8460962e33791c3ad6e04e5074417d2e72d1964dc6_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/55e1d14b4a5aac14f1dc8460962e33791c3ad6e04e507440752f72d39748c1_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e3d14b4b5aa514f1dc8460962e33791c3ad6e04e507440702d79d39748cd_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/ice-cubes-1914351_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e0d4474354ae14f1dc8460962e33791c3ad6e04e5074417d2e72d1964dc6_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/55e1d14b4a5aac14f1dc8460962e33791c3ad6e04e507440752f72d39748c1_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e3d14b4b5aa514f1dc8460962e33791c3ad6e04e507440702d79d39748cd_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/55e1d14b4a5aac14f1dc8460962e33791c3ad6e04e507440752f72d39748c1_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e3d14b4b5aa514f1dc8460962e33791c3ad6e04e507440702d79d39748cd_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/ice-cubes-1914351_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e0d4474354ae14f1dc8460962e33791c3ad6e04e5074417d2e72d1964dc6_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/55e1d14b4a5aac14f1dc8460962e33791c3ad6e04e507440752f72d39748c1_640.jpg',
        'https://randomwordgenerator.com/img/picture-generator/57e3d14b4b5aa514f1dc8460962e33791c3ad6e04e507440702d79d39748cd_640.jpg',
      ],
    }
  },
  mounted() {
    // Set the first image as the default preview and update the data after API Contract
    this.selectedImage = this.images[0]
  },
}
</script>
