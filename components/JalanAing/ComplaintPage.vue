<template>
  <section class="mx-auto max-w-6xl px-4 py-6 font-lato sm:py-10">
    <div v-if="submittedTicket" class="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
        <Icon name="check-mark-circle" size="36px" />
      </div>
      <h2 class="mt-6 text-2xl font-bold text-slate-800">Laporan Berhasil Terkirim!</h2>
      <p class="mt-2 text-sm leading-relaxed text-slate-600">Hatur nuhun atas kepedulian Anda. Laporan Anda telah tercatat untuk diverifikasi lapangan.</p>
      <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor Tiket Aduan</span>
        <div class="mt-3 flex items-center justify-center gap-3">
          <span class="font-mono text-xl font-bold tracking-wider text-jalan-aing-primary">{{ submittedTicket }}</span>
          <button type="button" class="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-jalan-aing-primary" title="Salin tiket" @click="copyTicket">
            {{ copied ? '✓' : '⧉' }}
          </button>
        </div>
        <p class="mt-2 text-[11px] text-slate-500">Gunakan nomor tiket ini untuk melacak status pengerjaan aduan Anda.</p>
      </div>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" class="flex-1 rounded-xl bg-jalan-aing-primary px-6 py-3 font-bold text-white shadow-md transition hover:bg-jalan-aing-primary-dark" @click="$emit('track', submittedTicket)">Lacak Status Aduan</button>
        <button type="button" class="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200" @click="resetForm">Buat Aduan Baru</button>
      </div>
    </div>

    <div v-else>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800">Buat Aduan Baru</h2>
        <p class="mt-1 text-sm text-slate-500">Langkah cepat mengadukan kerusakan jalan di Jawa Barat</p>
      </div>

      <div class="mb-8 overflow-hidden border-b border-slate-100 px-1 py-2 pb-4">
        <ol class="flex w-full min-w-0 items-start px-0 sm:px-2">
          <template v-for="(step, index) in complaintSteps">
            <li :key="step" class="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all" :class="currentStep > index + 1 ? 'bg-emerald-500 text-white' : currentStep === index + 1 ? 'bg-jalan-aing-primary text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'">
                {{ currentStep > index + 1 ? '✓' : index + 1 }}
              </span>
              <span class="text-[10px] font-bold" :class="currentStep >= index + 1 ? 'text-jalan-aing-primary' : 'text-slate-400'">{{ step }}</span>
            </li>
            <li v-if="index < complaintSteps.length - 1" :key="`${step}-connector`" class="mx-1 mt-4 h-0.5 min-w-3 flex-1" :class="currentStep > index + 1 ? 'bg-emerald-500' : 'bg-slate-200'" aria-hidden="true" />
          </template>
        </ol>
      </div>

      <form class="space-y-6" @submit.prevent="submitComplaint">
        <p v-if="validationError" role="alert" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
          <Icon name="warning" size="16px" /> {{ validationError }}
        </p>

        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Kategori Permasalahan:</h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <button v-for="category in categories" :key="category.id" type="button" class="flex min-h-[150px] flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50" :class="formData.category === category.id ? 'border-jalan-aing-primary bg-blue-50/50 ring-2 ring-blue-100' : 'border-slate-200 bg-white'" :aria-pressed="formData.category === category.id" @click="selectCategory(category.id)">
              <span class="text-2xl" aria-hidden="true">{{ category.icon }}</span>
              <span>
                <strong class="block text-sm font-bold text-slate-800">{{ category.label }}</strong>
                <small class="mt-0.5 block text-xs font-medium leading-relaxed text-slate-500">{{ category.description }}</small>
              </span>
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="complaint-title">Judul Aduan</label>
            <input id="complaint-title" v-model="formData.title" type="text" maxlength="100" placeholder="Contoh: Lubang dalam di Jalan Soreang KM 12.5" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-jalan-aing-primary">
            <div class="flex justify-between text-[10px] text-slate-400"><span>* Berikan judul ringkas yang deskriptif</span><span>{{ formData.title.length }}/100</span></div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="complaint-description">Deskripsi Lengkap Kejadian / Detail</label>
            <textarea id="complaint-description" v-model="formData.description" rows="4" maxlength="1000" placeholder="Deskripsikan letak kerusakan dan dampak yang diakibatkannya..." class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-jalan-aing-primary" />
            <div class="flex justify-between text-[10px] text-slate-400"><span>* Detail membantu verifikator mempercepat pengerjaan</span><span>{{ formData.description.length }}/1000</span></div>
          </div>

          <div class="space-y-2">
            <span class="block text-xs font-bold uppercase tracking-wider text-slate-500">Bukti Foto</span>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center transition-all hover:border-jalan-aing-primary hover:bg-blue-50/20">
                <input type="file" accept="image/jpeg,image/png" class="hidden" @change="handlePhotoUpload">
                <span class="text-3xl text-jalan-aing-primary/70" aria-hidden="true">📷</span>
                <span class="text-xs font-bold text-slate-700">Unggah Foto Pendukung</span>
                <span class="text-[10px] font-medium text-slate-400">Format JPG/PNG, Maksimal 5MB</span>
              </label>
              <div class="relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <template v-if="formData.photo">
                  <img :src="formData.photo" alt="Pratinjau foto aduan" class="max-h-[160px] w-full object-cover">
                  <button type="button" class="absolute right-2 top-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-bold text-white transition hover:bg-red-500" @click="formData.photo = null">✕</button>
                </template>
                <span v-else class="text-xs italic text-slate-400">Belum ada foto terpilih</span>
              </div>
            </div>
          </div>

          <fieldset class="space-y-2 border-t border-slate-100 pt-4">
            <legend class="block text-xs font-bold uppercase tracking-wider text-slate-500">Tipe Kerahasiaan Laporan</legend>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" class="rounded-xl border p-3 text-xs font-bold transition-all" :class="formData.complaintType === 'publik' ? 'border-jalan-aing-primary bg-blue-50 text-jalan-aing-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'" @click="formData.complaintType = 'publik'">Publik (Terlihat di peta)</button>
              <button type="button" class="rounded-xl border p-3 text-xs font-bold transition-all" :class="formData.complaintType === 'privat' ? 'border-jalan-aing-primary bg-blue-50 text-jalan-aing-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'" @click="formData.complaintType = 'privat'">Privat (Rahasia)</button>
            </div>
          </fieldset>
        </div>

        <div v-else class="space-y-6">
          <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Data Pribadi Pelapor</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="space-y-2"><span class="block text-xs font-bold text-slate-500">Nama Lengkap</span><input v-model="formData.reporterName" type="text" placeholder="Contoh: Roby Juliansyah" class="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-jalan-aing-primary"></label>
              <label class="space-y-2"><span class="block text-xs font-bold text-slate-500">Nomor HP</span><input v-model="formData.reporterPhone" type="tel" placeholder="Contoh: 081234567890" class="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-jalan-aing-primary"></label>
            </div>
            <label class="block space-y-2"><span class="block text-xs font-bold text-slate-500">Alamat Email Aktif</span><input v-model="formData.reporterEmail" type="email" placeholder="Contoh: nama@email.com" class="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-jalan-aing-primary"></label>
          </div>

          <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Lokasi Koordinat Terdeteksi</h3>
            <div class="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
              <div class="flex items-center justify-between font-medium text-slate-600"><span class="font-bold">Titik Lintang (Lat):</span><span class="font-mono font-bold text-jalan-aing-primary">-6.9175</span></div>
              <div class="flex items-center justify-between border-t border-slate-100 pt-2 font-medium text-slate-600"><span class="font-bold">Titik Bujur (Lng):</span><span class="font-mono font-bold text-jalan-aing-primary">107.6191</span></div>
              <div class="mt-1 flex flex-col gap-1 border-t border-slate-200 pt-2"><span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alamat Geo-reverse</span><span class="text-xs italic font-medium text-slate-700">Jl. Asia Afrika No. 65, Sumur Bandung, Kota Bandung, Jawa Barat 40111</span></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-slate-200 pt-6">
          <button v-if="currentStep > 1" type="button" class="h-10 rounded-lg border border-slate-200 bg-slate-100 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200 sm:h-12 sm:px-6 sm:text-base" @click="previousStep">Sebelumnya</button>
          <span v-else />
          <button v-if="currentStep < complaintSteps.length" type="button" class="h-10 rounded-lg bg-jalan-aing-primary px-4 text-sm font-bold text-white transition hover:bg-jalan-aing-primary-dark sm:h-12 sm:px-6 sm:text-base" @click="nextStep">Selanjutnya <span aria-hidden="true">→</span></button>
          <button v-else type="submit" class="rounded-xl bg-jalan-aing-primary px-8 py-3 font-bold text-white shadow-lg transition hover:bg-jalan-aing-primary-dark">Kirim Laporan <span aria-hidden="true">✓</span></button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
const emptyForm = () => ({
  category: '',
  title: '',
  description: '',
  photo: null,
  complaintType: 'publik',
  reporterName: '',
  reporterPhone: '',
  reporterEmail: '',
})

export default {
  name: 'JalanAingComplaintPage',
  props: {
    complaintSteps: { type: Array, required: true },
  },
  data() {
    return {
      currentStep: 1,
      formData: emptyForm(),
      validationError: '',
      submittedTicket: '',
      copied: false,
      categories: [
        { id: 'jalan_berlubang', label: 'Jalan Berlubang', icon: '🕳️', description: 'Lubang atau keretakan pada aspal' },
        { id: 'jalan_rusak', label: 'Jalan Rusak', icon: '🚧', description: 'Kerusakan struktur jalan/bergelombang' },
        { id: 'apj_mati', label: 'APJ Mati', icon: '💡', description: 'Lampu penerangan jalan padam' },
        { id: 'cctv_rusak', label: 'CCTV Rusak', icon: '📷', description: 'Kamera pengawas tidak aktif/mati' },
        { id: 'genangan', label: 'Genangan Air', icon: '🌧️', description: 'Sumbatan drainase, genangan banjir' },
        { id: 'pohon_tumbang', label: 'Pohon Tumbang', icon: '🌳', description: 'Pohon roboh menghalangi jalan' },
        { id: 'longsor', label: 'Tanah Longsor', icon: '⛰️', description: 'Guguran tebing menutup jalan' },
        { id: 'marka_rusak', label: 'Marka Rusak', icon: '🛣️', description: 'Garis jalan pudar atau tidak jelas' },
        { id: 'lainnya', label: 'Darurat Lainnya', icon: '⚠️', description: 'Hambatan, kecelakaan, masalah lainnya' },
      ],
    }
  },
  methods: {
    selectCategory(category) {
      this.formData.category = category
      this.validationError = ''
    },
    validateStep() {
      if (this.currentStep === 1 && !this.formData.category) return 'Silakan pilih kategori aduan terlebih dahulu.'
      if (this.currentStep === 2) {
        if (!this.formData.title.trim()) return 'Judul aduan wajib diisi.'
        if (!this.formData.description.trim()) return 'Deskripsi detail wajib diisi.'
        if (!this.formData.photo) return 'Wajib mengunggah minimal 1 foto bukti kondisi lapangan.'
      }
      if (this.currentStep === 3) {
        if (!this.formData.reporterName.trim()) return 'Nama lengkap wajib diisi.'
        if (!/^(?:\+62|08)\d{8,12}$/.test(this.formData.reporterPhone.trim())) return 'Format nomor HP tidak valid.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.reporterEmail.trim())) return 'Format email tidak valid.'
      }
      return ''
    },
    nextStep() {
      this.validationError = this.validateStep()
      if (!this.validationError) this.currentStep += 1
    },
    previousStep() {
      this.validationError = ''
      this.currentStep -= 1
    },
    handlePhotoUpload(event) {
      const file = event.target.files?.[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) {
        this.validationError = 'Ukuran foto maksimal 5MB.'
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.validationError = 'Format file harus JPG atau PNG.'
        return
      }
      const reader = new FileReader()
      reader.onload = ({ target }) => {
        this.formData.photo = target.result
        this.validationError = ''
      }
      reader.readAsDataURL(file)
    },
    submitComplaint() {
      this.validationError = this.validateStep()
      if (this.validationError) return
      const today = new Date()
      const date = today.toISOString().slice(0, 10).replace(/-/g, '')
      this.submittedTicket = `JA-${date}-${Math.floor(10000 + Math.random() * 90000)}`
      this.$emit('submitted', this.submittedTicket)
    },
    copyTicket() {
      if (!navigator.clipboard) return
      navigator.clipboard.writeText(this.submittedTicket)
      this.copied = true
      setTimeout(() => { this.copied = false }, 2000)
    },
    resetForm() {
      this.currentStep = 1
      this.formData = emptyForm()
      this.validationError = ''
      this.submittedTicket = ''
      this.copied = false
    },
  },
}
</script>
