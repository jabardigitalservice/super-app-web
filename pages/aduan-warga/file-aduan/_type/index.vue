<template>
  <div class="h-full flex justify-center sm:h-auto">
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
  },
  methods: {
    zoomIn () {
      console.log('zoom in')
    },
    zoomOut () {
      console.log('zoom out')
    }
  }
}
</script>
