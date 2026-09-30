<template>
  <div class="md:py-8 md:px-4">
    <div
      class="md:max-w-[650px] md:mx-auto md:overflow-hidden md:rounded-lg md:border md:border-gray-300 md:bg-white md:dark:border-dark-emphasis-medium md:dark:bg-dark-emphasis-low"
    >
      <h1 class="sr-only">Pembuatan usulan baru Bedah Rumah ditutup</h1>

      <img
        v-for="(image, index) in images"
        :key="image.src"
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :loading="index === 0 ? 'eager' : 'lazy'"
        class="block w-full h-auto"
      />
    </div>
  </div>
</template>

<script>
import { IMAH_AING_CLOSED_IMAGES } from '~/constant/imah-aing-closure'

export default {
  name: 'ImahAingClosed',
  computed: {
    images() {
      return IMAH_AING_CLOSED_IMAGES
    },
  },
}
</script>
