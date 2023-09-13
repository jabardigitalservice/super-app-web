<template>
  <div class="h-screen flex justify-center sm:h-auto">
    <BaseImageZoom :src="$store.state.fileAduan" />
  </div>
</template>

<script>
export default {
  name: 'FileAduan',
  head () {
    return {
      title: this.$route.params.type.replace('-', ' ').toUpperCase()
    }
  }
}
</script>
