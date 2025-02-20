<template>
  <div class="flex flex-col gap-3">
    <div class="max-w-[900px] max-h-fit self-center">
      <img
        loading="eager"
        :src="imagesArray[activeIndex]"
        width="900"
        height="290"
        class="rounded-lg mx-auto object-cover"
        alt="gambar aduan"
      />
    </div>
    <div class="w-full overflow-x-auto flex flex-row gap-1">
      <button
        v-for="(image, index) in imagesArray"
        :key="'gambar' + index"
        @click="activeIndex = index"
      >
        <img
          loading="eager"
          :src="image"
          width="105"
          height="65"
          class="rounded-md max-w-[105px] max-h-[65px] object-cover"
          :class="{
            'opacity-50 transition-opacity duration-300': activeIndex === index,
          }"
          alt="gambar aduan"
        />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imagesArray: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: 0,
    }
  },
}
</script>
