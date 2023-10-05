<template>
  <BaseButtonCustom
    class="!flex !justify-start text-[12px] font-lato rounded-lg w-full !px-3 !py-2 mt-2 border-0"
    @click="goToPage"
  >
    <BaseButtonBodyCustom class="grid grid-cols-2 mt-3 items-center">
      <slot />

      <div class="ml-auto font-bold text-green-600">
        Lihat
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
  methods: {
    goToPage () {
      this.$emit('go-to-page')
    }
  }
}
</script>

<style>

</style>
