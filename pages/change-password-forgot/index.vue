<template>
  <div class="h-screen bg-background">
    <div class="h-full block sm:flex sm:flex-col sm:justify-center sm:items-center">
      <div class="hidden justify-center items-center gap-2 mb-6 sm:flex">
        <div class="rounded-full bg-white w-10 h-10 flex justify-center items-center">
          <IconLogo width="24" height="33.38" />
        </div>
        <span class="font-roboto font-bold">Sapawarga</span>
      </div>
      <div class="flex flex-row gap-4 pl-4 items-center bg-white border-b-2 border-gray-100 h-[52px] sm:hidden">
        <IconArrowLeft />
        <p class="font roboto font-bold text-gray-900">
          Buat Password Baru
        </p>
      </div>
      <ResetPassword
        v-if="display === 'form'"
        @on-click-save="savePassword"
      />
      <ResetPasswordLoading
        v-else-if="display === 'loading'"
      />
      <ResetPasswordSuccess
        v-else-if="display === 'success'"
      />
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
      display: 'form'
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
          await this.$axios.post('/user/auth/change-password-forgot', {
            token: tokenEncoded,
            userId,
            password
          }, {
            headers: {
              'X-Timestamp': timestamp
            }
          })
          this.display = 'success'
        } catch (error) {
          this.display = 'form'
          this.$sentry.captureException(error)
        }
      }
    }
  }
}
</script>
