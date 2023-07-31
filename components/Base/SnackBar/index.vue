<template>
  <div v-show="showPopup" class="absolute w-full h-fit rounded-lg bg-red-400">
    <div class="py-3 px-4 text-white text-[14px]">
      <slot name="snackbar-button-left" />
      <slot />
      <slot name="snackbar-button-right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSnackBar',
  props: {
    showPopup: {
      type: Boolean,
      default: false
    }
  }
}
</script>
