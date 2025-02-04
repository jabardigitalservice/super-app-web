<template>
  <div>
    <div v-if="loading">Loading...</div>

    <div v-else>
      <Milestone :data-milestone="dataAduan" class="mt-[32px]" />
    </div>
  </div>
</template>

<script>
import Milestone from '~/components/TrackingComplaint/History/Milestone.vue'
export default {
  components: { Milestone },
  props: {
    dataAduan: { type: Array, default: () => [] },

    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
