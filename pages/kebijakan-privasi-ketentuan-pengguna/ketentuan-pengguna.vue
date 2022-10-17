<template>
  <div>
    <ContentDetail :data-json="dataJson" />
  </div>
</template>
<script>
import dataKetentuanPengguna from '~/data/ketentuan-pengguna.json'
import ContentDetail from '~/components/KebijakanPrivasiKetentuanPengguna/ContentDetail.vue'

export default {
  name: 'KebijakanPrivasi',
  components: { ContentDetail },
  layout: 'DetailKebijakanPrivasiKetentuanPengguna',
  data () {
    return { dataJson: dataKetentuanPengguna }
  }
}
</script>
