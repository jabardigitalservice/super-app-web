<template>
  <div class="h-screen bg-background dark:bg-dark-emphasis-low">
    <div
      class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center"
    >
      <AduanNotFound />
    </div>
  </div>
</template>

<script>
import AduanNotFound from '~/components/Aduan/AduanNotFound.vue'

export default {
  name: 'NotFoundAduanWarga',
  components: { AduanNotFound }
}
</script>
