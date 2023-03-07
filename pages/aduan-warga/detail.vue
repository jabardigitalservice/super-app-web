<template>
  <div class="h-screen bg-background dark:bg-black">
    <div
      class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center"
    >
      <div class="h-full sm:h-auto">
        <div
          class="bg-white w-full h-full p-4 dark:bg-black sm:w-[360px] sm:h-[515px] sm:rounded-lg sm:dark:bg-dark-emphasis-low overflow-y-auto"
        >
          <Milestone :data-milestone="dataDummy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Milestone from '~/components/Aduan/milestone.vue'
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
