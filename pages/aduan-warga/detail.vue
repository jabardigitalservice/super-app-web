<template class="h-screen bg-background dark:bg-black">
  <div
    class="bg-white w-full h-screen dark:bg-black rounded-lg sm:dark:bg-dark-emphasis-low overflow-y-auto"
  >
    <div class="p-4">
      <Milestone :data-milestone="dataDummy" />
    </div>
    <div class="absolute w-full h-full top-0 bg-black opacity-60" />

    <BaseDialog
      :show-popup="true"
      title="Konfirmasi Penyelesaian"
      label-button-approve="Ya, Sangat Membantu"
      label-button-reject="Tidak Membantu"
      information-message=""
    >
      <template #confirmationText>
        Apakah penyelesaian dari instansi ini membantu?
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import Milestone from '~/components/Aduan/Milestone.vue'
export default {
  name: 'DetailAduanWarga',
  components: { Milestone },
  data () {
    return {
      dataDummy: [
        {
          status: 1,
          date: 'Senin, 21 Desember 2022',
          time: '18:00',
          name: 'Admin'
        },
        {
          status: 2,
          date: 'Senin, 22 Desember 2022',
          time: '18:00',
          name: 'Admin'
        },
        {
          status: 3,
          date: 'Senin, 23 Desember 2022',
          time: '18:00',
          name: 'Admin'
        },
        {
          status: 4,
          date: 'Senin, 24 Desember 2022',
          time: '18:00',
          name: 'Admin'
        },
        {
          status: 5,
          date: 'Senin, 25 Desember 2022',
          time: '18:00',
          name: 'Admin'
        },
        {
          status: 6,
          date: 'Senin, 26 Desember 2022',
          time: '18:00',
          name: 'Admin'
        },
        {
          status: 7,
          date: 'Senin, 27 Desember 2022',
          time: '18:00',
          name: 'Admin'
        }
      ]
    }
  }
}
</script>
