<template>
  <BaseModal :is-open="isOpen" with-close-button @close="closeModal">
    <template #header>
      <h4 class="font-bold text-[21px] leading-[34px] text-green-700">
        {{ title }}
      </h4>
    </template>

    <template #content>
      <slot />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
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
