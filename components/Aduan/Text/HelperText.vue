<template>
  <span
    :class="
      conditionText
        ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
        : 'text-gray-800 dark:text-dark-text-low'
    "
  >{{ text }}</span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    conditionText: {
      type: Boolean,
      default: false
    }
  }
}
</script>
