<template>
  <div class="h-screen bg-background dark:bg-dark-emphasis-low">
    <div
      class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center"
    >
      <Complaints />
    </div>
  </div>
</template>

<script>
import Complaints from '~/components/Complaints'

export default {
  name: 'ComplaintsPage',
  components: { Complaints }
}
</script>
