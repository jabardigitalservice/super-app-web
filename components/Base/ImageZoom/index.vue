<template>
  <div
    class="relative bg-white w-full h-full p-4 flex flex-col justify-center items-center dark:bg-black gap-[22px] mt-auto"
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
      <swiper-slide v-for="(item, index) in testLooping" :key="index">
        <img
          :src="src"
          :style="computedZoomStyles(index)"
          class="h-full w-auto"
        >
      </swiper-slide>
    </swiper>

    <div
      class="absolute bottom-8 mx-auto flex flex-row py-[7px] px-[12px] gap-[24px] bg-green-600 rounded-[38px] shadow-md"
    >
      <button
        class="text-green-300 flex justify-center items-center"
        :disabled="currentZoomLevel <= 1"
        @click="zoomOut"
      >
        <BaseIconSvg
          icon="/icon/zoom-out.svg"
          class="!shadow-lg !w-[32px] !h-[32px]"
          :fill-color="currentZoomLevel > 1 ? '#FFFFFF' : '#70CD94'"
        />
      </button>
      <div class="absolute left-1/2 -ml-0.5 h-[32px] w-[1px] bg-green-500" />
      <button
        class="text-white flex justify-center items-center"
        :disabled="currentZoomLevel >= 3"
        @click="zoomIn"
      >
        <BaseIconSvg
          icon="/icon/zoom-in.svg"
          class="!shadow-lg !w-[32px] !h-[32px]"
          :fill-color="currentZoomLevel >= 3 ? '#70CD94' : '#FFFFFF'"
        />
      </button>
    </div>
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
      testLooping: [1, 1],
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
    this.zoomLevels = this.testLooping.map(() => 1)
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
      this.zoomLevels = this.testLooping.map(() => 1)
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
