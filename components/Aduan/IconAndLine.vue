<template>
  <div class="flex flex-col items-center mr-4">
    <div
      class="flex items-center justify-center border dark:border-dark-emphasis-medium w-[26px] h-[26px] bg-gray-50 rounded-lg dark:bg-dark-emphasis-medium"
    >
      <BaseIconSvg
        :icon="icon"
        class="!shadow-lg !w-[14px] !h-[14px]"
        :fill-color="fillColor"
      />
    </div>

    <div
      v-if="lineMilestone"
      class="w-px h-full bg-gray-300 dark:bg-dark-emphasis-medium"
    />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    fillColor: {
      type: String,
      default: ''
    },
    lineMilestone: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
