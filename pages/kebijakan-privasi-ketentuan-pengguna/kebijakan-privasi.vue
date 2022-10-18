<template>
  <ContentDetail :data-json="dataJson" />
</template>
<script>
import dataKebijakanPrivasi from '~/data/kebijakan-privasi.json'
import ContentDetail from '~/components/KebijakanPrivasiKetentuanPengguna/ContentDetail.vue'

export default {
  name: 'KebijakanPrivasi',
  components: { ContentDetail },
  layout: 'DetailKebijakanPrivasiKetentuanPengguna',
  data () {
    return { dataJson: dataKebijakanPrivasi }
  }
}
</script>
