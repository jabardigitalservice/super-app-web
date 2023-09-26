<template>
  <div
    class="bg-white w-full h-full p-4 flex justify-center items-center dark:bg-black mt-auto"
  >
    <swiper
      class="absolute transition-transform duration-300 transform h-[450px] align-middle"
      :slides-per-view="2"
      :space-between="10"
      :centered-slides="true"
      observer
      observe-parents
      @swiper="getSwipperRefHandle"
      @slideChange="updateZoomLevel"
    >
      <swiper-slide v-for="(item, index) in loopingDummy" :key="index">
        <img
          :alt="`Foto Aduan - ${index}`"
          :src="src"
          :style="computedZoomStyles(index)"
          class="h-full w-auto"
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
      zoomLevel: 1,
      swiperRef: null,
      loopingDummy: [1, 1],
      zoomLevels: []
    }
  },
  computed: {
    currentZoomLevel () {
      const activeIndex = this.swiperRef ? this.swiperRef.activeIndex : 0
      return this.zoomLevels[activeIndex]
    }
  },
  mounted () {
    this.zoomLevels = this.loopingDummy.map(() => 1)
  },
  methods: {
    computedZoomStyles (index) {
      return {
        transform: `scale(${this.zoomLevels[index]})`
      }
    },
    zoomIn () {
      const activeIndex = this.swiperRef.activeIndex
      if (this.zoomLevels[activeIndex] <= 3) {
        this.$set(
          this.zoomLevels,
          activeIndex,
          this.zoomLevels[activeIndex] + 0.1
        )
      }
    },
    zoomOut () {
      const activeIndex = this.swiperRef.activeIndex
      if (this.zoomLevels[activeIndex] > 0.2) {
        this.$set(
          this.zoomLevels,
          activeIndex,
          this.zoomLevels[activeIndex] - 0.1
        )
      }
    },

    getSwipperRefHandle (swiper) {
      this.swiperRef = swiper
    },
    updateZoomLevel () {
      this.zoomLevels = this.loopingDummy.map(() => 1)
    }
  }
}
</script>

<style scoped>
.swiper-container {
  width: 100%;
}
.swiper-slide {
  text-align: center;
  width: 250px;
}
</style>
