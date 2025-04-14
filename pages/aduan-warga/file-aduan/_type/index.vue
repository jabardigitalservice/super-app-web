<template>
  <div class="h-full">
    <BaseButtonBack />
    <div class="flex justify-center h-screen">
      <BaseImageSwiper
        v-if="$route.params.type === 'images'"
        :src="$store.state.aduan.fileAduan"
      />
      <iframe
        v-else
        :src="$store.state.aduan.fileAduan"
        width="100%"
        height="100%"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileAduan',
  head() {
    return {
      title: 'Foto Aduan / Dokumen Bukti',
    }
  },
}
</script>
