<template>
  <button
    ref="base-button"
    v-bind="$attrs"
    class="px-4 py-3 flex items-center rounded-lg border whitespace-nowrap font-bold disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-300"
    v-on="$listeners"
  >
    <div class="flex  items-center gap-3 w-full" :class="errorButtonMessage ? 'justify-between' : 'justify-center'">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />

      <span v-if="errorButtonMessage">
        {{ errorButtonMessage }}
      </span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    errorButtonMessage: {
      type: String,
      default: ''
    }
  }
}
</script>
