<template>
  <CardMilestone>
    <TextMilestone>
      <LabelText :text="labelText" :condition-text="index > 0" />

      <span :class="textClass">{{ contentText }}</span>
    </TextMilestone>
  </CardMilestone>
</template>

<script>
import CardMilestone from './CardMilestone.vue'
import TextMilestone from './Text/TextMilestone.vue'
import LabelText from './Text/LabelText.vue'
export default {
  components: {
    TextMilestone,
    CardMilestone,
    LabelText
  },
  props: {
    index: {
      type: Number,
      required: true,
      default: 0
    },
    labelText: {
      type: String,
      required: true,
      default: ''
    },
    contentText: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    textClass () {
      return this.index > 0
        ? 'text-gray-500 dark:text-dark-text-low'
        : 'font-medium text-gray-900 dark:text-dark-text-high'
    }
  }
}
</script>
