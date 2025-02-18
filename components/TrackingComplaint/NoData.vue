<template>
  <div
    class="w-full min-h-[500px] flex flex-col gap-6 justify-center items-center"
  >
    <img
      loading="eager"
      src="/images/search-not-found.webp"
      width="80"
      height="80"
      alt="gambar data tidak ditemukan"
    />
    <p class="text-gray-500 text-[16px] leading-[26px] font-lato">
      {{ title }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'TrackingComplaintNoData',
  props: {
    title: {
      type: String,
      default: 'Masukan data ID Aduan untuk melihat detail Aduan',
    },
  },
}
</script>
