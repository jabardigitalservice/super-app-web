<template>
  <div class="flex justify-center">
    <div class="bg-white w-96 h-[515px] rounded-lg p-6 flex flex-col justify-center items-center">
      <div class="flex justify-center items-center">
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
          :error-message="errorPassword"
        >
          <template #icon-left>
            <IconKey />
          </template>
          <template #text-info>
            <div class="flex justify-between gap-2 bg-gray-50 p-2 rounded-lg mt-3">
              <IconWarning />
              <p class="text-xs text-gray-700">
                Password minimal 6 karakter dengan kombinasi huruf kapital, angka dan simbol.
              </p>
            </div>
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
          :disabled="!isEnabledButton"
          @click="onClickSave"
        >
          Simpan Perubahan
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import IconWarning from '~/assets/images/warning.svg?inline'
import IconLock from '~/assets/images/lock.svg?inline'
import IconKey from '~/assets/icon/key.svg?inline'

export default {
  name: 'ComponentResetPassword',
  components: {
    IconLock,
    IconKey,
    IconWarning
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
      return !!((
        this.password.length &&
        this.passwordConfirmation.length &&
        !this.errorPassword &&
        !this.errorConfirmation
      ))
    }
  },
  watch: {
    password (value) {
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
      this.$emit('on-click-save', this.password)
    }
  }
}
</script>
