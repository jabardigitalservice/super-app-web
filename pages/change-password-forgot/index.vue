<template>
  <div class="h-screen bg-background dark:bg-black">
    <div
      class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center"
    >
      <div class="hidden justify-center items-center gap-2 mb-6 sm:flex">
        <div
          class="rounded-full bg-white w-10 h-10 flex justify-center items-center dark:bg-dark-emphasis-medium"
        >
          <IconLogo width="24" height="33.38" />
        </div>
        <span class="font-roboto font-bold">Sapawarga</span>
      </div>
      <div
        class="flex flex-row gap-4 pl-4 items-center bg-white border-b-2 border-gray-100 h-[52px] sm:hidden dark:bg-dark-emphasis-medium dark:border-dark-emphasis-medium"
      >
        <IconArrowLeft class="stroke-gray-900 dark:stroke-dark-text-high" />
        <p class="font roboto font-bold text-gray-900 dark:text-dark-text-high">
          Buat Password Baru
        </p>
      </div>
      <ResetPassword v-if="display === 'form'" @on-click-save="savePassword" />
      <ResetPasswordLoading v-else-if="display === 'loading'" />
      <ResetPasswordAlert v-else-if="display === 'alert'" :email="email" :type-display-alert-change-password="typeDisplayAlertChangePassword" :error-message="messageErrorPage" />
    </div>
  </div>
</template>

<script>
import IconLogo from '~/assets/images/logo.svg?inline'
import IconArrowLeft from '~/assets/icon/arrow-left.svg?inline'

export default {
  name: 'ChangePasswordPage',
  components: { IconLogo, IconArrowLeft },
  data () {
    return {
      display: 'form',
      email: '',
      messageErrorPage: '',
      typeDisplayAlertChangePassword: '',
      errorResponseMessage: {
        4010100: 'Link lupa password ini sudah pernah digunakan',
        4010101: 'Link lupa password ini sudah kedaluwarsa'
      }
    }
  },
  methods: {
    async savePassword (password) {
      const queryToken = this.$route.query.token

      if (queryToken) {
        this.display = 'loading'
        // extract token, userid, & timestamp
        const dataDecoded = Buffer.from(queryToken, 'base64').toString('utf-8')
        const token = dataDecoded.split(':')[0]
        const tokenEncoded = Buffer.from(token).toString('base64')
        const userId = dataDecoded.split(':')[1]
        const timestamp = dataDecoded.split(':').slice(2).join(':')

        try {
          const response = await this.$axios.post(
            '/user/auth/change-password-forgot',
            {
              token: tokenEncoded,
              userId,
              password
            },
            {
              headers: {
                'X-Timestamp': timestamp,
                'X-Localization': 'id'
              }
            }
          )
          const { data } = response.data
          this.email = data?.email
          this.typeDisplayAlertChangePassword = 'success'
          this.messageErrorPage = ''
          this.display = 'alert'
        } catch (error) {
          this.messageErrorPage = this.errorResponseMessage[error.response.data?.code] || 'Perubahaan password gagal dilakukan'
          this.typeDisplayAlertChangePassword = 'error'
          this.display = 'alert'
        }
      }
    }
  }
}
</script>
