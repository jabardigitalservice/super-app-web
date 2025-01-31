<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="close"
      />

      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
        >
          <div
            class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
          >
            <h3 class="text-xl font-semibold text-gray-900">
              <slot name="header">Modal Title</slot>
            </h3>


            <BaseButton
              class="!rounded-full !w-[44px] !h-[44px] border-0 mb-4 ml-auto hover:bg-gray-100"
              @click="close"
            >
              <BaseIconSvg :icon="`/icon/close-button.svg`" class="!bg-black" />
            </BaseButton>
          </div>

          <div class="px-6 py-4">
            <slot name="content">Modal content goes here</slot>
          </div>

          <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4">
            <slot name="footer"></slot>
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
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
