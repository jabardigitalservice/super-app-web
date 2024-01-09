<template>
  <ErrorCustom :error-message="error" />
</template>

<script>
export default {
  name: 'ErrorSystemPage',
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
