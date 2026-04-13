<template>
  <div class="flex flex-row gap-1 items-center">
    <BaseIconSvg
      icon="/icon/tracking-aduan.svg"
      :width="51"
      :height="51"
      mode="image"
    />
    <div>
      <h2
        class="font-lato text-sm font-medium text-black dark:text-dark-emphasis-high"
      >
        Tracking Aduan
      </h2>
      <p class="text-sm font-lato text-green-700">{{ idAduan }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    idAduan: {
      type: String,
      default: '-',
    },
  },
}
</script>
