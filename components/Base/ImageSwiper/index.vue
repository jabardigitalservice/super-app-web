<template>
  <div
    class="bg-white w-full h-full p-4 flex justify-center items-center dark:bg-black"
  >
    <swiper
      class="absolute transition-transform duration-300 transform h-[450px] align-middle"
      :slides-per-view="1"
      :centered-slides="true"
      :mousewheel="{ releaseOnEdges: true }"
      :direction="'horizontal'"
      :pagination="{ clickable: true }"
      @swiper="getSwipperRefHandle"
    >
      <swiper-slide v-for="(item, index) in src" :key="index">
        <img
          :alt="`Foto Aduan - ${index}`"
          :src="item"
          class="h-full w-[600px]"
        >
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Navigation, Pagination, Autoplay } from 'swiper'
import { SwiperCore, Swiper, SwiperSlide } from 'swiper-vue2'
import 'swiper/swiper-bundle.css'

SwiperCore.use([Navigation, Pagination, Autoplay])
export default {
  name: 'BaseImageSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    src: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      swiperRef: null
    }
  },

  methods: {
    getSwipperRefHandle (swiper) {
      this.swiperRef = swiper
    }
  }
}
</script>

<style scoped>
.swiper-container {
  width: 100%;
}
.swiper-slide {
  @apply flex justify-center
}
</style>
