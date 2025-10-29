<template>
  <ContentDetail
    :data-json="dataJson"
    :updated-at="updatedAt"
    :version="version"
  />
</template>
<script>
import dataKebijakanPrivasi from '~/data/kebijakan-privasi.json'
import ContentDetail from '~/components/KebijakanPrivasiKetentuanPengguna/ContentDetail.vue'

export default {
  name: 'KebijakanPrivasi',
  components: { ContentDetail },
  layout: 'DetailKebijakanPrivasiKetentuanPengguna',
  data() {
    return { dataJson: dataKebijakanPrivasi, updatedAt: '', version: '' }
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        'https://n8n.digitalservice.id/webhook/sw-tnc'
      )

      this.updatedAt = data.updated
      this.version = data.version
    } catch (error) {
      console.log(error)
    }
  },
}
</script>
