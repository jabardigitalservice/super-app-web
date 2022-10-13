<template>
  <div class="block p-4 h-screen bg-background">
    <div class="flex justify-center items-center gap-2 mb-6">
      <div class="rounded-full bg-white w-10 h-10 flex justify-center items-center">
        <IconLogo width="24" height="33.38" />
      </div>
      <span class="font-roboto font-bold">Sapawarga</span>
    </div>
    <div class="flex justify-center items-center">
      <div class="bg-white rounded-lg p-6 font-normal w-96">
        <div class="flex justify-center items-center my-6">
          <IconLock class="bg-gray-50 w-[120px] h-[120px] rounded-full" />
        </div>
        <div class="flex flex-col gap-6">
          <h1 class="font-lora font-bold text-2xl text-gray-900 mt-4">
            Buat Password Baru
          </h1>
          <BaseInputText
            v-model="password"
            name="password"
            label="Password Baru"
            placeholder="Masukkan password baru"
            type="password"
            autocomplete="off"
            :is-show-password-level="true"
          >
            <template #icon-left>
              <IconKey />
            </template>
          </BaseInputText>
          <BaseInputText
            v-model="passwordConfirmation"
            name="password-confirmation"
            label="Konfirmasi Password Baru"
            placeholder="Konfirmasi password baru"
            type="password"
            autocomplete="off"
          >
            <template #icon-left>
              <IconKey />
            </template>
          </BaseInputText>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconLogo from '~/assets/images/logo.svg?inline'
import IconLock from '~/assets/images/lock.svg?inline'
import IconKey from '~/assets/icon/key.svg?inline'

export default {
  name: 'ResetPasswordPage',
  components: {
    IconLogo, IconLock, IconKey
  },
  data () {
    return {
      password: '',
      passwordConfirmation: ''
    }
  }
}
</script>
