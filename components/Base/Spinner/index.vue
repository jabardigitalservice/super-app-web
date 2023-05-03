<template>
  <div v-if="showSpinner" class="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
    <div class="border-t-transparent border-solid animate-spin  rounded-full border-green-600 border-8 h-14 w-14" />
  </div>
</template>

<script>
export default {
  name: 'BaseSpinner',
  props: {
    showSpinner: {
      type: Boolean,
      default: true
    }
  }
}
</script>
