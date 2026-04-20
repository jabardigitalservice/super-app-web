<template>
  <div
    class="p-3 md:p-4 lg:p-6 xl:py-8 xl:px-10 rounded-xl bg-white dark:bg-dark-emphasis-low min-h-screen"
  >
    <ImahAingFormStepper />
    <div
      class="border border-gray-300 rounded-lg max-w-[650px] mx-auto dark:border-dark-emphasis-medium"
    >
      <template v-for="{ title, id } in formTitle">
        <h3
          v-if="currentFormStep === id"
          :key="id + title"
          class="px-7 py-5 font-bold text-black dark:text-dark-emphasis-high"
        >
          {{ title }}
        </h3>
      </template>

      <hr class="dark:border-dark-emphasis-medium" />

      <TrackingComplaintSkeleton v-if="isLoading" />

      <div v-if="!isLoading" class="px-7 py-5">
        <form class="citizen__form mb-10" @submit.prevent="">
          <ImahAingFormStepOne v-if="currentFormStep === 1" />
          <ImahAingFormStepTwo v-if="currentFormStep === 2" ref="stepTwo" />
          <ImahAingFormStepThree v-if="currentFormStep === 3" ref="stepThree" />
          <ImahAingFormStepFour v-if="currentFormStep === 4" ref="stepFour" />

          <div class="grid grid-cols-1 gap-2 md:hidden">
            <Button
              v-if="!isLastStep"
              :style="[
                nextButtonDisabled && {
                  backgroundColor: '#E0E0E0',
                  color: '#FFFFFF',
                },
              ]"
              :disabled="nextButtonDisabled"
              class="w-full !justify-center"
              variant="primary"
              type="button"
              @click="nextStep"
            >
              Simpan dan Lanjutkan
            </Button>
            <Button
              v-if="isLastStep"
              class="w-full !justify-center"
              variant="primary"
              type="button"
              @click="submitComplaint"
            >
              Kirim Pengajuan
            </Button>
            <Button
              v-if="!isFirstStep"
              class="w-full !justify-center"
              variant="secondary"
              type="button"
              @click="previousStep"
            >
              Kembali
            </Button>
          </div>

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
                nextButtonDisabled && {
                  backgroundColor: '#E0E0E0',
                  color: '#FFFFFF',
                },
              ]"
              :disabled="nextButtonDisabled"
              class="w-fit col-start-2 col-end-3 justify-self-end"
              variant="primary"
              type="button"
              @click="nextStep"
            >
              Simpan dan Lanjutkan
            </Button>
            <Button
              v-if="isLastStep"
              class="w-fit justify-self-end"
              variant="primary"
              type="button"
              @click="submitComplaint"
            >
              Kirim Pengajuan
            </Button>
          </div>
        </form>
      </div>
    </div>

    <TrackingComplaintModal
      :open="statusSubmitForm.status === 'SUBMIT_CONFIRMATION'"
      label-primary-button="Iya, Kirim"
      label-secondary-button="Batalkan"
      header-close-button
      src-icon="/icon/sent-message.svg"
      size="48px"
      title="Kirim Pengajuan"
      description="Apakah Anda yakin ingin mengirimkan pengajuan?"
      @close="cancelSubmit"
      @click="submitComplaintForm"
    />

    <BaseProgressModal
      :open="statusSubmitForm.status === 'LOADING'"
      :value="statusSubmitForm.progress"
      header="Mengirim Pengajuan"
      message="Mohon tunggu, pengiriman pengajuan sedang diproses."
    />

    <TrackingComplaintModal
      :open="statusSubmitForm.status === 'SUCCESS'"
      header="Berhasil!"
      label-primary-button="Kembali ke form Pengajuan"
      label-secondary-button="Tutup"
      name-icon="check-mark-circle"
      size="16px"
      :description="successDescription"
      @close="backToFormPage"
      @click="backToFormPage"
    />

    <TrackingComplaintModal
      :open="statusSubmitForm.status === 'ERROR'"
      header="Gagal Mengirim Pengajuan!"
      label-primary-button="Coba lagi"
      label-secondary-button="Tutup"
      name-icon="warning"
      size="16px"
      description="Kami mengalami kendala dalam mengirim pengajuan Anda. Silakan coba lagi nanti atau periksa koneksi internet Anda."
      @close="cancelSubmit"
      @click="retrySubmitComplaintForm"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import ImahAingFormStepper from '~/components/ImahAing/Form/Stepper.vue'
import ImahAingFormStepOne from '~/components/ImahAing/Form/StepOne.vue'
import ImahAingFormStepTwo from '~/components/ImahAing/Form/StepTwo.vue'
import ImahAingFormStepThree from '~/components/ImahAing/Form/StepThree.vue'
import ImahAingFormStepFour from '~/components/ImahAing/Form/StepFour.vue'

export default {
  components: {
    ImahAingFormStepper,
    ImahAingFormStepOne,
    ImahAingFormStepTwo,
    ImahAingFormStepThree,
    ImahAingFormStepFour,
  },
  beforeRouteLeave(to, from, next) {
    this.resetForm()
    next()
  },
  // middleware: 'unleash',
  meta: {
    featureFlag: 'SAPAWARGA-WEB__IMAH-AING--FORM',
  },
  data() {
    return {
      isLoading: true,
      formTitle: [
        { id: 1, title: 'Perhatian' },
        { id: 2, title: 'Calon Penerima Bantuan (Kepala Keluarga)' },
        { id: 3, title: 'Dokumen Yang Diperlukan' },
        { id: 4, title: 'Lokasi Tanah untuk Perbaikan Rumah' },
      ],
    }
  },
  computed: {
    ...mapState('imahAingForm', ['statusSubmitForm']),
    ...mapGetters('imahAingForm', [
      'currentFormStep',
      'isFirstStep',
      'isLastStep',
      'startStep',
      'isConsentValid',
      'isAllDocumentsUploaded',
      'hasAuthToken',
    ]),
    nextButtonDisabled() {
      const step = Number(this.currentFormStep)
      if (step === 1) {
        return !this.isConsentValid
      }
      if (step === 3) {
        return !this.isAllDocumentsUploaded
      }
      return false
    },
    successDescription() {
      const submissionId = this.statusSubmitForm.submission_id || '-'
      return `Pengajuan sudah berhasil dilakukan dengan ID: ${submissionId}. Pastikan warga mencatat ID pengajuan tersebut. Warga dapat melakukan pengecekan status pengajuan melalui Hotline Jabar di Nomor WhatsApp 082126030038.`
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
    await this.initForm(this.$route.query)
    this.hydrateLokasiTanahFromGeolocation()
    this.$store.commit('imahAingForm/SET_CURRENT_FORM_STEP', this.startStep)
  },
  methods: {
    ...mapActions('imahAingForm', {
      initForm: 'initForm',
      hydrateLokasiTanahFromGeolocation: 'hydrateLokasiTanahFromGeolocation',
      goToNextStep: 'nextStep',
      goToPreviousStep: 'previousStep',
      submitForm: 'submitForm',
      resetForm: 'resetForm',
      setAuthToken: 'setAuthToken',
      checkKkDuplicate: 'checkKkDuplicate',
    }),
    async nextStep() {
      const step = Number(this.currentFormStep)
      if (step === 2 && this.$refs.stepTwo) {
        const isValid = await this.$refs.stepTwo.validate()
        if (!isValid) {
          return
        }
        this.$refs.stepTwo.clearKkDuplicateMessage()
        try {
          const exists = await this.checkKkDuplicate()
          if (exists) {
            this.$refs.stepTwo.setKkDuplicateMessage(
              'No KK Sudah Pernah Diajukan. Silahkan Hubungi Hotline Jabar di Nomor WhatsApp 082126030038.'
            )
            return
          }
        } catch {
          this.$refs.stepTwo.setKkDuplicateMessage('Gagal memverifikasi No KK. Silakan coba lagi.')
          return
        }
      }
      if (step === 3) {
        if (!this.isAllDocumentsUploaded) {
          return
        }
        if (this.$refs.stepThree) {
          const kondisiOk = await this.$refs.stepThree.validate()
          if (!kondisiOk) {
            return
          }
        }
      }
      await this.goToNextStep()
    },
    previousStep() {
      this.goToPreviousStep()
    },
    async submitComplaint() {
      if (this.$refs.stepFour) {
        const isValid = await this.$refs.stepFour.validate()
        if (!isValid) {
          return
        }
      }
      this.$store.commit('imahAingForm/SET_STATUS_SUBMIT', 'SUBMIT_CONFIRMATION')
    },
    cancelSubmit() {
      this.$store.commit('imahAingForm/SET_STATUS_SUBMIT', 'NONE')
    },
    async submitComplaintForm() {
      try {
        await this.submitForm()
      } catch (error) {
        // Error state is already handled in the store.
      }
    },
    async retrySubmitComplaintForm() {
      await this.submitComplaintForm()
    },
    async backToFormPage() {
      this.resetForm()
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
      await this.initForm(this.$route.query)
      this.hydrateLokasiTanahFromGeolocation()
      this.$store.commit('imahAingForm/SET_STATUS_SUBMIT', 'NONE')
      this.$store.commit('imahAingForm/SET_CURRENT_FORM_STEP', this.startStep)
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
