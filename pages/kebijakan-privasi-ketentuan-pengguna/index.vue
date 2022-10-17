<template class="bg-white dark:bg-black">
  <div class="container mx-auto">
    <div class="lg:grid grid-cols-2 mt-10">
      <div v-for="content in contents" :key="content.title">
        <Menu
          :icon="content.icon"
          :title="content.title"
          :description="content.description"
          :link="content.link"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dataMenuKebijakanPrivasiKetentuanPengguna from '~/data/menu-kebijakan-privasi-ketentuan-pengguna.json'
import Menu from '~/components/KebijakanPrivasiKetentuanPengguna/Menu.vue'
export default {
  name: 'LayoutKebijakanPrivasiKetentuanPengguna',
  components: { Menu },
  data () {
    return {
      contents: dataMenuKebijakanPrivasiKetentuanPengguna
    }
  }
}
</script>
