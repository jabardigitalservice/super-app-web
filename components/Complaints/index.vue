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
      <div class="flex flex-col gap-[22px] mt-auto">
        <h3 class="text-gray-900 text-2xl font-bold font-lora">
          Anda Belum Mengunduh Sapawarga!
        </h3>
        <span class="text-gray-800 text-sm font-normal font-lato leading-tight">
          Untuk dapat meilhat detail aduan ini, anda perlu mengunduh aplikasi
          Sapawarga.
        </span>

        <div
          class="w-80 h-16 px-4 py-3 bg-gray-50 rounded-lg justify-start items-center gap-4 inline-flex"
        >
          <div class="justify-start items-end gap-2 flex">
            <div class="flex-col justify-start items-start gap-1 inline-flex">
              <h5
                class="text-gray-700 text-xs font-normal font-lato leading-none"
              >
                No. Aduan
              </h5>
              <h3
                class="text-gray-900 text-sm font-normal font-lato leading-tight"
              >
                {{ $route.query.noAduan }}
              </h3>
            </div>
          </div>
        </div>

        <BaseButton class="mb-2 rounded-lg border-2 border-gray-400 bg-white">
          <BaseIconSvg
            icon="/icon/playstore.svg"
            mode="image"
            class="!shadow-lg !w-[14px] !h-[14px]"
          />
          <span class="text-[14px] font-bold font-lato leading-[20px]">Unduh Melalui Playstore</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import ImageLoudSpeaker from '~/assets/images/loudspeaker.svg?inline'
// import IconLoudSpeaker from '~/assets/icon/loud-speaker.svg?inline'
export default {
  name: 'ComplaintsComponents',
  components: {
    ImageLoudSpeaker
    // IconLoudSpeaker
  }
}
</script>
