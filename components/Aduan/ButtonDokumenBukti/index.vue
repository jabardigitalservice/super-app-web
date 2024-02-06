<template>
  <BaseButtonCustom
    class="!flex !justify-start text-[12px] font-lato rounded-lg w-full !px-3 !py-2 mt-2 border-0"
    @click="goToPage"
  >
    <BaseButtonBodyCustom class="grid grid-cols-2 mt-3 items-center">
      <slot />

      <div class="ml-auto font-bold text-green-600">
        {{ getTextButton }}
      </div>
    </BaseButtonBodyCustom>
  </BaseButtonCustom>
</template>

<script>
import BaseButtonCustom from '~/components/Base/ButtonCustom/Button.vue'
import BaseButtonBodyCustom from '~/components/Base/ButtonCustom/BodyButton.vue'
export default {
  name: 'ButtonDokumenBukti',
  components: {
    BaseButtonCustom,
    BaseButtonBodyCustom
  },
  props: {
    typeFile: {
      type: String,
      default: ''
    }
  },
  computed: {
    getTextButton () {
      switch (this.typeFile) {
        case 'file':
          return 'Unduh'
        case 'image':
          return 'Lihat'
        case 'youtube':
          return 'Buka'
        default:
          return ''
      }
    }
  },
  methods: {
    goToPage () {
      this.$emit('go-to-page')
    }
  }
}
</script>

<style>

</style>
