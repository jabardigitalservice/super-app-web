<template>
  <div class="h-full flex justify-center sm:h-auto">
    <div
      class="bg-white w-full h-full p-4 flex flex-col justify-center items-center sm:w-[360px] sm:h-[515px] sm:rounded-lg dark:bg-black"
    >
      <div
        class="flex justify-center items-center bg-gray-100 w-[120px] h-[120px] rounded-full m-auto dark:bg-dark-emphasis-medium"
      >
        <ImageLoudSpeaker />
      </div>
      <div>
        <span class="font-medium text-gray-900 dark:text-dark-text-high">Aduan Tidak Ditemukan!</span>
      </div>
      <div class="flex flex-col mt-auto w-full">
        <NuxtLink to="/aduan-warga/redirect-aduan" class="w-full">
          <BaseButton
            class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 dark:border-0"
          >
            Buat Aduan Baru
          </BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import ImageLoudSpeaker from '~/assets/images/loudspeaker.svg?inline'
export default {
  name: 'AduanNotFound',
  components: {
    ImageLoudSpeaker
  }
}
</script>

<style></style>
