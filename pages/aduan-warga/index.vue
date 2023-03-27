<template>
  <div class="h-screen bg-background dark:bg-dark-emphasis-low">
    <div
      class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center"
    >
      <Aduan />
    </div>
  </div>
</template>

<script>
import Aduan from '~/components/Aduan'

export default {
  name: 'AduanWarga',
  components: { Aduan }
}
</script>
