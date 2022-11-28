<template class="bg-white dark:bg-black">
  <div class="flex justify-center">
    <div class="border-gray-100 lg:pt-[14px] lg:px-[80px]">
      <div class="lg:grid grid-flow-col auto-cols-auto max-w-[1280px] gap-x-[100px]">
        <div v-for="content in contents" :key="content.title" class="border-b border-gray-100 dark:border-[#292C2A] lg:dark:border-0 mb-[24px]">
          <Menu
            :icon="content.icon"
            :title="content.title"
            :description="content.description"
            :link="content.link"
          />
        </div>
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
