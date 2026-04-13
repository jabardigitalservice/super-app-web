<template>
  <div
    class="min-h-screen p-3 bg-white md:p-4 lg:p-6 xl:py-8 xl:px-10 rounded-xl dark:bg-dark-emphasis-low"
  >
    <JalanAingFormStepper />
    <div
      class="border border-gray-300 rounded-lg max-w-[650px] mx-auto dark:border-dark-emphasis-medium"
    >
      <template v-for="{ title, id } in formTitle">
        <h3
          v-if="currentFormStep === id && currentFormStep !== 1"
          :key="id + title"
          class="py-5 font-bold text-black px-7 dark:text-dark-emphasis-high"
        >
          {{ title }}
        </h3>
      </template>

      <hr
        v-if="currentFormStep !== 1"
        class="dark:border-dark-emphasis-medium"
      />

      <JalanAingSkeleton v-if="isLoading" />

      <div v-if="!isLoading" class="py-5 px-7">
        <ValidationObserver ref="form" v-slot="{ invalid }" slim>
          <div v-if="currentFormStep === 4" class="hidden">
            {{ logFormValidation(invalid) }}
          </div>
          <form class="mb-10 citizen__form" @submit.prevent="">
            <JalanAingFormStepZero v-if="currentFormStep === 1" />
            <JalanAingFormStepOne v-if="currentFormStep === 2" />
            <JalanAingFormStepTwo v-if="currentFormStep === 3" />
            <JalanAingFormStepThree v-if="currentFormStep === 4" />
            <JalanAingFormStepFour v-if="currentFormStep === 5" />

            <!-- MOBILE -->
            <div class="grid grid-cols-1 gap-2 md:hidden">
              <Button
                v-if="!isLastStep"
                :style="[
                  (currentFormStep === 4 ? invalidImages : invalid) && {
                    backgroundColor: '#E0E0E0',
                    color: '#FFFFFF',
                  },
                ]"
                :disabled="currentFormStep === 4 ? invalidImages : invalid"
                class="w-full !justify-center"
                variant="primary"
                type="button"
                @click="nextStep"
              >
                Simpan dan Lanjutkan
              </Button>
              <Button
                v-if="isLastStep"
                :style="[
                  invalid && { backgroundColor: '#E0E0E0', color: '#FFFFFF' },
                ]"
                variant="primary"
                :disabled="invalid"
                class="w-full !justify-center"
                @click="submitComplaint"
              >
                Kirim Aduan
              </Button>
              <Button
                v-if="!isFirstStep"
                class="w-full !justify-center"
                variant="secondary"
                @click="previousStep"
              >
                Kembali
              </Button>
            </div>

            <!-- DESKTOP -->
            <div class="hidden md:grid md:grid-cols-2">
              <Button
                v-if="!isFirstStep"
                class="w-fit"
                variant="secondary"
                type="button"
                @click="previousStep"
              >
                Kembali
              </Button>
              <Button
                v-if="!isLastStep"
                :style="[
                  (currentFormStep === 4 ? invalidImages : invalid) && {
                    backgroundColor: '#E0E0E0',
                    color: '#FFFFFF',
                  },
                ]"
                :disabled="currentFormStep === 4 ? invalidImages : invalid"
                class="col-start-2 col-end-3 w-fit justify-self-end"
                variant="primary"
                type="button"
                @click="nextStep"
              >
                Simpan dan Lanjutkan
              </Button>
              <Button
                v-if="isLastStep"
                :style="[
                  invalid && { backgroundColor: '#E0E0E0', color: '#FFFFFF' },
                ]"
                variant="primary"
                :disabled="invalid"
                class="w-fit justify-self-end"
                @click="submitComplaint"
              >
                Kirim Aduan
              </Button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>

    <!-- CONFIRMATION MODAL -->
    <JalanAingModal
      :open="statusSubmitForm.status === 'SUBMIT_CONFIRMATION'"
      label-primary-button="Iya, Kirim"
      label-secondary-button="Batalkan"
      header-close-button
      src-icon="/icon/sent-message.svg"
      size="48px"
      title="Kirim Aduan"
      description="Apakah anda yakin ingin Mengirimkan Aduan ?"
      @close="cancelSubmit"
      @click="submitComplaintForm"
    />

    <!-- PROGRESS MODAL -->
    <BaseProgressModal
      :open="statusSubmitForm.status === 'LOADING'"
      :value="statusSubmitForm.progress"
    />

    <JalanAingModal
      :open="statusSubmitForm.status === 'SUCCESS'"
      header="Berhasil!"
      label-primary-button="Check Email"
      label-secondary-button="kembali ke form aduan"
      name-icon="check-mark-circle"
      size="16px"
      description="Aduan berhasil dikirim. Silakan cek email Anda untuk informasi lebih lanjut."
      @close="backToAduanPage"
      @click="openEmail"
    />

    <JalanAingModal
      :open="statusSubmitForm.status === 'ERROR'"
      header="Gagal Mengirim Aduan!"
      label-primary-button="Coba lagi"
      label-secondary-button="Tutup"
      name-icon="warning"
      size="16px"
      description="Kami mengalami kendala dalam mengirim aduan Anda. Silakan coba lagi nanti atau periksa koneksi internet Anda."
      @close="cancelSubmit"
      @click="retrySubmitComplaintForm"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  beforeRouteLeave(to, from, next) {
    this.resetForm()
    next()
  },
  middleware: 'unleash',
  meta: {
    featureFlag: 'SAPAWARGA-WEB__ADUAN--ADUAN-FORM',
  },
  data() {
    return {
      isLoading: true,
      formTitle: [
        { id: 1, title: 'Perhatian' },
        { id: 2, title: 'Data Pengusul' },
        { id: 3, title: 'Informasi Pengajuan' },
        { id: 4, title: 'Foto Aduan' },
        { id: 5, title: 'Lokasi Aduan' },
      ],
    }
  },
  computed: {
    ...mapState('jalan-aing', ['statusSubmitForm', 'foto_aduan']),
    ...mapGetters('jalan-aing', [
      'currentFormStep',
      'isFirstStep',
      'isLastStep',
      'authToken',
      'hasAuthToken',
    ]),
    /**
     * Function to check if the foto aduan form step is invalid or not
     *  */
    invalidImages() {
      const IMAGE_UPLOAD_STATUS = {
        NONE: 'NONE',
        UPLOADING: 'UPLOADING',
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR',
      }

      console.log('=== VALIDASI FOTO ADUAN ===')
      console.log('Total gambar:', this.foto_aduan.raw_image.length)
      console.log('Data gambar:', this.foto_aduan.raw_image)

      this.foto_aduan.raw_image.forEach((image, index) => {
        console.log(`Gambar ${index + 1}:`, {
          id: image.id,
          status: image.image_upload_status,
          file: image.image_file?.name,
          errors: image.errors,
        })
      })

      const hasNoImages = !this.foto_aduan.raw_image.length
      const hasInvalidImages = this.foto_aduan.raw_image.some(
        (image) =>
          image.image_upload_status === IMAGE_UPLOAD_STATUS.ERROR ||
          image.image_upload_status === IMAGE_UPLOAD_STATUS.UPLOADING ||
          image.image_upload_status === IMAGE_UPLOAD_STATUS.NONE
      )

      console.log('Tidak ada gambar?', hasNoImages)
      console.log('Ada gambar invalid?', hasInvalidImages)
      console.log('Tombol disabled?', hasNoImages || hasInvalidImages)
      console.log('=========================')

      return hasNoImages || hasInvalidImages
    },
  },
  created() {
    this.resetForm()
  },
  async mounted() {
    this.showLoadingSkeleton()
    if (!this.hasAuthToken) {
      try {
        const token = await this.$getToken('client_credentials')
        this.setAuthToken(token)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to get token:', error)
      }
    }
  },
  methods: {
    ...mapActions('jalan-aing', [
      'nextStep',
      'previousStep',
      'submitConfirmation',
      'closeConfirmation',
      'submitForm',
      'resetForm',
      'setAuthToken',
    ]),
    logFormValidation(invalid) {
      console.log('=== VALIDASI FORM ===')
      console.log('Form invalid?', invalid)
      console.log('Current step:', this.currentFormStep)
      console.log('invalidImages:', this.invalidImages)
      console.log(
        'Kondisi tombol disabled:',
        this.currentFormStep === 4 ? this.invalidImages : invalid
      )
      console.log('====================')
      return ''
    },
    submitComplaint() {
      this.submitConfirmation()
    },
    cancelSubmit() {
      this.closeConfirmation()
    },
    submitComplaintForm() {
      this.submitForm()
    },
    retrySubmitComplaintForm() {
      this.submitForm()
    },
    async openEmail() {
      await window.open('https://gmail.com', '_blank', 'noreferrer')
      window.location.reload()
    },
    backToAduanPage() {
      window.location.reload()
    },
    showLoadingSkeleton() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1500)
    },
  },
}
</script>

<style>
/**
* Override default Design System styles
*/
.citizen__form .jds-popover,
.citizen__form .jds-popover__activator,
.citizen__form .jds-select,
.citizen__form .jds-input-text {
  width: 100% !important;
}

.citizen__form .jds-options__option-list-item__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
}

.citizen__form .jds-popover__content {
  z-index: 50 !important;
  position: fixed !important;
}

.citizen__form .jds-popover__content .jds-options__option-list-item {
  height: fit-content !important;
}

.citizen__form .jds-options__option-list-item__text {
  white-space: unset !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

.citizen__form .jds-select__options.jds-options--filterable {
  max-height: 200px !important;
}

.citizen__form .jds-input-text input {
  width: 100% !important;
  height: 100% !important;
  font-size: 14px !important;
  color: #616161 !important;
}
</style>
