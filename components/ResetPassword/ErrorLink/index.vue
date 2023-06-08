<template>
  <div class="flex justify-center">
    <div
      class="bg-white w-96 h-[515px] rounded-lg p-6 flex flex-col justify-center items-center dark:bg-black"
    >
      <div class="flex justify-center items-center w-full h-full">
        <div class="relative">
          <IconKey
            class="bg-gray-50 w-[120px] h-[120px] rounded-full dark:bg-dark-emphasis-medium"
          />
          <div
            class=" absolute bottom-0 right-0 w-[42px] h-[42px] rounded-full flex justify-center items-center"
          >
            <IconAlert class="w-7 h-7" />
          </div>
        </div>
      </div>
      <div class="w-full bottom-0 flex flex-col justify-start mb-8">
        <h1
          class="font-lora font-bold text-xl text-red-500 dark:text-dark-text-error  pt-6 "
        >
          {{ errorMessage }}
        </h1>
        <p
          class="text-gray-800 font-lato text-sm pt-4 dark:text-dark-text-medium"
        >
          Perubahan password gagal dilakukan. Silakan lakukan kembali permintaan Lupa Password di aplikasi Sapawarga.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import IconKey from '~/assets/images/key.svg?inline'
import IconAlert from '~/assets/icon/alert.svg?inline'

export default {
  name: 'ComponentResetPasswordErrorLink',
  components: {
    IconKey,
    IconAlert
  },
  props: {
    email: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    }
  }
}
</script>
