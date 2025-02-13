<template>
  <BaseModal :is-open="isOpen" @close="closeModal">
    <template #header>
      <h4 class="font-bold text-[21px] leading-[34px] text-green-700">
        {{ title }}
      </h4>
    </template>

    <template #content>
      <slot />
    </template>

    <!-- TODO: USED THIS BUTTON IF FORM ADUAN READY -->
    <!-- <template #footer>
      <BaseButton
        class="text-sm font-bold text-white mr-2 dark:border-0 bg-green-700 hover:bg-green-600 ml-auto"
        @click="selectLocation"
      >
        Pilih Lokasi ini
      </BaseButton>
    </template> -->
  </BaseModal>
</template>

<script>
export default {
  name: 'LocationModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    selectLocation() {
      // Handle location selection
      this.$emit('select')
      this.closeModal()
    },
  },
}
</script>
