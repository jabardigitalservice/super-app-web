<template>
  <div
    class="relative bg-white w-full h-full p-4 flex flex-col justify-center items-center sm:w-[360px] sm:h-[515px] sm:rounded-lg dark:bg-black gap-[22px] mt-auto"
  >
    <swiper
      class="absolute transition-transform duration-300 transform  max-w-full h-auto align-middle "
      :slides-per-view="2"
      :space-between="30"
      :centered-slides="true"
      observer
      observe-parents
      @swiper="getSwipperRefHandle"
    >
      <!-- <swiper-slide v-for="(item,index) in listPhoto" :key="index">
        <img :src="item.url" alt="photo" :class="{'opacity-20':index!==swiperRef.activeIndex}">

        <img
          :src="src"
          :style="zoomStyles"
          class="absolute transition-transform duration-300 transform shadow rounded max-w-full h-auto align-middle border-none"
        >

        <img
          :src="src"
          :style="zoomStyles"
          class="absolute transition-transform duration-300 transform shadow rounded max-w-full h-auto align-middle border-none"
        >
      </swiper-slide>
    </swiper> -->

      <swiper-slide>
        <img
          :src="src"
          :style="zoomStyles"
        >
      </swiper-slide>

      <swiper-slide>
        <img
          :src="src"
          :style="zoomStyles"
        >
      </swiper-slide>
    </swiper>

    <div
      class="absolute bottom-8 mx-auto flex flex-row py-[7px] px-[12px] gap-[24px] bg-green-600 rounded-[38px] shadow-md"
    >
      <button
        class="text-green-300 flex justify-center items-center"
        :disabled="zoomLevel === 1"
        @click="zoomOut"
      >
        <BaseIconSvg
          icon="/icon/zoom-out.svg"
          class="!shadow-lg !w-[32px] !h-[32px]"
          :fill-color="zoomLevel > 1 ? '#FFFFFF' : '#70CD94'"
        />
      </button>
      <div class="absolute left-1/2 -ml-0.5 h-[32px] w-[1px] bg-green-500" />
      <button
        class="text-white flex justify-center items-center"
        @click="zoomIn"
      >
        <BaseIconSvg
          icon="/icon/zoom-in.svg"
          class="!shadow-lg !w-[32px] !h-[32px]"
          fill-color="#FFFFFF"
        />
      </button>
    </div>
    </swiper>
  </div>
</template>

<script>
import { Navigation, Pagination, Autoplay } from 'swiper'
import { SwiperCore, Swiper, SwiperSlide } from 'swiper-vue2'
import 'swiper/swiper-bundle.css'

SwiperCore.use([Navigation, Pagination, Autoplay])
export default {
  name: 'BaseImageZoom',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    src: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      zoomLevel: 1
    }
  },

  computed: {
    zoomStyles () {
      return {
        transform: `scale(${this.zoomLevel})`
      }
    }
  },

  methods: {
    zoomIn () {
      console.log(this.zoomLevel, 'zoom in')
      this.zoomLevel += 0.1 // Anda bisa menyesuaikan nilai ini sesuai kebutuhan
    },
    zoomOut () {
      console.log(this.zoomLevel, 'zoom out')
      if (this.zoomLevel > 0.2) {
        // batasi zoom out agar gambar tidak terlalu kecil
        this.zoomLevel -= 0.1 // Anda bisa menyesuaikan nilai ini sesuai kebutuhan
      }
    },
    getSwipperRefHandle (swiper) {
      this.swiperRef = swiper
    },
    buttonSwipperHandle (pathButton) {
      // if (this.swiperRef.activeIndex < this.listPhoto.length) {
      //   if (pathButton === 'next') {
      //     this.swiperRef.slideTo(this.swiperRef.activeIndex + 1)
      //   } else {
      //     this.swiperRef.slideTo(this.swiperRef.activeIndex - 1)
      //   }
      // }
    }
  }
}
</script>

<style scoped>
.swiper-container{
  width: 100%;
}
 .swiper-slide {
  text-align: center;
  width: auto;
}

.slide-image {
  height: 400px;
  width: auto;
}
</style>
