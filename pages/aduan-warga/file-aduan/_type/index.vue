<template>
  <div class="h-screen sm:h-auto">
    <BaseButtonBack />
    <div class="flex justify-center ">
      <BaseImageSwiper v-if="$route.params.type === 'images'" :src="$store.state.fileAduan" />
      <iframe v-else :src="$store.state.fileAduan" width="100%" height="100%" frameborder="0" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileAduan',
  head () {
    return {
      title: 'Foto Aduan / Dokumen Bukti'
    }
  }
}
</script>
