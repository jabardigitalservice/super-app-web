<template>
  <BaseButtonCustom
    class="!flex !justify-start bg-[#F9F9F9] text-[12px] font-lato rounded-lg dark:bg-dark-emphasis-medium w-full !px-3 !py-2 mt-2 border-0"
    @click="goToPageFile()"
  >
    <BaseButtonBodyCustom>
      <BaseIconSvg
        icon="/icon/image-and-document.svg"
        class="!w-[14px] !h-[14px]"
        :fill-color="'#757575'"
      />
      <span :class="textClass">Dokumen Bukti</span>
      <span class="ml-auto font-bold text-green-600">Lihat</span>
    </BaseButtonBodyCustom>
  </BaseButtonCustom>
</template>

<script>
import BaseButtonCustom from '~/components/Base/ButtonCustom/Button.vue'
import BaseButtonBodyCustom from '~/components/Base/ButtonCustom/BodyButton.vue'

export default {
  components: {
    BaseButtonCustom,
    BaseButtonBodyCustom
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    textClass () {
      return this.index > 0 ? 'font-medium text-gray-500 dark:text-dark-text-low' : 'font-medium text-gray-900 dark:text-dark-text-high'
    }
  },
  methods: {
    goToPageFile () {
      this.$emit('show-file')
    }
  }
}
</script>
