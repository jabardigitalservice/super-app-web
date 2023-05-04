<template>
  <div class="h-full flex justify-center sm:h-auto">
    <div
      class="bg-white w-full h-full p-4 flex flex-col justify-center items-center sm:w-[360px] sm:h-[515px] sm:rounded-lg dark:bg-black"
    >
      <div
        class="flex justify-center items-center bg-gray-100 w-[120px] h-[120px] rounded-full m-auto dark:bg-dark-emphasis-medium"
      >
        <ImageLoudSpeaker />
      </div>
      <div class="flex flex-col gap-[22px] mt-auto">
        <BaseInputText
          v-model="idAduan"
          placeholder="ID Aduan"
          class="dark:text-dark-text-medium"
          type="number"
          name="id-aduan"
          label="Masukkan nomor ID Aduan dari aduan Anda sebelumnya."
          autocomplete="off"
          :error="errorCheck"
          :disabled="errorCheck"
        >
          <template #icon-left>
            <IconLoudSpeaker />
          </template>
        </BaseInputText>

        <BaseButton
          class="text-sm text-white mb-2 dark:border-0"
          :class="
            errorCheck
              ? 'bg-red-400 hover:bg-red-600'
              : 'bg-green-700 hover:bg-green-600'
          "
          :error-button-message="errorMessage"
          @click="onClickCheck"
        >
          {{
            errorMessage && errorCheck
              ? "ID Aduan harus diisi"
              : "Cek Status Aduan"
          }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import ImageLoudSpeaker from '~/assets/images/loudspeaker.svg?inline'
import IconLoudSpeaker from '~/assets/icon/loud-speaker.svg?inline'
import { fetchAduanData } from '~/utils'
export default {
  name: 'ComponentAduan',
  components: {
    ImageLoudSpeaker,
    IconLoudSpeaker
  },
  data () {
    return {
      errorCheck: false,
      idAduan: '',
      errorMessage: '',
      token: '',
      data: [],
      idAduanNotFound: false
    }
  },
  methods: {
    onClickCheck () {
      if (this.idAduan) {
        this.errorMessage = ''
        this.errorCheck = false
        this.fetchData()
      } else {
        this.errorMessage = this.errorMessage ? '' : 'OK'
        this.errorCheck = !this.errorCheck
      }
    },
    async fetchData () {
      this.loading = true

      try {
        this.data = await fetchAduanData(
          this.$aduanAPI,
          this.$newrelicSetup,
          this.idAduan,
          this.$config
        )

        if (this.data) {
          this.$store.commit('setDataAduan', this.data)
          this.$router.push(`/aduan-warga/detail/${this.idAduan}`)
        } else {
          this.idAduanNotFound = true
        }
      } catch (error) {
        this.$newrelicSetup.noticeError(error)
      }

      this.loading = false
    }
  }
}
</script>

<style scope>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

label {
  @apply dark:!text-dark-text-medium;
}
</style>
