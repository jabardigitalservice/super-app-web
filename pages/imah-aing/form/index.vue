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
        <div>
          <ImahAingFormStepOne v-if="currentFormStep === 1" />
          <!-- Other steps will be added later -->
        </div>

        <div class="mt-6 flex justify-between">
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
            @click="nextStep"
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

export default {
  components: {
    ImahAingFormStepper,
    ImahAingFormStepOne,
  },
  beforeRouteLeave(to, from, next) {
    this.resetForm()
    next()
  },
  middleware: 'unleash',
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
  mounted() {
    const token = this.$route.query.token || ''
    // initialize store with token and set starting step
    this.initForm(token)
    this.$store.commit('imahAingForm/SET_CURRENT_FORM_STEP', this.startStep)
  },
  methods: {
    ...mapActions('imahAingForm', ['initForm', 'nextStep', 'previousStep', 'resetForm']),
  },
}
</script>
