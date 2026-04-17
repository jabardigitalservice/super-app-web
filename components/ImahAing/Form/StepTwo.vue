<template>
  <ValidationObserver ref="observer">
    <section class="grid grid-cols-1 gap-x-8 gap-y-4 mb-4">
    <!-- Foto Profil (tidak bisa diedit) -->
    <div class="flex flex-col items-left mb-4">
      <img :src="avatarUrl || '/images/ilustrasi-ktp.webp'" alt="avatar" class="w-24 h-24 rounded-full object-cover" />
    </div>

    <!-- Nama Calon Penerima Bantuan -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="required" name="Nama Calon Penerima Bantuan" vid="name">
      <label>Nama Calon Penerima Bantuan <span class="text-red-500">*</span></label>
      <JdsInputText :value="setName" :error-message="errors[0]" @input="setName = $event" />
    </ValidationProvider>

    <!-- No HP Calon Penerima Bantuan -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="required" name="No HP Calon Penerima Bantuan" vid="phone">
      <BaseInputText
        v-model="setPhone"
        class="step-two-input-jds"
        type="number"
        label="No HP Calon Penerima Bantuan"
        required
        :placeholder="zwsPlaceholder"
        autocomplete="off"
        :error="!!errors[0]"
        :error-message="errors[0]"
      />
    </ValidationProvider>

    <!-- Email Pribadi — OPSIONAL, EDITABLE -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="email" name="Email Pribadi" vid="email">
      <label>Email Pribadi</label>
      <JdsInputText :value="setEmail" :error-message="errors[0]" @input="setEmail = $event" />
    </ValidationProvider>

    <!-- No KTP — WAJIB -->
    <ValidationProvider
      v-slot="{ errors }"
      class="flex flex-col gap-2 mb-5"
      :rules="`required|numeric|length:${maxNikKkLength}`"
      name="No KTP Calon Penerima Bantuan"
      vid="nik"
    >
      <BaseInputText
        v-model="setNik"
        class="step-two-input-jds"
        type="text"
        label="No KTP Calon Penerima Bantuan"
        required
        :maxlength="maxNikKkLength"
        :placeholder="zwsPlaceholder"
        autocomplete="off"
        :error="!!errors[0]"
        :error-message="errors[0]"
      />
    </ValidationProvider>

    <!-- No KK — WAJIB -->
    <ValidationProvider
      v-slot="{ errors }"
      class="flex flex-col gap-2 mb-5"
      :rules="`required|numeric|length:${maxNikKkLength}`"
      name="No KK Calon Penerima Bantuan"
      vid="nomorKk"
    >
      <BaseInputText
        v-model="setNomorKk"
        class="step-two-input-jds"
        type="text"
        label="No KK Calon Penerima Bantuan"
        required
        :maxlength="maxNikKkLength"
        :placeholder="zwsPlaceholder"
        autocomplete="off"
        :error="!!errors[0]"
        :error-message="errors[0]"
      />
    </ValidationProvider>
    </section>
  </ValidationObserver>
</template>

<script>
export default {
  data() {
    return {
      /** Zero-width space: enables :placeholder-shown for JDS-like empty background (see .spec/template/InputText.scss) */
      zwsPlaceholder: '\u200B',
      /** NIK / No KK — panjang tetap 16 digit */
      maxNikKkLength: 16,
    }
  },
  computed: {
    name() {
      return this.$store.state.imahAingForm.dataPengusul.name
    },
    phone() {
      return this.$store.state.imahAingForm.dataPengusul.phone
    },
    avatarUrl() {
      return this.$store.state.imahAingForm.dataPengusul.avatarUrl
    },
    setEmail: {
      get() {
        return this.$store.state.imahAingForm.dataPengusul.email
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'email', value: val })
      },
    },
    setNik: {
      get() {
        return this.$store.state.imahAingForm.dataPengusul.nik
      },
      set(val) {
        const digits = String(val || '')
          .replace(/\D/g, '')
          .slice(0, this.maxNikKkLength)
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'nik', value: digits })
      },
    },
    setNomorKk: {
      get() {
        return this.$store.state.imahAingForm.dataPengusul.nomorKk
      },
      set(val) {
        const digits = String(val || '')
          .replace(/\D/g, '')
          .slice(0, this.maxNikKkLength)
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'nomorKk', value: digits })
      },
    },
    setName: {
      get() {
        return this.$store.state.imahAingForm.dataPengusul.name
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'name', value: val })
      },
    },
    setPhone: {
      get() {
        return this.$store.state.imahAingForm.dataPengusul.phone
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'phone', value: val })
      },
    },
  },
  methods: {
    async validate() {
      return await this.$refs.observer.validate()
    },
  },
}
</script>

<style scoped>
/*
 * Align BaseInputText with JdsInputText / InputText.scss (.spec/template) and
 * .citizen__form .jds-input-text rules on pages/imah-aing/form/index.vue
 */
.step-two-input-jds {
  width: 100%;
}

::v-deep .step-two-input-jds.flex.flex-col {
  gap: 0.5rem;
}

/* Input shell — mirrors .jds-input-text__input-wrapper */
::v-deep .step-two-input-jds > div:nth-child(2) {
  transition: border-color 0.3s ease-out;
  background-color: #fff;
}

::v-deep .step-two-input-jds > div:nth-child(2):has(input:placeholder-shown) {
  background-color: #fafafa;
}

/* Default border: gray-500 (JDS) instead of gray-400; keep focus/error utilities */
::v-deep .step-two-input-jds > div:nth-child(2).border-gray-400:not(.border-green-700):not(.border-red-700) {
  border-color: #737373;
}

::v-deep .step-two-input-jds > div:nth-child(2):hover:not(:focus-within):not(.border-red-700) {
  border-color: #15803d;
}

/* Focus ring: green border (from Base) + inset yellow (JDS --focused) */
::v-deep .step-two-input-jds > div:nth-child(2):focus-within:not(.border-red-700) {
  box-shadow: inset 0 0 0 1px #eab308;
}

::v-deep .step-two-input-jds > div:nth-child(2).border-red-700 {
  box-shadow: none;
}

/* Match .citizen__form .jds-input-text input */
::v-deep .step-two-input-jds input {
  background-color: transparent !important;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #616161;
  padding-left: 8px;
  padding-right: 8px;
}

::v-deep .step-two-input-jds input::-webkit-outer-spin-button,
::v-deep .step-two-input-jds input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

::v-deep .step-two-input-jds input[type='number'] {
  -moz-appearance: textfield;
}
</style>
