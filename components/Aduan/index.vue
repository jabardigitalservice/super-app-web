<template>
  <div class="h-full flex justify-center sm:h-auto">
    <div
      class="bg-white w-full h-full p-4 flex flex-col justify-center items-center dark:bg-black sm:w-[360px] sm:h-[515px] sm:rounded-lg sm:dark:bg-dark-emphasis-low"
    >
      <div
        class="flex justify-center items-center bg-gray-100 w-[120px] h-[120px] rounded-full dark:bg-dark-emphasis-medium m-auto"
      >
        <ImageLoudSpeaker />
      </div>
      <div class="flex flex-col gap-[22px] mt-auto">
        <BaseInputText
          v-model="idAduan"
          placeholder="ID Aduan"
          type="number"
          name="id-aduan"
          label="Masukkan nomor ID Aduan dari aduan Anda sebelumnya."
          autocomplete="off"
          :error="errorCheck"
        >
          <template #icon-left>
            <IconLoudSpeaker />
          </template>
        </BaseInputText>

        <BaseButton
          class="bg-green-700 hover:bg-green-600 text-sm text-white mb-2"
          @click="onClickCheck"
        >
          Cek Status Aduan
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import ImageLoudSpeaker from '~/assets/images/loudspeaker.svg?inline'
import IconLoudSpeaker from '~/assets/icon/loud-speaker.svg?inline'
export default {
  name: 'ComponentAduan',
  components: {
    ImageLoudSpeaker,
    IconLoudSpeaker
  },
  data () {
    return {
      errorCheck: false,
      idAduan: ''
    }
  },
  methods: {
    onClickCheck () {
      this.errorCheck = this.idAduan === ''
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
</style>
