<template>
  <div class="flex justify-center">
    <div class="bg-white w-96 h-[515px] rounded-lg p-6 flex flex-col justify-center items-center dark:bg-black">
      <div class="flex justify-center items-center w-full h-full">
        <div class="relative">
          <IconKey class="bg-gray-50 w-[120px] h-[120px] rounded-full dark:bg-dark-emphasis-medium" />
          <div class="bg-green-600 absolute bottom-0 right-0 w-[42px] h-[42px] rounded-full flex justify-center items-center">
            <IconCheck class="w-7 h-7" />
          </div>
        </div>
      </div>
      <div class="w-full bottom-0 flex flex-col justify-start mb-8">
        <h1 class="font-lora font-bold text-2xl text-gray-900 pt-6 dark:text-dark-text-high">
          Ubah Password Berhasil
        </h1>
        <p class="text-gray-800 font-lato text-sm pt-4 dark:text-dark-text-medium">
          Perubahan password berhasil dilakukan.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import IconKey from '~/assets/images/key.svg?inline'
import IconCheck from '~/assets/icon/check.svg?inline'

export default {
  name: 'ComponentResetPasswordSuccess',
  components: {
    IconKey,
    IconCheck
  }
}
</script>
