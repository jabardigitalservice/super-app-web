<template>
  <div
    class="w-full min-h-[300px] md:min-h-[400px] flex flex-col gap-6 justify-center items-center"
  >
    <img
      loading="eager"
      src="/images/search-not-found.webp"
      width="80"
      height="80"
      alt="gambar data tidak ditemukan"
    />
    <p class="text-gray-500 text-[16px] leading-[26px] font-lato text-center">
      {{ title }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ImahAingHistoryNoData',
  props: {
    title: {
      type: String,
      default: 'Belum ada data yang diusulkan',
    },
  },
}
</script>
