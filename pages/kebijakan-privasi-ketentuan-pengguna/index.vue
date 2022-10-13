<template class="bg-white dark:bg-black">
  <div class="container mx-auto">
    <div class="lg:grid grid-cols-2 mt-10 gap-4">
      <div v-for="content in contents" :key="content.title">
        <Menu
          :icon-light="content.iconLight"
          :icon-dark="content.iconDark"
          :title="content.title"
          :description="content.description"
          :link="content.link"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '~/components/KebijakanPrivasi/Menu.vue'
export default {
  name: 'LayoutKebijakanPrivasiKetentuanPengguna',
  components: { Menu },
  data () {
    return {
      contents: [
        {
          title: 'Kebijakan Privasi',
          iconLight: 'kebijakan-privasi-light.svg',
          iconDark: 'kebijakan-privasi-dark.svg',
          description: 'Membahas mengenai kebijakan dan prosedur dalam mengumpulkan, menggunakan, dan menjaga data yang diperoleh dari pengguna.',
          link: '/kebijakan-privasi-ketentuan-pengguna/kebijakan-privasi'
        },
        {
          title: 'Ketentuan Pengguna',
          iconLight: 'ketentuan-pengguna-light.svg',
          iconDark: 'ketentuan-pengguna-dark.svg',
          description: 'Ketentuan ini merupakan perjanjian yang harus dibaca, dipahami, dan disetujui oleh pengguna sebelum mengakses dan/atau menggunakan SAPAWARGA.',
          link: '/kebijakan-privasi-ketentuan-pengguna/ketentuan-pengguna'
        }
      ]
    }
  }
}
</script>
