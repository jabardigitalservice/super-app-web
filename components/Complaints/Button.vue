<template>
  <BaseButton class="rounded-lg border-2 border-gray-400" :href="config.linkApps.android">
    <BaseIconSvg
      :icon="`/icon/${icon}.svg`"
      mode="image"
      class="!w-[24px] !h-[24px]"
    />
    <span
      class="text-[14px] font-bold font-lato leading-[20px] text-gray-800 dark:text-dark-text-medium"
    >{{ textButton }}</span>
  </BaseButton>
</template>

<script>
export default {
  name: 'ComplaintsButton',
  props: {
    icon: {
      type: String,
      default: ''
    },
    textButton: {
      type: String,
      default: ''
    }
  }
}
</script>

<style></style>
