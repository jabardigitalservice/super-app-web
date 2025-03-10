<template>
  <transition name="modal">
    <div v-show="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-dark-emphasis-low"
          :style="{ width: modalWidth, height: modalHeight }"
        >
          <div
            class="flex items-center justify-between border-b border-gray-200 px-6 py-2 dark:border-dark-emphasis-medium"
          >
            <slot name="header" />

            <BaseButton
              v-if="withCloseButton"
              class="!rounded-full !w-[44px] !h-[44px] border-0 mb-4 ml-auto hover:bg-gray-100 dark:border-dark-emphasis-medium dark:hover:bg-dark-emphasis-medium"
              @click="close"
            >
              <BaseIconSvg
                :icon="`/icon/close-button.svg`"
                class="!bg-black dark:!bg-white"
              />
            </BaseButton>
          </div>

          <div class="px-6 py-4 overflow-y-auto">
            <slot name="content" />
          </div>

          <div
            v-if="$slots.footer"
            class="border-t border-gray-200 px-6 py-2 dark:border-dark-emphasis-medium"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '600px',
    },
    height: {
      type: String,
      default: 'auto',
    },
    withCloseButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    modalWidth() {
      return this.width
    },
    modalHeight() {
      return this.height
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>
