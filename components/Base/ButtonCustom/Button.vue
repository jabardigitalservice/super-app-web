<template>
  <button
    ref="base-button-custom"
    v-bind="$attrs"
    class="px-4 py-3 rounded-lg whitespace-nowrap font-bold disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButtonCustom'
}
</script>
