<template>
  <div class="h-screen bg-white dark:bg-dark-emphasis-low">
    <div class="h-full flex flex-col justify-center items-center gap-3 p-4 text-center">
      <!-- class dark:hidden harus di wrapper: inline style display BaseIconSvg menimpanya -->
      <div class="dark:hidden">
        <BaseIconSvg
          icon="/icon/not-found-light.svg"
          mode="image"
          :height="200"
          :width="200"
        />
      </div>
      <div class="hidden dark:block">
        <BaseIconSvg
          icon="/icon/not-found-dark.svg"
          mode="image"
          :height="200"
          :width="200"
        />
      </div>
      <h3 class="text-gray-900 text-2xl font-bold font-lora dark:text-dark-text-high">
        Akses Tidak Valid
      </h3>
      <p class="text-gray-800 text-sm font-lato dark:text-dark-text-medium">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import { IMAH_AING_INVALID_ACCESS_MESSAGE } from '~/constant/imah-aing-closure'

export default {
  name: 'ImahAingInvalidAccess',
  computed: {
    message() {
      return IMAH_AING_INVALID_ACCESS_MESSAGE
    },
  },
}
</script>
