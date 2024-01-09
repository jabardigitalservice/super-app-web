<template>
  <div class="h-screen flex justify-center sm:h-auto">
    <BaseImageSwiper v-if="$route.params.type === 'images'" :src="$store.state.fileAduan" />
    <iframe v-else :src="$store.state.fileAduan" width="100%" height="100%" frameborder="0" />
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
