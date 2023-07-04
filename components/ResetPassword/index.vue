<template>
  <div class="h-full flex justify-center sm:h-auto">
    <div
      class="bg-white w-full h-full p-4 flex flex-col justify-center items-center dark:bg-black sm:w-[360px] sm:h-[515px] sm:rounded-lg sm:dark:bg-dark-emphasis-low"
    >
      <div class="flex justify-center items-center">
        <IconLock
          class="bg-gray-50 w-[120px] h-[120px] rounded-full dark:bg-dark-emphasis-medium"
        />
      </div>
      <div class="flex flex-col gap-[22px]">
        <h1
          class="font-lora font-bold text-2xl text-gray-900 mt-4 dark:text-dark-text-high"
        >
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
          :error-message="errorPassword"
        >
          <template #icon-left>
            <IconKey />
          </template>
          <template #text-info>
            <BaseSectionMessage
              type="info"
              text="Password minimal 6 karakter dengan kombinasi huruf kapital, angka dan simbol."
            />
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
    IconLock,
    IconKey
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
  computed: {
    isEnabledButton () {
      return !!(
        this.password.length &&
        this.passwordConfirmation.length &&
        !this.errorPassword &&
        !this.errorConfirmation
      )
    }
  },

  methods: {
    onClickSave () {
      if (this.validatePassword()) {
        this.$emit('on-click-save', this.password)
      }
    },
    validatePassword () {
      const lowercaseRegex = /[a-z]/
      const uppercaseRegex = /[A-Z]/
      const numberRegex = /[0-9]/
      const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/

      this.errorPassword = ''
      this.errorConfirmation = ''

      // Cek apakah password dan konfirmasi password kosong
      if (!this.password) {
        this.errorPassword = 'Password harus diisi'
      }

      if (!this.passwordConfirmation) {
        this.errorConfirmation = 'Konfirmasi Password harus diisi'
      }

      if (!this.password || !this.passwordConfirmation) {
        return false
      }

      // Cek apakah password dan konfirmasi password cocok
      if (this.password !== this.passwordConfirmation) {
        this.errorConfirmation = 'Konfirmasi Password tidak cocok'
        return false
      }

      // Cek apakah password memiliki panjang minimal 6 karakter
      if (this.password.length < 6) {
        this.errorPassword = 'Password harus memiliki panjang minimal 6 karakter'
        return false
      }

      // Cek apakah password memiliki huruf kecil
      if (!lowercaseRegex.test(this.password)) {
        this.errorPassword =
          'Password harus mengandung setidaknya satu huruf kecil'
        return false
      }

      // Cek apakah password memiliki huruf besar
      if (!uppercaseRegex.test(this.password)) {
        this.errorPassword =
          'Password harus mengandung setidaknya satu huruf besar'
        return false
      }

      // Cek apakah password memiliki angka
      if (!numberRegex.test(this.password)) {
        this.errorPassword = 'Password harus mengandung setidaknya satu angka'
        return false
      }

      // Cek apakah password memiliki simbol
      if (!symbolRegex.test(this.password)) {
        this.errorPassword = 'Password harus mengandung setidaknya satu simbol'
        return false
      }

      return true
    }
  }
}
</script>
