<template>
  <BaseButton class="border-green-700 hover:bg-green-50 mt-2 !py-2">
    <BaseIconSvg
      icon="/icon/image-and-document.svg"
      class="!w-[14px] !h-[14px]"
      :fill-color="'#039550'"
    />
    <span class="text-green-700 text-sm font-bold"> Dokumen Bukti </span>
  </BaseButton>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  methods: {
    goToPageFile() {
      this.$emit('show-file')
    },
  },
}
</script>
