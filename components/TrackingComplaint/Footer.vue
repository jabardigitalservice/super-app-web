<template>
  <div class="flex flex-col gap-2">
    <h3 class="font-lato text-sm font-medium text-black">Laporan Aduan</h3>
    <div class="flex flex-col gap-2 md:flex-row md:justify-between">
      <p class="font-lato text-[12px] leading-[18px] text-gray-500">
        Diadukan pada: <span> {{ createdAt }} </span>
      </p>
      <p class="font-lato text-[12px] leading-[18px] text-gray-500">
        Update Terbaru: <span> {{ updatedAt }} </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    updatedAt: {
      type: String,
      default: '',
    },
    createdAt: {
      type: String,
      default: '',
    },
  },
}
</script>
