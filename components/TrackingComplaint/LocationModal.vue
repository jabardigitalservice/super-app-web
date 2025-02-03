<template>
  <BaseModal :is-open="isOpen" @close="closeModal">
    <template #header>
      <h4 class="font-bold text-[21px] leading-[34px] text-green-700">
        Tentukan Pinpoint
      </h4>
    </template>

    <template #content>
      <div class="space-y-3">
        <!-- TODO: ADD MAP -->
      </div>

      <div class="space-y-2">
        <h5 class="text-base text-black font-bold">Situ Aksan</h5>
        <p class="text-sm text-gray-500">
          Sukahaji, Kec. Babakan Ciparay, Kota Bandung, Jawa Barat 40221,
          Indonesia
        </p>
      </div>
    </template>

    <template #footer>
      <BaseButton
        class="text-sm font-bold text-white mr-2 dark:border-0 bg-green-700 hover:bg-green-600 ml-auto"
        @click="selectLocation"
      >
        Pilih Lokasi ini
      </BaseButton>
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
