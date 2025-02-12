<template>
  <div
    class="border-t-transparent border-solid animate-spin rounded-full border-green-600 border-8"
    :style="`width: ${width}; height: ${height}`"
  />
</template>

<script>
export default {
  name: 'BaseSpinner',
  props: {
    height: {
      type: String,
      default: '56px',
    },
    width: {
      type: String,
      default: '56px',
    },
  },
}
</script>
