<template>
  <div class="h-screen bg-white dark:bg-dark-emphasis-low">
    <div
      class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center"
    >
      <div class="h-full flex justify-center sm:h-auto">
        <div
          class="bg-white w-full h-full p-4 flex flex-col justify-center items-center sm:w-[360px] sm:rounded-lg dark:bg-dark-emphasis-low"
        >
          <div class="flex m-auto">
            <div
              class="flex flex-col gap-[12px] w-full justify-center items-center"
            >
              <BaseIconSvg
                :icon="getIcon(errorMessage)"
                mode="image"
                :height="200"
                :width="200"
              />
              <h3
                class="text-gray-900 text-2xl font-bold font-lora dark:text-dark-text-high text-center"
              >
                {{ getTitleError }}
              </h3>
              <span
                class="text-gray-800 text-sm font-normal font-lato leading-tight dark:text-dark-text-medium text-center"
              >
                {{ getMessageError }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ErrorCustomComponent',
  props: {
    errorMessage: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isDark: false
    }
  },
  mounted () {
    this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  },
  methods: {
    getIcon () {
      switch (this.errorMessage?.statusCode) {
        case 404:
          return this.isDark
            ? '/icon/not-found-dark.svg'
            : '/icon/not-found-light.svg'
        default:
          return this.isDark
            ? '/icon/error-page-dark.svg'
            : '/icon/error-page-light.svg'
      }
    },
    getTitleError () {
      switch (this.errorMessage?.statusCode) {
        case 404:
          return 'Halaman Tidak Ditemukan'
        default:
          return 'Terjadi Gangguan'
      }
    },
    getMessageError () {
      switch (this.errorMessage?.statusCode) {
        case 404:
          return 'Mohon maaf halaman yang ingin Anda tuju tidak dapat kami temukan.'
        default:
          return 'Sedang terjadi gangguan pada sistem, silahkan mencoba kembali dan tunggu beberapa saat.'
      }
    }
  }
}
</script>
