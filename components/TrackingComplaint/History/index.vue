<template>
  <div>
    <div v-if="loading">Loading...</div>

    <div v-else>
      <MilestoneNew :data-milestone="exampleData.data" class="mt-[32px]" />
    </div>
  </div>
</template>

<script>
import MilestoneNew from '~/components/TrackingComplaint/History/MilestoneNew.vue'
import { exampleData } from '~/constant/mock-api-aduan'

export default {
  components: { MilestoneNew },
  props: {
    dataAduan: { type: Array, default: () => [] },

    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      exampleData,
    }
  },
}
</script>
