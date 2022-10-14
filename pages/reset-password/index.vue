<template>
  <div class="h-screen bg-background block p-4">
    <div class="flex justify-center items-center gap-2 mb-6">
      <div class="rounded-full bg-white w-10 h-10 flex justify-center items-center">
        <IconLogo width="24" height="33.38" />
      </div>
      <span class="font-roboto font-bold">Sapawarga</span>
    </div>
    <ResetPassword @on-click-save="savePassword" />
  </div>
</template>

<script>
import IconLogo from '~/assets/images/logo.svg?inline'

export default {
  name: 'ResetPasswordPage',
  components: {
    IconLogo
  },
  data () {
    return {
      // todo: create loading component
      loading: false
    }
  },
  methods: {
    savePassword () {
      // todo: update save password
    }
  }
}
</script>
