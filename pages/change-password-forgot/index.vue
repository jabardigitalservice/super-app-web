<template>
  <div class="h-screen bg-background block p-4">
    <div class="flex justify-center items-center gap-2 mb-6">
      <div class="rounded-full bg-white w-10 h-10 flex justify-center items-center">
        <IconLogo width="24" height="33.38" />
      </div>
      <span class="font-roboto font-bold">Sapawarga</span>
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
</template>

<script>
import IconLogo from '~/assets/images/logo.svg?inline'

export default {
  name: 'ChangePasswordPage',
  components: { IconLogo },
  data () {
    return {
      display: 'form'
    }
  },
  methods: {
    async savePassword (password) {
      const queryToken = this.$route.query.token

      if (queryToken) {
        // this.display = 'loading'
        // extract token, userid, & timestamp
        const dataDecoded = Buffer.from(queryToken, 'base64').toString('utf-8')
        const token = dataDecoded.split(':')[0]
        const tokenEncoded = Buffer.from(token).toString('base64')
        const userId = dataDecoded.split(':')[1]
        const timestamp = dataDecoded.split(':').slice(2).join(':')

        try {
          await this.$axios.post('/v1/user/auth/change-password-forgot', {
            token: tokenEncoded,
            userId,
            password
          }, {
            headers: {
              'x-timestamp': timestamp,
              'Access-Control-Allow-Origin': '*'
            }
          })
          this.display = 'success'
        } catch (error) {
          this.display = 'form'
        }
      }
    }
  }
}
</script>
