<template>
  <div class="p-4 rounded-xl bg-white dark:bg-dark-emphasis-low min-h-screen">
    <ImahAingFormStepper />

    <div class="border border-gray-300 rounded-lg max-w-[650px] mx-auto dark:border-dark-emphasis-medium mt-4">
      <template v-for="item in formTitle">
        <h3
          v-if="currentFormStep === item.id"
          :key="item.id + item.title"
          class="px-7 py-5 font-bold text-black dark:text-dark-emphasis-high"
        >
          {{ item.title }}
        </h3>
      </template>

      <hr class="dark:border-dark-emphasis-medium" />

      <div class="px-7 py-5">
        <div v-if="currentFormStep > 0">
          <ImahAingFormStepOne v-if="currentFormStep === 1" />
          <ImahAingFormStepTwo v-if="currentFormStep === 2" ref="stepTwo" />
          <ImahAingFormStepThree v-if="currentFormStep === 3" />
          <ImahAingFormStepFour v-if="currentFormStep === 4" />
        </div>
        <div v-else class="flex justify-center items-center py-10">
          <p class="text-gray-500 italic">Initializing form...</p>
        </div>

        <div v-if="currentFormStep > 0" class="mt-6 flex justify-between">
          <button
            v-if="!isFirstStep"
            class="jds-button jds-button--secondary"
            type="button"
            @click="previousStep"
          >
            Kembali
          </button>

          <button
            v-if="!isLastStep"
            class="jds-button jds-button--primary ml-auto"
            :disabled="currentFormStep === 1 ? !isConsentValid : false"
            type="button"
            @click="handleNext"
          >
            Simpan dan Lanjutkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      isLoading: false,
      formTitle: [
        { id: 1, title: 'Perhatian' },
        { id: 2, title: 'Data Pengusul' },
        { id: 3, title: 'Dokumen Yang Diperlukan' },
        { id: 4, title: 'Lokasi Tanah' },
      ],
    }
  },
  computed: {
    ...mapGetters('imahAingForm', ['currentFormStep', 'isFirstStep', 'isLastStep', 'startStep', 'isConsentValid']),
  },
  async mounted() {
    const token = this.$route.query.token || ''
    // initialize store with token
    await this.initForm(token)
    // ensure we are on the correct starting step after token is processed
    this.$store.commit('imahAingForm/SET_CURRENT_FORM_STEP', this.startStep)
  },
  methods: {
    ...mapActions('imahAingForm', ['initForm', 'nextStep', 'previousStep', 'resetForm']),
    async handleNext() {
      if (this.currentFormStep === 2) {
        const isValid = await this.$refs.stepTwo?.validate()
        if (!isValid) return
      }
      this.nextStep()
    },
  },
}
</script>
