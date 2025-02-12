<template>
  <div
    v-if="showSpinner"
    class="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2"
  >
    <BaseLoading />
  </div>
</template>

<script>
export default {
  name: 'BaseSpinner',
  props: {
    showSpinner: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
