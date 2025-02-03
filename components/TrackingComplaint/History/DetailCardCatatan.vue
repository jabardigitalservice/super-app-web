<template>
  <CardMilestone class="mt-2">
    <TextMilestone>
      <LabelText>
        {{ labelText }}
      </LabelText>

      <DetailText>
        {{ contentText }}
      </DetailText>
    </TextMilestone>
  </CardMilestone>
</template>

<script>
import CardMilestone from './CardMilestone.vue'
import DetailText from './Text'
import LabelText from './Text/LabelText.vue'
import TextMilestone from './Text/TextMilestone.vue'
export default {
  components: {
    TextMilestone,
    CardMilestone,
    LabelText,
    DetailText,
  },
  props: {
    labelText: {
      type: String,
      required: true,
      default: '',
    },
    contentText: {
      type: String,
      required: true,
      default: '',
    },
  },
}
</script>
