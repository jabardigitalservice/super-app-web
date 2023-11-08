<template>
  <div class="h-full flex justify-center sm:h-auto">
    <div
      class="bg-white w-full h-full p-4 flex flex-col justify-center items-center sm:w-[360px] sm:h-[515px] sm:rounded-lg dark:bg-dark-emphasis-low"
    >
      <div class="flex justify-center items-center m-auto">
        <BaseIconSvg
          :icon="
            isDark
              ? '/icon/hand-used-phone-dark.svg'
              : '/icon/hand-used-phone-light.svg'
          "
          mode="image"
          :height="200"
          :width="200"
        />
      </div>
      <div class="flex flex-col gap-[22px] w-full mt-12">
        <h3
          class="text-gray-900 text-2xl font-bold font-lora dark:text-dark-text-high"
        >
          Anda Belum Mengunduh Sapawarga!
        </h3>
        <span
          class="text-gray-800 text-sm font-normal font-lato leading-tight dark:text-dark-text-medium"
        >
          Untuk dapat meilhat detail aduan ini, anda perlu mengunduh aplikasi
          Sapawarga.
        </span>

        <div
          class="w-full h-16 px-4 py-3 bg-gray-50 rounded-lg justify-start items-center gap-4 inline-flex dark:bg-dark-emphasis-medium"
        >
          <div class="justify-start items-end gap-2 flex">
            <div class="flex-col justify-start items-start gap-1 inline-flex">
              <h5
                class="text-gray-700 text-xs font-normal font-lato leading-none dark:text-dark-text-low"
              >
                No. Aduan
              </h5>
              <h3
                class="text-gray-900 text-sm font-normal font-lato leading-tight dark:text-dark-text-high"
              >
                {{ $route.query.noAduan || "-" }}
              </h3>
            </div>
          </div>
        </div>

        <template v-for="(item, index) in buttonLink">
          <ComplaintsButton
            :key="index"
            :icon="item.icon"
            :text-button="item.textButton"
            :link="item.link"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplaintsComponents',
  data () {
    return {
      isDark: false,
      buttonLink: [],
      linkPlayStore: [
        {
          icon: 'playstore',
          textButton: 'Unduh Melalui Playstore',
          link: 'market://details?id=com.sapawarga.jds'
        }
      ],
      linkAppStore: [
        {
          icon: 'apple-app-store',
          textButton: 'Unduh Melalui App Store',
          link: 'itms-apps://itunes.apple.com/app/id6443805562'
        }
      ],
      linkDesktop: [
        {
          icon: 'playstore',
          textButton: 'Unduh Melalui Playstore',
          link: 'https://play.google.com/store/apps/details?id=com.sapawarga.jds&hl=id-ID'
        },
        {
          icon: 'apple-app-store',
          textButton: 'Unduh Melalui App Store',
          link: 'https://apps.apple.com/us/app/sapawarga-jabar-super-apps/id6443805562'
        }
      ]
    }
  },
  mounted () {
    this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const getTypeDeviceUser = navigator.userAgent

    if (/Android/.test(getTypeDeviceUser)) {
      this.buttonLink = this.linkPlayStore
    } else if (/iPhone|iPad|iPod/.test(getTypeDeviceUser)) {
      this.buttonLink = this.linkAppStore
    } else {
      this.buttonLink = this.linkDesktop
    }
  }
}
</script>
