<template>
  <div class="flex justify-center">
    <div class="bg-white w-96 h-[515px] rounded-lg p-6 flex flex-col justify-center items-center dark:bg-black">
      <div class="flex justify-center items-center w-[120px] h-[120px] relative">
        <IconLock class="bg-gray-50 rounded-full dark:bg-dark-emphasis-medium" />
        <div class="bg-blue-600 absolute bottom-0 right-0 w-[42px] h-[42px] rounded-full flex justify-center items-center">
          <IconProgress1 v-show="showIcon === 1" class="w-7 h-7" />
          <IconProgress2 v-show="showIcon === 2" class="w-7 h-7" />
          <IconProgress3 v-show="showIcon === 3" class="w-7 h-7" />
          <IconProgress4 v-show="showIcon === 4" class="w-7 h-7" />
          <IconProgress5 v-show="showIcon === 5" class="w-7 h-7" />
          <IconProgress6 v-show="showIcon === 6" class="w-7 h-7" />
        </div>
      </div>
      <p class="my-6 text-gray-800 font-lato text-sm dark:text-dark-text-medium">
        Menyimpan password baru ...
      </p>
    </div>
  </div>
</template>

<script>
import IconLock from '~/assets/images/lock.svg?inline'
import IconProgress1 from '~/assets/icon/progress/progress-1.svg?inline'
import IconProgress2 from '~/assets/icon/progress/progress-2.svg?inline'
import IconProgress3 from '~/assets/icon/progress/progress-3.svg?inline'
import IconProgress4 from '~/assets/icon/progress/progress-4.svg?inline'
import IconProgress5 from '~/assets/icon/progress/progress-5.svg?inline'
import IconProgress6 from '~/assets/icon/progress/progress-6.svg?inline'

export default {
  name: 'ComponentResetPasswordLoading',
  components: {
    IconLock,
    IconProgress1,
    IconProgress2,
    IconProgress3,
    IconProgress4,
    IconProgress5,
    IconProgress6
  },
  data () {
    return {
      showIcon: 1
    }
  },
  mounted () {
    setInterval(() => {
      this.showIcon += 1
      if (this.showIcon > 6) {
        this.showIcon = 1
      }
    }, 150)
  }
}
</script>
