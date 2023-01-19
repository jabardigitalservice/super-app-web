<template>
  <div class="flex flex-row gap-2 p-2 rounded-lg bg-[#F9FBFC] border-[#EFF1F3] dark:bg-dark-emphasis-medium dark:border-dark-emphasis-medium">
    <IconInfo v-if="type === 'info'" class="stroke-green-600" />
    <div class="text-xs">
      <p class="text-gray-800 dark:text-dark-text-medium">
        {{ text }}
      </p>
      <slot name="footer-text" />
    </div>
  </div>
</template>

<script>
import IconInfo from '~/assets/icon/info-circle.svg?inline'

export default {
  name: 'BaseSectionMessage',
  components: {
    IconInfo
  },
  props: {
    /**
     * type of section message
     */
    type: {
      type: String,
      default: ''
    },
    /**
     * the text content
     */
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
