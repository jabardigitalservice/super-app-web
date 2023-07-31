<template>
  <span
    :class="
      conditionText
        ? 'text-gray-500 dark:text-dark-text-low'
        : 'font-semibold text-gray-800 dark:text-dark-text-high'
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
