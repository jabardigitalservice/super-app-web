<template>
  <div
    v-show="showPopup"
    class="absolute w-full h-full top-0 bg-black opacity-60"
  />
</template>

<script>
export default {
  name: 'BaseBlurPopup',
  props: {
    showPopup: {
      type: Boolean,
      default: false
    }
  }
}
</script>
