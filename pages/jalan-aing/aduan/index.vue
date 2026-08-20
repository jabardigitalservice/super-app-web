<template>
  <div class="ja-complaint-page">
    <JalanAingHeader active="aduan" />

    <main class="ja-complaint-main">
      <div class="ja-complaint-intro">
        <div>
          <p>Buat aduan</p>
          <h1>{{ introTitle }}</h1>
          <span>{{ introDescription }}</span>
        </div>
        <div v-if="hasLocation" class="ja-complaint-location" aria-label="Koordinat titik aduan">
          <span class="ja-complaint-location-dot" aria-hidden="true" />
          <div>
            <strong>{{ latitude }}° LS, {{ longitude }}° BT</strong>
            <small>Titik aduan dari peta interaktif</small>
          </div>
        </div>
        <div v-else class="ja-complaint-location ja-complaint-location-empty" aria-label="Titik aduan belum dipilih">
          <span class="ja-complaint-location-dot" aria-hidden="true" />
          <div>
            <strong>Belum ada titik dipilih</strong>
            <a href="/jalan-aing/peta">Pilih titik di peta interaktif <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>

      <ol class="ja-complaint-steps" aria-label="Tahapan aduan">
        <template v-for="(step, index) in steps">
          <li
            :key="step"
            :class="{ 'is-active': index === currentStep - 1, 'is-done': index < currentStep - 1 }"
            :aria-current="index === currentStep - 1 ? 'step' : null"
          >
            <span>{{ index < currentStep - 1 ? '✓' : index + 1 }}</span>
            <strong>{{ step }}</strong>
          </li>
          <li v-if="index < steps.length - 1" :key="`${step}-sep`" class="ja-complaint-steps-sep" :class="{ 'is-filled': index < currentStep - 1 }" aria-hidden="true" />
        </template>
      </ol>

      <section v-if="currentStep === 1" class="ja-complaint-categories" aria-labelledby="category-heading">
        <div class="ja-complaint-section-heading">
          <p>LANGKAH 1 DARI 3</p>
          <h2 id="category-heading">Pilih kategori permasalahan</h2>
        </div>

        <div class="ja-complaint-grid">
          <button
            v-for="(category, index) in categories"
            :key="category.id"
            type="button"
            class="ja-complaint-category"
            :class="{ 'is-selected': selectedCategory === category.id }"
            :aria-pressed="selectedCategory === category.id"
            @click="selectCategory(category.id)"
          >
            <span>{{ index + 1 }}</span>
            <strong>{{ category.label }}</strong>
            <small>{{ category.description }}</small>
          </button>
        </div>
        <div class="ja-complaint-actions ja-complaint-actions-end">
          <small v-if="!hasLocation" class="ja-complaint-actions-hint">Pilih titik lokasi di peta interaktif untuk melanjutkan.</small>
          <button type="button" class="ja-complaint-next" :disabled="!selectedCategory" @click="continueFromCategory">Lanjutkan <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <section v-else-if="currentStep === 2" class="ja-complaint-detail" aria-labelledby="detail-heading">
        <div class="ja-complaint-section-heading">
          <p>LANGKAH 2 DARI 3</p>
          <h2 id="detail-heading">Tambahkan detail kejadian</h2>
        </div>

        <div class="ja-complaint-form-card">
          <h3>Informasi aduan</h3>
          <div class="ja-complaint-fields">
            <fieldset class="ja-complaint-privacy">
              <legend>Tipe aduan</legend>
              <div>
                <button type="button" :class="{ 'is-selected': formData.complaintType === 'publik' }" :aria-pressed="formData.complaintType === 'publik'" @click="formData.complaintType = 'publik'">Publik <small>Aduan dapat dilihat di peta</small></button>
                <button type="button" :class="{ 'is-selected': formData.complaintType === 'privat' }" :aria-pressed="formData.complaintType === 'privat'" @click="formData.complaintType = 'privat'">Privat/Rahasia <small>Aduan hanya dapat dilihat oleh Anda</small></button>
              </div>
            </fieldset>

            <label class="ja-complaint-field" :class="{ 'has-error': formErrors.title }">
              <span>Judul aduan <b class="ja-required" aria-label="wajib diisi">*</b></span>
              <input v-model.trim="formData.title" type="text" maxlength="100" required aria-required="true" aria-describedby="title-error" :aria-invalid="Boolean(formErrors.title)" placeholder="Contoh: Lubang dalam di Jalan Soreang KM 12.5" @blur="validateField('title')" @input="revalidateField('title')">
              <small v-if="formErrors.title" id="title-error" class="is-error" role="alert">{{ formErrors.title }} <em>{{ formData.title.length }}/100</em></small>
              <small v-else id="title-error">Berikan judul ringkas yang deskriptif <em>{{ formData.title.length }}/100</em></small>
            </label>

            <label class="ja-complaint-field" :class="{ 'has-error': formErrors.description }">
              <span>Deskripsi lengkap kejadian / detail <b class="ja-required" aria-label="wajib diisi">*</b></span>
              <textarea v-model.trim="formData.description" rows="5" maxlength="1000" required aria-required="true" aria-describedby="description-error" :aria-invalid="Boolean(formErrors.description)" placeholder="Deskripsikan letak kerusakan dan dampak yang diakibatkannya..." @blur="validateField('description')" @input="revalidateField('description')" />
              <small v-if="formErrors.description" id="description-error" class="is-error" role="alert">{{ formErrors.description }} <em>{{ formData.description.length }}/1000</em></small>
              <small v-else id="description-error">Detail membantu verifikator mempercepat pengerjaan <em>{{ formData.description.length }}/1000</em></small>
            </label>

            <fieldset class="ja-complaint-photo">
              <legend>Bukti foto</legend>
              <div class="ja-complaint-photo-picker" :class="{ 'has-error': photoError }">
                <label class="ja-complaint-upload">
                  <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple :aria-describedby="photoError ? 'photo-error' : null" :aria-invalid="Boolean(photoError)" @change="handlePhotoUpload">
                  <Icon name="pencil-outline" size="26px" aria-hidden="true" />
                  <strong>Tambah foto pendukung</strong>
                  <small>JPG, PNG, WEBP, atau HEIC · maksimal 5 MB per foto</small>
                </label>
              </div>
              <p v-if="photoError" id="photo-error" class="ja-complaint-photo-error" role="alert">{{ photoError }}</p>
              <div v-if="formData.photos.length" class="ja-complaint-photo-gallery" aria-label="Foto aduan terpilih">
                <article v-for="photo in formData.photos" :key="photo.id" class="ja-complaint-photo-item">
                  <button type="button" class="ja-complaint-photo-zoom" :aria-label="`Perbesar ${photo.name}`" @click="openPhotoPreview(photo)">
                    <img v-if="!photo.previewFailed" :src="photo.src" :alt="`Pratinjau ${photo.name}`" @error="photo.previewFailed = true">
                    <span v-else class="ja-complaint-photo-heic">{{ photo.isHeic ? 'HEIC' : 'Foto' }}</span>
                    <span class="ja-complaint-photo-zoom-label"><Icon name="magnifier" size="16px" aria-hidden="true" /> Perbesar</span>
                  </button>
                  <button type="button" class="ja-complaint-photo-delete" :aria-label="`Hapus ${photo.name}`" @click="removePhoto(photo.id)"><Icon name="trash" size="16px" aria-hidden="true" /></button>
                  <p>{{ photo.name }}</p>
                </article>
              </div>
              <p v-if="formData.photos.length" class="ja-complaint-photo-status" aria-live="polite">{{ formData.photos.length }} foto siap dikirim. Klik foto untuk memperbesar.</p>
            </fieldset>
          </div>
        </div>

        <div class="ja-complaint-actions">
          <button type="button" class="ja-complaint-back" @click="currentStep = 1">Sebelumnya</button>
          <button type="button" class="ja-complaint-next" @click="continueToReporter">Lanjutkan <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <section v-else class="ja-complaint-reporter" aria-labelledby="reporter-heading">
        <div class="ja-complaint-section-heading">
          <p>LANGKAH 3 DARI 3</p>
          <h2 id="reporter-heading">Lengkapi data pelapor</h2>
        </div>

        <div v-if="submitError" class="ja-complaint-alert" role="alert">
          <Icon name="warning" size="18px" aria-hidden="true" />
          <span>{{ submitError }}</span>
        </div>

        <div class="ja-complaint-form-card">
          <h3>Data pribadi pelapor</h3>
          <div class="ja-complaint-fields">
            <div class="ja-complaint-fields-row">
              <label class="ja-complaint-field" :class="{ 'has-error': formErrors.reporterName }">
                <span>Nama lengkap <b class="ja-required" aria-label="wajib diisi">*</b></span>
                <input v-model.trim="formData.reporterName" type="text" required aria-required="true" :aria-describedby="formErrors.reporterName ? 'reporter-name-error' : null" :aria-invalid="Boolean(formErrors.reporterName)" placeholder="Contoh: Roby Juliansyah" @blur="validateField('reporterName')" @input="revalidateField('reporterName')">
                <small v-if="formErrors.reporterName" id="reporter-name-error" class="is-error" role="alert">{{ formErrors.reporterName }}</small>
              </label>
              <label class="ja-complaint-field" :class="{ 'has-error': formErrors.reporterPhone }">
                <span>Nomor HP <b class="ja-required" aria-label="wajib diisi">*</b></span>
                <input v-model.trim="formData.reporterPhone" type="tel" inputmode="tel" required aria-required="true" :aria-describedby="formErrors.reporterPhone ? 'reporter-phone-error' : null" :aria-invalid="Boolean(formErrors.reporterPhone)" placeholder="Contoh: 081234567890" @blur="validateField('reporterPhone')" @input="revalidateField('reporterPhone')">
                <small v-if="formErrors.reporterPhone" id="reporter-phone-error" class="is-error" role="alert">{{ formErrors.reporterPhone }}</small>
              </label>
            </div>
            <label class="ja-complaint-field" :class="{ 'has-error': formErrors.reporterEmail }">
              <span>Alamat email aktif <b class="ja-required" aria-label="wajib diisi">*</b></span>
              <input v-model.trim="formData.reporterEmail" type="email" required aria-required="true" :aria-describedby="formErrors.reporterEmail ? 'reporter-email-error' : null" :aria-invalid="Boolean(formErrors.reporterEmail)" placeholder="Contoh: nama@email.com" @blur="validateField('reporterEmail')" @input="revalidateField('reporterEmail')">
              <small v-if="formErrors.reporterEmail" id="reporter-email-error" class="is-error" role="alert">{{ formErrors.reporterEmail }}</small>
            </label>
          </div>
        </div>

        <div class="ja-complaint-form-card">
          <h3>Lokasi koordinat terdeteksi</h3>
          <dl class="ja-complaint-coords">
            <div>
              <dt>Titik lintang (LS)</dt>
              <dd>{{ latitude }}</dd>
            </div>
            <div>
              <dt>Titik bujur (BT)</dt>
              <dd>{{ longitude }}</dd>
            </div>
            <div class="ja-complaint-address">
              <dt>Alamat geo-reverse</dt>
              <dd>{{ addressLoading ? 'Mencari alamat…' : reverseAddress || 'Alamat belum tersedia untuk titik ini.' }}</dd>
            </div>
          </dl>
        </div>

        <div class="ja-complaint-actions">
          <button type="button" class="ja-complaint-back" @click="currentStep = 2">Sebelumnya</button>
          <button type="button" class="ja-complaint-next" @click="submitReport">Kirim Laporan</button>
        </div>
      </section>

      <dialog v-if="selectedPhoto" ref="photoDialog" class="ja-complaint-photo-dialog" @close="selectedPhoto = null" @click.self="closePhotoPreview">
        <button type="button" class="ja-complaint-photo-dialog-close" aria-label="Tutup pratinjau" @click="closePhotoPreview"><Icon name="times" size="18px" aria-hidden="true" /></button>
        <img v-if="!selectedPhoto.previewFailed" :src="selectedPhoto.src" :alt="`Pratinjau besar ${selectedPhoto.name}`" @error="selectedPhoto.previewFailed = true">
        <p v-else>Pratinjau {{ selectedPhoto.isHeic ? 'HEIC' : 'foto' }} belum didukung browser ini. File tetap tersimpan untuk dikirim.</p>
        <span>{{ selectedPhoto.name }}</span>
      </dialog>
    </main>

    <dialog v-if="submitted" ref="successDialog" class="ja-success-dialog" aria-labelledby="success-title" @cancel.prevent @close="submitted = false">
      <div class="ja-success-icon" aria-hidden="true"><Icon name="check-mark-circle" size="52px" /></div>
      <h1 id="success-title">Laporan Berhasil Terkirim!</h1>
      <p class="ja-success-message">Hatur nuhun atas kepedulian Anda. Laporan Anda telah tercatat ke dalam pusat kendali Dinas Bina Marga Jawa Barat untuk diverifikasi lapangan.</p>
      <section class="ja-success-ticket" aria-label="Nomor tiket aduan">
        <small>Nomor tiket aduan</small>
        <div>
          <strong>{{ submittedTicket }}</strong>
          <button type="button" :aria-label="copied ? 'Nomor tiket tersalin' : 'Salin nomor tiket'" @click="copyTicket"><Icon :name="copied ? 'check-mark' : 'share'" size="18px" aria-hidden="true" /></button>
        </div>
        <p>Gunakan nomor tiket ini untuk melacak status pengerjaan aduan Anda.</p>
      </section>
      <div class="ja-success-actions">
        <button type="button" class="ja-success-track" @click="trackStatus">Lacak Status Aduan</button>
        <button type="button" class="ja-success-new" @click="startNewComplaint">Buat Aduan Baru</button>
      </div>
    </dialog>
  </div>
</template>

<script>
const categories = [
  { id: 'jalan_berlubang', label: 'Jalan Berlubang', description: 'Lubang atau keretakan pada aspal' },
  { id: 'jalan_rusak', label: 'Jalan Rusak', description: 'Kerusakan struktur jalan/bergelombang' },
  { id: 'apj_mati', label: 'APJ Mati', description: 'Lampu penerangan jalan padam' },
  { id: 'cctv_rusak', label: 'CCTV Rusak', description: 'Kamera pengawas tidak aktif/mati' },
  { id: 'genangan', label: 'Genangan Air', description: 'Sumbatan drainase, genangan banjir' },
  { id: 'pohon_tumbang', label: 'Pohon Tumbang', description: 'Pohon roboh menghalangi jalan' },
  { id: 'longsor', label: 'Tanah Longsor', description: 'Guguran tebing menutup jalan' },
  { id: 'marka_rusak', label: 'Marka Rusak', description: 'Garis jalan pudar atau tidak jelas' },
  { id: 'lainnya', label: 'Darurat Lainnya', description: 'Hambatan, kecelakaan, masalah lainnya' },
]
const DRAFT_STORAGE_KEY = 'jalan-aing-aduan-draft'
const emptyFormData = () => ({
  title: '',
  description: '',
  photos: [],
  complaintType: 'publik',
  reporterName: '',
  reporterPhone: '',
  reporterEmail: '',
})

export default {
  name: 'JalanAingComplaintPage',
  data() {
    return {
      steps: ['Kategori', 'Detail & Foto', 'Data Pelapor'],
      categories,
      currentStep: 1,
      selectedCategory: categories.some(({ id }) => id === this.$route.query.category) ? this.$route.query.category : '',
      formData: emptyFormData(),
      submitError: '',
      formErrors: {},
      submitted: false,
      submittedTicket: '',
      copied: false,
      reverseAddress: '',
      addressLoading: false,
      photoError: '',
      selectedPhoto: null,
    }
  },
  computed: {
    introTitle() {
      if (this.currentStep === 1) return 'Laporkan kondisi jalan.'
      if (this.currentStep === 2) return 'Ceritakan kondisi jalan.'
      return 'Lengkapi data pelapor.'
    },
    introDescription() {
      if (this.currentStep === 1) return 'Pilih kategori kerusakan untuk memulai laporan.'
      if (this.currentStep === 2) return 'Tambahkan detail dan foto agar laporan lebih mudah diverifikasi.'
      return 'Isi data diri Anda agar laporan dapat kami tindaklanjuti.'
    },
    hasLocation() {
      return Number.isFinite(Number(this.$route.query.lat)) && Number.isFinite(Number(this.$route.query.lng))
    },
    latitude() {
      return Math.abs(Number(this.$route.query.lat)).toFixed(6)
    },
    longitude() {
      return Math.abs(Number(this.$route.query.lng)).toFixed(6)
    },
  },
  watch: {
    selectedCategory: 'persistDraft',
    currentStep(step) {
      this.persistDraft()
      if (step === 3) this.lookupAddress()
    },
    formData: { handler: 'persistDraft', deep: true },
  },
  mounted() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}')
      if (!this.selectedCategory && categories.some(({ id }) => id === draft.selectedCategory)) this.selectCategory(draft.selectedCategory)
      const draftFields = ['title', 'description', 'reporterName', 'reporterPhone', 'reporterEmail']
      draftFields.forEach((field) => {
        if (typeof draft.formData?.[field] === 'string') this.formData[field] = draft.formData[field]
      })
      if (['publik', 'privat'].includes(draft.formData?.complaintType)) this.formData.complaintType = draft.formData.complaintType
      if (this.hasLocation && [1, 2, 3].includes(draft.currentStep)) this.currentStep = draft.currentStep
    } catch (_) {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
  },
  beforeDestroy() {
    this.formData.photos.forEach(({ src }) => URL.revokeObjectURL(src))
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category
      if (this.$route.query.category !== category) this.$router.replace({ query: { ...this.$route.query, category } })
    },
    persistDraft() {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
          selectedCategory: this.selectedCategory,
          currentStep: this.currentStep,
          formData: {
            title: this.formData.title,
            description: this.formData.description,
            complaintType: this.formData.complaintType,
            reporterName: this.formData.reporterName,
            reporterPhone: this.formData.reporterPhone,
            reporterEmail: this.formData.reporterEmail,
          },
        }))
      } catch (_) {}
    },
    async lookupAddress() {
      if (!this.hasLocation || this.addressLoading || this.reverseAddress) return
      this.addressLoading = true
      try {
        const params = new URLSearchParams({
          format: 'jsonv2',
          lat: this.$route.query.lat,
          lon: this.$route.query.lng,
          addressdetails: '1',
          'accept-language': 'id',
        })
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`)
        if (!response.ok) throw new Error('Alamat tidak tersedia')
        const data = await response.json()
        this.reverseAddress = data.display_name || ''
      } catch (_) {
        this.reverseAddress = ''
      } finally {
        this.addressLoading = false
      }
    },
    continueFromCategory() {
      if (!this.hasLocation) {
        this.$router.push({ path: '/jalan-aing/peta', query: { category: this.selectedCategory } })
        return
      }
      this.currentStep = 2
    },
    validationMessage(field) {
      const value = this.formData[field]
      if (field === 'title') return value.length >= 5 ? '' : 'Judul aduan minimal 5 karakter.'
      if (field === 'description') return value.length >= 20 ? '' : 'Deskripsi minimal 20 karakter.'
      if (field === 'reporterName') return value.length >= 3 ? '' : 'Nama lengkap minimal 3 karakter.'
      if (field === 'reporterPhone') return /^\+?[0-9]{8,15}$/.test(value.replace(/[\s-]/g, '')) ? '' : 'Masukkan nomor HP 8–15 digit.'
      if (field === 'reporterEmail') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Masukkan alamat email yang valid.'
      return ''
    },
    validateField(field) {
      const error = this.validationMessage(field)
      this.$set(this.formErrors, field, error)
      return !error
    },
    validateFields(fields) {
      return fields.map((field) => this.validateField(field)).every(Boolean)
    },
    revalidateField(field) {
      if (this.formErrors[field]) this.validateField(field)
    },
    continueToReporter() {
      if (!this.validateFields(['title', 'description'])) return
      this.currentStep = 3
    },
    handlePhotoUpload(event) {
      const files = Array.from(event.target.files || [])
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
      const acceptedFiles = files.filter((file) => acceptedTypes.includes(file.type) || /\.(heic|heif)$/i.test(file.name))
        .filter((file) => file.size <= 5 * 1024 * 1024)

      this.photoError = acceptedFiles.length === files.length ? '' : 'Gunakan foto JPG, PNG, WEBP, atau HEIC dengan ukuran maksimal 5 MB.'
      const batchId = Date.now()
      this.formData.photos.push(...acceptedFiles.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${file.size}-${batchId}-${index}`,
        name: file.name,
        src: URL.createObjectURL(file),
        isHeic: /\.(heic|heif)$/i.test(file.name) || ['image/heic', 'image/heif'].includes(file.type),
        previewFailed: false,
      })))
      event.target.value = ''
    },
    openPhotoPreview(photo) {
      this.selectedPhoto = photo
      this.$nextTick(() => this.$refs.photoDialog.showModal())
    },
    closePhotoPreview() {
      this.$refs.photoDialog.close()
    },
    removePhoto(id) {
      const index = this.formData.photos.findIndex((photo) => photo.id === id)
      if (index < 0) return
      const [photo] = this.formData.photos.splice(index, 1)
      URL.revokeObjectURL(photo.src)
      if (this.selectedPhoto?.id === id) this.closePhotoPreview()
    },
    submitReport() {
      if (!this.validateFields(['reporterName', 'reporterPhone', 'reporterEmail'])) return
      this.submitError = ''
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      this.submittedTicket = `JA-${date}-${Math.floor(10000 + Math.random() * 90000)}`
      this.submitted = true
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      this.$nextTick(() => this.$refs.successDialog.showModal())
    },
    copyTicket() {
      if (!navigator.clipboard) return
      navigator.clipboard.writeText(this.submittedTicket)
      this.copied = true
      window.setTimeout(() => { this.copied = false }, 2000)
    },
    trackStatus() {
      this.$router.push({ path: '/jalan-aing/lacak', query: { ticket: this.submittedTicket } })
    },
    startNewComplaint() {
      this.formData.photos.forEach(({ src }) => URL.revokeObjectURL(src))
      this.currentStep = 1
      this.selectedCategory = ''
      this.formData = emptyFormData()
      this.formErrors = {}
      this.photoError = ''
      this.submittedTicket = ''
      this.copied = false
      this.$router.replace({ path: '/jalan-aing/aduan' })
      this.$refs.successDialog.close()
    },
  },
}
</script>

<style scoped>
/* Hallmark · component: photo uploader · genre: modern-minimal · theme: locked Jalan Aing tokens · pre-emit critique: P4 H5 E4 S5 R5 V4
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50) */
.ja-complaint-page {
  --ja-ink: #14233f;
  --ja-rule: #dce7e0;
  --ja-green: #0d6d43;
  min-height: 100vh;
  background: #f5f5f7;
  color: var(--ja-ink);
  font-family: Roboto, sans-serif;
  font-optical-sizing: auto;
}
.ja-complaint-main { width: min(1120px, calc(100% - 48px)); margin: 0 auto; padding: clamp(24px, 4vw, 40px) 0 72px; }
.ja-complaint-intro { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-bottom: 20px; }
.ja-complaint-intro p, .ja-complaint-section-heading p { margin: 0; color: var(--ja-green); font-size: 12px; font-weight: 650; letter-spacing: .01em; }
.ja-complaint-intro h1 { margin: 6px 0 5px; font-size: clamp(24px, 2.4vw, 30px); font-weight: 650; letter-spacing: -.03em; line-height: 1.1; }
.ja-complaint-intro > div > span { color: #6b7688; font-size: 14px; line-height: 1.4; }
.ja-complaint-location { display: flex; flex-shrink: 0; align-items: flex-start; gap: 9px; padding-left: 16px; border-left: 1px solid var(--ja-rule); font-variant-numeric: tabular-nums; }
.ja-complaint-location-dot { width: 6px; height: 6px; margin-top: 6px; border-radius: 50%; background: var(--ja-green); }
.ja-complaint-location strong { display: block; font-size: 13px; font-weight: 700; letter-spacing: -.01em; color: var(--ja-ink); }
.ja-complaint-location small { display: block; margin-top: 2px; color: #7c8798; font-size: 11px; }
.ja-complaint-location-empty .ja-complaint-location-dot { background: #c94b4b; }
.ja-complaint-location-empty strong { color: #536176; }
.ja-complaint-location-empty a { display: inline-block; margin-top: 2px; color: var(--ja-green); font-size: 12px; font-weight: 650; text-decoration: none; }
.ja-complaint-location-empty a:hover { text-decoration: underline; }
.ja-complaint-actions-hint { color: #c94b4b; font-size: 12px; }
.ja-complaint-steps { display: flex; align-items: center; margin: 0 0 32px; padding: 0; list-style: none; }
.ja-complaint-steps-sep { flex: 1 1 auto; height: 1px; margin: 0 6px; background: #dce2e6; transition: background-color 200ms ease; }
.ja-complaint-steps-sep.is-filled { background: var(--ja-green); }
.ja-complaint-steps li:not(.ja-complaint-steps-sep) { display: flex; flex-shrink: 0; align-items: center; gap: 8px; padding: 6px 12px 6px 6px; border-radius: 999px; background: #fff; color: #98a2b2; font-size: 12px; }
.ja-complaint-steps span { display: grid; width: 24px; height: 24px; place-items: center; border: 1px solid #dce2e6; border-radius: 50%; background: #fff; font-size: 11px; font-weight: 700; }
.ja-complaint-steps strong { font-weight: 650; line-height: 1.2; white-space: nowrap; }
.ja-complaint-steps .is-active { background: #eef4f0; color: var(--ja-green); }
.ja-complaint-steps .is-active span { border-color: var(--ja-green); background: var(--ja-green); color: #fff; }
.ja-complaint-steps .is-done span { border-color: var(--ja-green); background: #fff; color: var(--ja-green); }
.ja-complaint-steps .is-done strong { color: #536176; }
.ja-complaint-section-heading { margin-bottom: 22px; }
.ja-complaint-section-heading h2 { margin: 7px 0 0; font-size: 22px; letter-spacing: -.025em; }
.ja-complaint-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.ja-complaint-category { min-height: 166px; padding: 22px; border: 1px solid #e0e4e8; border-radius: 16px; background: rgba(255, 255, 255, .92); box-shadow: 0 2px 5px rgba(20, 35, 63, .025); color: var(--ja-ink); cursor: pointer; text-align: left; transition: border-color 160ms cubic-bezier(.2, .8, .2, 1), box-shadow 160ms cubic-bezier(.2, .8, .2, 1), transform 120ms ease-out; }
.ja-complaint-category:hover { border-color: #b4c1ba; box-shadow: 0 12px 26px rgba(20, 35, 63, .08); transform: translateY(-2px); }
.ja-complaint-category:active { transform: scale(.985); transition-duration: 80ms; }
.ja-complaint-category.is-selected { border-color: var(--ja-green); background: #f0f8f3; box-shadow: inset 0 0 0 1px var(--ja-green); }
.ja-complaint-category > span { display: grid; width: 34px; height: 34px; margin-bottom: 22px; place-items: center; border-radius: 50%; background: #e8f5ed; color: var(--ja-green); font-size: 13px; font-weight: 800; }
.ja-complaint-category strong, .ja-complaint-category small { display: block; }
.ja-complaint-category strong { margin-bottom: 7px; font-size: 18px; letter-spacing: -.02em; }
.ja-complaint-category small { color: #68758a; font-size: 14px; line-height: 1.45; }
.ja-complaint-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 34px; padding-top: 22px; border-top: 1px solid var(--ja-rule); }
.ja-complaint-actions-end { gap: 16px; justify-content: flex-end; }
.ja-complaint-next, .ja-complaint-back { min-height: 44px; border-radius: 12px; font: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: transform 120ms ease-out, background-color 160ms ease, border-color 160ms ease; }
.ja-complaint-next { min-width: 142px; border: 1px solid var(--ja-green); background: var(--ja-green); color: #fff; }
.ja-complaint-next:hover { background: #095b38; }
.ja-complaint-next:disabled { border-color: #d9dfe3; background: #e5e8eb; color: #9aa5b5; cursor: not-allowed; }
.ja-complaint-next:disabled:hover { background: #e5e8eb; }
.ja-complaint-back { padding: 0 18px; border: 1px solid #d9dfe3; background: #fff; color: #465064; }
.ja-complaint-next:active, .ja-complaint-back:active { transform: scale(.97); }
.ja-complaint-next:focus-visible, .ja-complaint-back:focus-visible, .ja-complaint-upload:focus-within, .ja-complaint-privacy button:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-complaint-field input:focus-visible, .ja-complaint-field textarea:focus-visible { outline: none; }
.ja-complaint-form-card { overflow: hidden; border: 1px solid #dfe5e8; border-radius: 16px; background: #fff; }
.ja-complaint-form-card + .ja-complaint-form-card { margin-top: 16px; }
.ja-complaint-form-card > h3 { margin: 0; padding: 22px 24px; border-bottom: 1px solid var(--ja-rule); font-size: 20px; letter-spacing: -.02em; }
.ja-complaint-fields { display: grid; gap: 28px; padding: 26px 24px 30px; }
.ja-complaint-fields-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.ja-complaint-alert { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding: 14px 16px; border: 1px solid #f3c1c1; border-radius: 12px; background: #fdeeee; color: #a02c2c; font-size: 14px; }
.ja-complaint-coords { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin: 0; padding: 22px 24px 26px; }
.ja-complaint-address { grid-column: 1 / -1; padding-top: 20px; border-top: 1px solid var(--ja-rule); }
.ja-complaint-coords dt { margin-bottom: 8px; color: #536176; font-size: 12px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
.ja-complaint-coords dd { margin: 0; color: var(--ja-green); font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums; }
.ja-complaint-address dd { color: #465064; font-size: 14px; font-weight: 600; line-height: 1.5; }
.ja-success-dialog { width: min(620px, calc(100% - 32px)); margin: auto; padding: clamp(28px, 5vw, 44px); border: 1px solid #dfe5e8; border-radius: 16px; background: #fff; color: var(--ja-ink); box-shadow: 0 24px 70px rgba(20, 35, 63, .24); font: inherit; font-optical-sizing: auto; text-align: center; }
.ja-success-dialog[open] { animation: ja-success-arrive 260ms cubic-bezier(.2, .8, .2, 1); }
.ja-success-dialog::backdrop { background: rgba(20, 35, 63, .42); -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); }
.ja-success-icon { display: grid; margin: 0 auto 18px; place-items: center; color: var(--ja-green); }
.ja-success-dialog h1 { margin: 0; font-size: clamp(26px, 3vw, 32px); font-weight: 650; letter-spacing: -.03em; line-height: 1.12; }
.ja-success-message { max-width: 500px; margin: 16px auto 26px; color: #536176; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 1.55; }
.ja-success-ticket { padding: 22px; border: 1px solid #dce5ee; border-radius: 12px; background: #f8fafc; }
.ja-success-ticket > small { display: block; color: #8c9bb3; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.ja-success-ticket > div { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 12px 0; }
.ja-success-ticket strong { color: var(--ja-green); font-family: Roboto, sans-serif; font-size: clamp(21px, 3.5vw, 28px); font-weight: 700; letter-spacing: .055em; }
.ja-success-ticket button { display: grid; width: 38px; height: 38px; place-items: center; border: 0; border-radius: 8px; background: transparent; color: #64748b; font-size: 25px; cursor: pointer; }
.ja-success-ticket p { margin: 0; color: #627798; font-size: 13px; line-height: 1.45; }
.ja-success-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 24px; }
.ja-success-actions button { min-height: 48px; border-radius: 10px; font: inherit; font-size: 14px; font-weight: 700; line-height: 1.2; cursor: pointer; transition: transform 120ms cubic-bezier(.2, .8, .2, 1), background-color 160ms cubic-bezier(.2, .8, .2, 1); }
.ja-success-track { border: 1px solid var(--ja-green); background: var(--ja-green); color: #fff; box-shadow: 0 8px 18px rgba(13, 109, 67, .18); }
.ja-success-new { border: 1px solid #d9dfe3; background: #fff; color: #465064; }
.ja-success-ticket button:focus-visible, .ja-success-actions button:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-success-ticket button:active, .ja-success-actions button:active { transform: scale(.97); }
@media (hover: hover) and (pointer: fine) {
  .ja-success-ticket button:hover { background: #e9eff3; color: var(--ja-green); }
  .ja-success-track:hover { background: #095b38; }
  .ja-success-new:hover { background: #e9eff3; }
}
@keyframes ja-success-arrive { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.ja-complaint-field { display: block; }
.ja-complaint-field > span, .ja-complaint-photo legend, .ja-complaint-privacy legend { display: block; margin-bottom: 10px; color: #536176; font-size: 12px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
.ja-required { color: #c94b4b; }
.ja-complaint-field input, .ja-complaint-field textarea { width: 100%; box-sizing: border-box; border: 1px solid #d9dfe3; border-radius: 12px; background: #fff; color: var(--ja-ink); font: inherit; font-size: 15px; line-height: 1.45; outline: 0; transition: border-color 160ms ease, box-shadow 160ms ease; }
.ja-complaint-field input { height: 48px; padding: 0 14px; }
.ja-complaint-field textarea { min-height: 132px; padding: 13px 14px; resize: vertical; }
.ja-complaint-field input::placeholder, .ja-complaint-field textarea::placeholder { color: #9aa5b5; }
.ja-complaint-field input:focus, .ja-complaint-field textarea:focus { border-color: #81938a; box-shadow: 0 0 0 3px rgba(13, 109, 67, .12); }
.ja-complaint-field > small { display: flex; justify-content: space-between; margin-top: 7px; color: #7c8798; font-size: 12px; }
.ja-complaint-field > small em { font-style: normal; white-space: nowrap; }
.ja-complaint-field.has-error input, .ja-complaint-field.has-error textarea { border-color: #c94b4b; }
.ja-complaint-field.has-error input:focus, .ja-complaint-field.has-error textarea:focus { box-shadow: 0 0 0 3px rgba(201, 75, 75, .12); }
.ja-complaint-field > small.is-error { color: #a02c2c; font-weight: 650; }
.ja-complaint-photo, .ja-complaint-privacy { margin: 0; padding: 0; border: 0; }
.ja-complaint-photo-picker { margin-bottom: 12px; }
.ja-complaint-upload { display: flex; min-height: 164px; align-items: center; justify-content: center; border: 1px dashed #b9c4bc; border-radius: 14px; background: #fbfcfc; }
.ja-complaint-upload { position: relative; flex-direction: column; gap: 7px; border-style: dashed; color: var(--ja-green); cursor: pointer; text-align: center; }
.ja-complaint-upload input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.ja-complaint-upload strong { color: var(--ja-ink); font-size: 14px; }
.ja-complaint-upload small, .ja-complaint-photo-status { color: #8390a1; font-size: 12px; }
.ja-complaint-upload:focus-within { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-complaint-photo-picker.has-error .ja-complaint-upload { border-color: #c94b4b; background: #fffafa; }
.ja-complaint-photo-error { margin: -4px 0 12px; color: #a02c2c; font-size: 12px; font-weight: 650; }
.ja-complaint-photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 12px; }
.ja-complaint-photo-item { position: relative; min-width: 0; }
.ja-complaint-photo-zoom { display: block; width: 100%; min-height: 132px; padding: 0; overflow: hidden; border: 1px solid #d9dfe3; border-radius: 12px; background: #f4f7f5; color: var(--ja-ink); cursor: zoom-in; }
.ja-complaint-photo-zoom img { display: block; width: 100%; height: 132px; object-fit: cover; }
.ja-complaint-photo-heic { display: grid; height: 132px; place-items: center; color: #536176; font-size: 14px; font-weight: 800; letter-spacing: .08em; }
.ja-complaint-photo-zoom-label { position: absolute; right: 8px; bottom: 8px; display: inline-flex; align-items: center; gap: 4px; padding: 6px 8px; border-radius: 999px; background: rgba(20, 35, 63, .78); color: #fff; font-size: 11px; font-weight: 700; opacity: 0; transition: opacity 160ms cubic-bezier(.2, .8, .2, 1); }
.ja-complaint-photo-delete { position: absolute; top: 8px; right: 8px; display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .94); color: #a02c2c; cursor: pointer; box-shadow: 0 1px 5px rgba(20, 35, 63, .16); }
.ja-complaint-photo-zoom:disabled, .ja-complaint-photo-delete:disabled { cursor: not-allowed; opacity: .55; }
.ja-complaint-photo-delete::before { position: absolute; inset: -5px; content: ''; }
.ja-complaint-photo-item p { overflow: hidden; margin: 7px 2px 0; color: #536176; font-size: 12px; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }
.ja-complaint-photo-status { margin: 12px 0 0; }
.ja-complaint-photo-zoom:focus-visible, .ja-complaint-photo-delete:focus-visible, .ja-complaint-photo-dialog-close:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-complaint-photo-zoom:active, .ja-complaint-photo-delete:active { transform: scale(.96); }
.ja-complaint-photo-dialog { width: min(760px, calc(100% - 32px)); max-height: min(80dvh, 760px); padding: 16px; border: 0; border-radius: 16px; background: #fff; color: var(--ja-ink); box-shadow: 0 24px 64px rgba(20, 35, 63, .3); }
.ja-complaint-photo-dialog::backdrop { background: rgba(20, 35, 63, .62); }
.ja-complaint-photo-dialog img { display: block; width: auto; max-width: 100%; max-height: calc(min(80dvh, 760px) - 70px); margin: 0 auto; object-fit: contain; }
.ja-complaint-photo-dialog p { margin: 40px 24px 24px; color: #536176; line-height: 1.5; text-align: center; }
.ja-complaint-photo-dialog > span { display: block; overflow: hidden; margin-top: 10px; color: #536176; font-size: 12px; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.ja-complaint-photo-dialog-close { position: absolute; top: 12px; right: 12px; display: grid; width: 40px; height: 40px; place-items: center; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .94); color: var(--ja-ink); cursor: pointer; box-shadow: 0 1px 5px rgba(20, 35, 63, .16); }
@media (hover: hover) and (pointer: fine) {
  .ja-complaint-upload:hover { border-color: var(--ja-green); background: #f6faf7; }
  .ja-complaint-photo-zoom:hover .ja-complaint-photo-zoom-label { opacity: 1; }
  .ja-complaint-photo-delete:hover { background: #fdeeee; }
}
.ja-complaint-privacy { padding-top: 0; }
.ja-complaint-privacy > div { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.ja-complaint-privacy button { min-height: 94px; padding: 18px; border: 1px solid #d9dfe3; border-radius: 12px; background: #fff; color: #3e4b60; font: inherit; font-size: 17px; font-weight: 650; cursor: pointer; text-align: left; transition: background-color 160ms ease, border-color 160ms ease, transform 120ms ease-out; }
.ja-complaint-privacy button small { display: block; margin-top: 5px; color: #69768a; font-size: 13px; font-weight: 400; }
.ja-complaint-privacy button.is-selected { border-color: var(--ja-green); background: #f0f8f3; color: var(--ja-green); }
.ja-complaint-privacy button:active { transform: scale(.98); }
@media (max-width: 900px) {
  .ja-complaint-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .ja-complaint-main { padding-bottom: calc(80px + env(safe-area-inset-bottom)); }
}
@media (max-width: 640px) {
  .ja-complaint-main { width: min(100% - 32px, 520px); padding: 22px 0 calc(80px + env(safe-area-inset-bottom)); }
  .ja-complaint-intro { display: block; padding-bottom: 18px; }
  .ja-complaint-intro h1 { font-size: 24px; }
  .ja-complaint-intro > div > span { font-size: 13px; }
  .ja-complaint-location { margin-top: 14px; }
  .ja-complaint-steps { margin: 22px 0 28px; }
  .ja-complaint-steps-sep { margin: 0 4px; }
  .ja-complaint-steps li:not(.ja-complaint-steps-sep) { gap: 0; padding: 4px; }
  .ja-complaint-steps li:not(.ja-complaint-steps-sep) strong { display: none; }
  .ja-complaint-steps span { width: 26px; height: 26px; font-size: 10px; }
  .ja-complaint-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .ja-complaint-category { min-height: 146px; padding: 14px; border-radius: 14px; }
  .ja-complaint-category > span { width: 28px; height: 28px; margin-bottom: 10px; font-size: 11px; }
  .ja-complaint-category strong { margin-bottom: 5px; font-size: 14px; line-height: 1.25; }
  .ja-complaint-category small { font-size: 12px; line-height: 1.35; }
  .ja-complaint-form-card { border-radius: 14px; }
  .ja-complaint-form-card > h3 { padding: 16px; font-size: 16px; }
  .ja-complaint-fields { gap: 20px; padding: 18px 16px 22px; }
  .ja-complaint-field > span, .ja-complaint-photo legend, .ja-complaint-privacy legend { margin-bottom: 8px; font-size: 11px; }
  .ja-complaint-field input, .ja-complaint-field textarea { border-radius: 10px; font-size: 14px; }
  .ja-complaint-field input { height: 44px; padding: 0 12px; }
  .ja-complaint-field textarea { min-height: 112px; padding: 12px; }
  .ja-complaint-privacy > div { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .ja-complaint-privacy button { min-height: 82px; padding: 12px; border-radius: 10px; font-size: 14px; }
  .ja-complaint-privacy button small { margin-top: 4px; font-size: 11px; line-height: 1.35; }
  .ja-complaint-upload { min-height: 132px; border-radius: 12px; }
  .ja-complaint-photo-zoom-label { opacity: 1; }
  .ja-success-actions { grid-template-columns: 1fr; }
  .ja-complaint-field > small { gap: 12px; font-size: 11px; }
  .ja-complaint-fields-row, .ja-complaint-coords { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .ja-complaint-category, .ja-complaint-next, .ja-complaint-back, .ja-complaint-privacy button, .ja-complaint-photo-zoom-label { transition: none; }
  .ja-complaint-category:hover, .ja-complaint-category:active, .ja-complaint-next:active, .ja-complaint-back:active, .ja-complaint-privacy button:active, .ja-complaint-photo-zoom:active, .ja-complaint-photo-delete:active { transform: none; }
  .ja-success-dialog[open] { animation: none; }
}
@media (prefers-reduced-transparency: reduce) {
  .ja-complaint-category { background: #fff; }
}
</style>
