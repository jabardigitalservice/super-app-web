<template class="bg-white dark:bg-black">
  <div class="lg:pt-[14px] lg:px-[80px] flex justify-center">
    <div class="lg:grid grid-cols-2 max-w-[1280px] gap-x-[100px]">
      <div v-for="content in contents" :key="content.title" class="h-fit">
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
