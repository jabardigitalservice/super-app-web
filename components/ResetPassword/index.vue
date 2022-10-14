<template>
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
          :is-show-info="true"
          :error-message="errorPassword"
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
          :error-message="errorConfirmation"
        >
          <template #icon-left>
            <IconKey />
          </template>
        </BaseInputText>
        <BaseButton
          class="bg-green-700 hover:bg-green-600 text-sm text-white mb-2"
          @click="onClickSave"
        >
          Simpan Perubahan
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import IconLock from '~/assets/images/lock.svg?inline'
import IconKey from '~/assets/icon/key.svg?inline'

export default {
  name: 'ComponentResetPassword',
  components: {
    IconLock, IconKey
  },
  data () {
    return {
      loading: false,
      password: '',
      passwordConfirmation: '',
      errorPassword: null,
      errorConfirmation: null
    }
  },
  watch: {
    password (value) {
      console.log(value.length)
      if (value.length === 0) {
        this.errorPassword = 'Password baru tidak boleh kosong'
      } else if (value.length < 6) {
        this.errorPassword = 'Isian password minimal 8 karakter.'
      } else {
        this.errorPassword = ''
      }
    },
    passwordConfirmation (value) {
      if (value.length === 0) {
        this.errorConfirmation = 'Konfirmasi Password baru tidak boleh kosong'
      } else if (this.password && this.passwordConfirmation && this.password !== value) {
        this.errorConfirmation = 'Isian password tidak sama.'
      } else {
        this.errorConfirmation = ''
      }
    }
  },
  methods: {
    onClickSave () {
      this.$emit('on-click-save')
    }
  }
}
</script>
