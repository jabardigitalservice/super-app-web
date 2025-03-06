<template>
  <div
    class="p-3 md:p-4 lg:p-6 xl:py-8 xl:px-10 rounded-xl bg-white dark:bg-dark-emphasis-low min-h-screen"
  >
    <TrackingComplaintFormStepper />
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
        <ValidationObserver ref="form" v-slot="{ invalid }" slim>
          <form class="citizen__form mb-10" @submit.prevent="">
            <TrackingComplaintFormStepOne v-if="currentFormStep === 1" />
            <TrackingComplaintFormStepTwo v-if="currentFormStep === 2" />
            <TrackingComplaintFormStepThree v-if="currentFormStep === 3" />
            <TrackingComplaintFormStepFour v-if="currentFormStep === 4" />

            <!-- MOBILE -->
            <div class="grid grid-cols-1 gap-2 md:hidden">
              <Button
                v-if="!isLastStep"
                :style="[
                  (currentFormStep === 3 ? invalidImages : invalid) && {
                    backgroundColor: '#E0E0E0',
                    color: '#FFFFFF',
                  },
                ]"
                :disabled="currentFormStep === 3 ? invalidImages : invalid"
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
                  (currentFormStep === 3 ? invalidImages : invalid) && {
                    backgroundColor: '#E0E0E0',
                    color: '#FFFFFF',
                  },
                ]"
                :disabled="currentFormStep === 3 ? invalidImages : invalid"
                class="w-fit col-start-2 col-end-3 justify-self-end"
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
    <TrackingComplaintModal
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

    <TrackingComplaintModal
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

    <TrackingComplaintModal
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
  data() {
    return {
      isLoading: true,
      formTitle: [
        { id: 1, title: 'Data Wargi' },
        { id: 2, title: 'Informasi Aduan' },
        { id: 3, title: 'Foto Aduan' },
        { id: 4, title: 'Lokasi Aduan' },
      ],
    }
  },
  computed: {
    ...mapState('citizenComplaintForm', ['statusSubmitForm', 'foto_aduan']),
    ...mapGetters('citizenComplaintForm', [
      'currentFormStep',
      'isFirstStep',
      'isLastStep',
    ]),
    /**
     * Function to check if the foto aduan form step is invalid or not
     *  */
    invalidImages() {
      return (
        !this.foto_aduan.raw_image.length ||
        this.foto_aduan.raw_image.some((image) => image.errors?.length > 0)
      )
    },
  },
  created() {
    this.resetForm()
  },
  mounted() {
    this.showLoadingSkeleton()
  },
  methods: {
    ...mapActions('citizenComplaintForm', [
      'nextStep',
      'previousStep',
      'submitConfirmation',
      'closeConfirmation',
      'submitForm',
      'resetForm',
    ]),
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
