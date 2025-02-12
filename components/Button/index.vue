<template>
  <JdsButton
    :variant="variant"
    :type="type"
    class="flex justify-between"
    v-on="$listeners"
  >
    <BaseLoading v-if="loading" width="16px" height="16px" />
    <slot />
  </JdsButton>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: false,
      default: 'primary',
    },
    type: {
      type: String,
      required: false,
      default: 'button',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped>
/**
 *  TODO: This is a temporary solution, remove this if it has been implemented in jabar design system
 */
button {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
}
</style>
