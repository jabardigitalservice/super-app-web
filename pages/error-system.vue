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
                :icon="
                  isDark
                    ? '/icon/error-page-dark.svg'
                    : '/icon/error-page-light.svg'
                "
                mode="image"
                :height="200"
                :width="200"
              />
              <h3
                class="text-gray-900 text-2xl font-bold font-lora dark:text-dark-text-high text-center"
              >
                Terjadi Gangguan
              </h3>
              <span
                class="text-gray-800 text-sm font-normal font-lato leading-tight dark:text-dark-text-medium text-center"
              >
                Sedang terjadi gangguan pada sistem, silahkan mencoba kembali
                dan tunggu beberapa saat.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Complaints from '~/components/Complaints'

export default {
  name: 'ErrorSystemPage'
  //   components: { Complaints }
}
</script>
