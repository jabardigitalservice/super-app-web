<template>
  <ValidationObserver ref="observer">
    <section class="grid grid-cols-1 gap-x-8 gap-y-4 mb-4">
    <!-- Foto Profil (tidak bisa diedit) -->
    <div class="flex flex-col items-left mb-4">
      <img :src="avatarUrl || '/images/ilustrasi-ktp.webp'" alt="avatar" class="w-24 h-24 rounded-full object-cover" />
    </div>

    <!-- Nama Pengusul -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="required" name="Nama Pengusul" vid="name">
      <label>Nama Pengusul <span class="text-red-500">*</span></label>
      <JdsInputText :value="setName" :error-message="errors[0]" @input="setName = $event" />
    </ValidationProvider>

    <!-- No HP Pengusul -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="required" name="No HP Pengusul" vid="phone">
      <label>No HP Pengusul <span class="text-red-500">*</span></label>
      <JdsInputText :value="setPhone" inputmode="numeric" type="number" :error-message="errors[0]" @input="setPhone = $event" />
    </ValidationProvider>

    <!-- Email Pribadi — OPSIONAL, EDITABLE -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="email" name="Email Pribadi" vid="email">
      <label>Email Pribadi</label>
      <JdsInputText :value="setEmail" :error-message="errors[0]" @input="setEmail = $event" />
    </ValidationProvider>

    <!-- NIK — WAJIB -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="required|numeric|length:16" name="NIK" vid="nik">
      <label>NIK <span class="text-red-500">*</span></label>
      <JdsInputText :value="setNik" :error-message="errors[0]" @input="setNik = $event" />
    </ValidationProvider>

    <!-- Nomor KK — WAJIB -->
    <ValidationProvider v-slot="{ errors }" class="flex flex-col gap-2 mb-5" rules="required|numeric|length:16" name="Nomor KK" vid="nomorKk">
      <label>Nomor KK <span class="text-red-500">*</span></label>
      <JdsInputText :value="setNomorKk" :error-message="errors[0]" @input="setNomorKk = $event" />
    </ValidationProvider>
    </section>
  </ValidationObserver>
</template>

<script>
export default {
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
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'nik', value: val })
      },
    },
    setNomorKk: {
      get() {
        return this.$store.state.imahAingForm.dataPengusul.nomorKk
      },
      set(val) {
        this.$store.commit('imahAingForm/SET_DATA_PENGUSUL_FIELD', { field: 'nomorKk', value: val })
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
