<template>
  <div class="px-4 py-4 md:px-7 md:py-5">
    <!-- Loading -->
    <div v-if="loading" class="space-y-3 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-4 bg-gray-200 rounded dark:bg-dark-emphasis-medium" />
    </div>

    <!-- Gagal muat -->
    <div v-else-if="loadError" class="flex flex-col items-start gap-3">
      <p class="text-sm text-red-700 dark:text-red-400">{{ loadError }}</p>
      <div class="flex gap-2">
        <Button variant="primary" @click="$emit('retry')">Coba Lagi</Button>
        <Button variant="secondary" @click="$emit('back')">Kembali</Button>
      </div>
    </div>

    <template v-else-if="item">
      <!-- Info read-only -->
      <dl class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 mb-6">
        <div v-for="row in infoRows" :key="row.label" :class="row.wide ? 'sm:col-span-2' : ''">
          <dt class="text-xs text-gray-500 font-roboto dark:text-dark-text-medium">
            {{ row.label }}
          </dt>
          <dd class="mt-0.5 text-sm text-gray-900 font-roboto break-words dark:text-dark-emphasis-high">
            <span
              v-if="row.badge"
              class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
              :style="{ color: row.badge.hex, backgroundColor: row.badge.hex + '1A' }"
            >
              {{ row.badge.name }}
            </span>
            <template v-else>{{ row.value || '-' }}</template>
          </dd>
        </div>
      </dl>

      <ValidationObserver v-slot="{ invalid }" slim>
        <form class="sanggah__form flex flex-col gap-5" @submit.prevent="onSubmit">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            name="Kategori Sanggah"
            tag="div"
            class="flex flex-col gap-2"
          >
            <label
              for="sanggahCategory"
              class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
            >
              Kategori Sanggah <span class="text-red-500">*</span>
            </label>
            <JdsSelect
              id="sanggahCategory"
              v-model="category"
              placeholder="Pilih Kategori Sanggah"
              :options="categoryOptions"
              :error-message="errors[0]"
            />
          </ValidationProvider>

          <!-- Field dinamis: Data Kependudukan → jenis data + nomor koreksi -->
          <template v-if="showIdFields">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
              name="Jenis Data"
              tag="div"
              class="flex flex-col gap-2"
            >
              <label
                for="sanggahIdType"
                class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
              >
                Jenis Data yang Dikoreksi <span class="text-red-500">*</span>
              </label>
              <JdsSelect
                id="sanggahIdType"
                v-model="idType"
                placeholder="Pilih NIK atau No KK"
                :options="idTypeOptions"
                :error-message="errors[0]"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="idType"
              v-slot="{ errors }"
              :rules="`required|numeric|max:${idMaxLength}`"
              :name="idTypeLabel"
              tag="div"
              class="flex flex-col gap-2"
            >
              <BaseInputText
                v-model="idNumber"
                type="text"
                :label="`${idTypeLabel} yang Benar`"
                required
                :maxlength="idMaxLength"
                :placeholder="`Masukkan ${idTypeLabel} yang benar`"
                autocomplete="off"
                :error="!!errors[0]"
                :error-message="errors[0]"
              />
            </ValidationProvider>
          </template>

          <!-- Field dinamis: Desil → nilai desil yang benar -->
          <ValidationProvider
            v-if="showDesilField"
            v-slot="{ errors }"
            rules="required|numeric"
            name="Desil"
            tag="div"
            class="flex flex-col gap-2"
          >
            <BaseInputText
              v-model="desil"
              type="text"
              label="Desil yang Benar"
              required
              placeholder="Masukkan desil yang benar"
              autocomplete="off"
              :error="!!errors[0]"
              :error-message="errors[0]"
            />
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            name="Deskripsi"
            tag="div"
            class="flex flex-col gap-2"
          >
            <label
              for="sanggahDescription"
              class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
            >
              Deskripsi <span class="text-red-500">*</span>
            </label>
            <textarea
              id="sanggahDescription"
              v-model="description"
              rows="4"
              class="w-full rounded-lg border px-3 py-2 text-sm text-gray-800 dark:bg-dark-emphasis-low dark:text-dark-emphasis-high"
              :class="
                errors[0]
                  ? 'border-red-700 dark:border-red-600'
                  : 'border-gray-300 dark:border-dark-emphasis-medium'
              "
              placeholder="Jelaskan alasan sanggahan"
            />
            <span class="font-lato text-[13px] text-red-700">{{ errors[0] }}</span>
          </ValidationProvider>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high">
              Bukti Sanggah <span class="text-red-500">*</span>
            </span>
            <p class="font-lato text-[12px] leading-[18px] text-gray-600 dark:text-dark-emphasis-high">
              Wajib diunggah. Ukuran maksimal file 2 MB. Format yang didukung adalah .jpg, .jpeg, .png, dan .pdf.
            </p>
            <ValidationProvider
              ref="buktiProvider"
              v-slot="{ errors }"
              tag="div"
              class="flex flex-col gap-y-2"
              name="Bukti Sanggah"
            >
              <BaseDropzone
                id="sanggahBuktiDropzone"
                :accept="buktiAccept"
                :max-size="buktiMaxSize"
                :multiple="false"
                :is-error="errors.length > 0"
                @change="handleUpload"
              />
              <span class="font-lato text-[13px] text-red-700">{{ errors[0] }}</span>
            </ValidationProvider>

            <transition name="slide-fade">
              <div v-if="bukti" class="flex flex-col gap-2">
                <BaseDropzoneUploadProgress
                  :file="bukti.file"
                  :progress="bukti.progress"
                  :status="bukti.status"
                  :image-url="bukti.url"
                  @delete="handleDelete"
                  @retry="handleRetry"
                />
                <span v-if="bukti.errors && bukti.errors.length" class="font-lato text-[13px] text-red-700">
                  {{ bukti.errors[0] }}
                </span>
              </div>
            </transition>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            tag="div"
            class="flex flex-col gap-2"
            name="Pernyataan"
            :rules="{ required: { allowFalse: false } }"
          >
            <div class="flex items-start gap-2">
              <JdsCheckbox v-model="agreement" />
              <label class="text-gray-800 dark:text-dark-emphasis-high font-roboto text-sm">
                {{ agreementText }}
              </label>
            </div>
            <p v-if="errors[0]" class="text-xs text-red-500">{{ errors[0] }}</p>
          </ValidationProvider>

          <div class="grid grid-cols-1 gap-2 md:flex md:justify-between">
            <Button
              class="w-full md:w-fit !justify-center order-2 md:order-1"
              variant="secondary"
              type="button"
              @click="$emit('back')"
            >
              Kembali
            </Button>
            <Button
              class="w-full md:w-fit !justify-center order-1 md:order-2"
              variant="primary"
              type="submit"
              :disabled="invalid || uploadBlocking"
              :loading="statusSubmit === 'LOADING'"
              :style="[(invalid || uploadBlocking) && { backgroundColor: '#E0E0E0', color: '#FFFFFF' }]"
            >
              Ajukan Sanggahan
            </Button>
          </div>
        </form>
      </ValidationObserver>

      <TrackingComplaintModal
        :open="statusSubmit === 'SUCCESS'"
        header="Berhasil!"
        label-primary-button="Kembali ke Riwayat"
        label-secondary-button="Tutup"
        name-icon="check-mark-circle"
        size="16px"
        description="Sanggahan berhasil diajukan. Warga dapat melakukan pengecekan melalui Hotline Jabar di Nomor WhatsApp 082126030038."
        @close="$emit('back')"
        @click="$emit('back')"
      />

      <TrackingComplaintModal
        :open="statusSubmit === 'ERROR'"
        header="Gagal Mengajukan Sanggahan!"
        :label-primary-button="errorRetryable ? 'Coba lagi' : 'Kembali ke Riwayat'"
        label-secondary-button="Tutup"
        name-icon="warning"
        size="16px"
        :description="errorMessage"
        @close="SET_STATUS_SUBMIT('NONE')"
        @click="errorRetryable ? onSubmit() : $emit('back')"
      />

      <TrackingComplaintModal
        :open="statusSubmit === 'SESSION_EXPIRED'"
        header="Sesi Anda Telah Habis"
        label-primary-button="Masuk Kembali"
        label-secondary-button="Tutup"
        name-icon="warning"
        size="16px"
        description="Maaf, sesi Anda telah habis. Untuk melanjutkan, silakan masuk kembali dan kirim ulang sanggahan Anda."
        @close="handleSessionExpired"
        @click="$emit('back')"
      />
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { convertHeicToJpg, isLikelyHeic } from '~/utils/heic'
import {
  SANGGAH_BUKTI_ACCEPT,
  SANGGAH_BUKTI_MAX_SIZE,
  isSanggahBuktiFormatAllowed,
  SANGGAH_AGREEMENT_TEXT,
  SANGGAH_CATEGORY_OPTIONS,
  SANGGAH_ID_TYPE_OPTIONS,
  SANGGAH_ID_MAX_LENGTH
} from '~/constant/imah-aing-sanggah'
import {
  getImahAingStatus,
  getImahAingStatusKey,
  getImahAingDisplayId
} from '~/constant/imah-aing-status'

export default {
  name: 'ImahAingSanggah',
  props: {
    item: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadError: {
      type: String,
      default: ''
    },
    fallbackPhone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      categoryOptions: SANGGAH_CATEGORY_OPTIONS,
      idTypeOptions: SANGGAH_ID_TYPE_OPTIONS,
      idMaxLength: SANGGAH_ID_MAX_LENGTH,
      agreementText: SANGGAH_AGREEMENT_TEXT,
      buktiAccept: SANGGAH_BUKTI_ACCEPT,
      buktiMaxSize: SANGGAH_BUKTI_MAX_SIZE
    }
  },
  computed: {
    ...mapState('imahAingSanggah', {
      storeCategory: 'category',
      storeIdType: 'idType',
      storeIdNumber: 'idNumber',
      storeDesil: 'desil',
      storeDescription: 'description',
      storeAgreement: 'agreement',
      bukti: 'bukti',
      statusSubmit: 'statusSubmit',
      errorMessage: 'errorMessage',
      errorRetryable: 'errorRetryable'
    }),
    // Bukti wajib: submit tertahan bila belum ada file, atau upload berjalan/gagal (hapus/ulangi dulu)
    uploadBlocking() {
      return !this.bukti || this.bukti.status !== 'SUCCESS'
    },
    category: {
      get() {
        return this.storeCategory
      },
      set(val) {
        this.SET_CATEGORY(val != null ? String(val) : '')
      }
    },
    showIdFields() {
      return this.category === 'data-kependudukan'
    },
    showDesilField() {
      return this.category === 'desil'
    },
    idTypeLabel() {
      const option = this.idTypeOptions.find((opt) => opt.value === this.idType)
      return option ? option.label : ''
    },
    idType: {
      get() {
        return this.storeIdType
      },
      set(val) {
        this.SET_ID_TYPE(val != null ? String(val) : '')
      }
    },
    idNumber: {
      get() {
        return this.storeIdNumber
      },
      set(val) {
        this.SET_ID_NUMBER(val)
      }
    },
    desil: {
      get() {
        return this.storeDesil
      },
      set(val) {
        this.SET_DESIL(val)
      }
    },
    description: {
      get() {
        return this.storeDescription
      },
      set(val) {
        this.SET_DESCRIPTION(val)
      }
    },
    agreement: {
      get() {
        return this.storeAgreement
      },
      set(val) {
        this.SET_AGREEMENT(val)
      }
    },
    infoRows() {
      const item = this.item || {}
      return [
        {
          label: 'Status',
          badge: getImahAingStatus(
            getImahAingStatusKey(item),
            item.latest_complaint_status?.name
          )
        },
        { label: 'ID Usulan', value: getImahAingDisplayId(item) },
        { label: 'Nama Lengkap', value: item.user_name || item.name },
        { label: 'No HP', value: item.user_phone || this.fallbackPhone },
        { label: 'Catatan', value: item.complaint_status_note, wide: true }
      ]
    }
  },
  methods: {
    ...mapMutations('imahAingSanggah', [
      'SET_CATEGORY',
      'SET_ID_TYPE',
      'SET_ID_NUMBER',
      'SET_DESIL',
      'SET_DESCRIPTION',
      'SET_AGREEMENT',
      'SET_BUKTI',
      'SET_STATUS_SUBMIT'
    ]),
    ...mapActions('imahAingSanggah', ['uploadBukti', 'submitSanggah']),
    setBuktiError(message) {
      const provider = this.$refs.buktiProvider
      if (provider && typeof provider.setErrors === 'function') {
        provider.setErrors([message])
      }
    },
    async handleUpload(file) {
      let selected = file instanceof FileList ? file[0] : file
      if (!selected || (Array.isArray(selected) && !selected.length)) return
      this.setBuktiError('')
      this.$refs.buktiProvider?.reset?.()

      if (isLikelyHeic(selected)) {
        try {
          selected = await convertHeicToJpg(selected, { quality: 0.85 })
        } catch (err) {
          this.setBuktiError('Gagal mengonversi foto HEIC. Coba foto lain atau simpan sebagai JPG dulu.')
          return
        }
      }

      // Cek format & ukuran SETELAH konversi HEIC (hasil konversi bisa melebihi batas)
      if (!isSanggahBuktiFormatAllowed(selected)) {
        this.setBuktiError('Format file harus .jpg, .jpeg, .png, atau .pdf.')
        return
      }
      if (selected.size > this.buktiMaxSize) {
        this.setBuktiError('Ukuran file melebihi 2 MB.')
        return
      }

      try {
        await this.uploadBukti(selected)
      } catch (err) {
        // Status error sudah diset di slot oleh store
      }
    },
    handleDelete() {
      this.SET_BUKTI(null)
      const input = document.querySelector('#sanggahBuktiDropzone input')
      if (input) input.value = ''
      this.$refs.buktiProvider?.reset?.()
    },
    async handleRetry() {
      if (!this.bukti || !this.bukti.file) return
      try {
        await this.uploadBukti(this.bukti.file)
      } catch (err) {
        // Status error sudah diset di slot oleh store
      }
    },
    async onSubmit() {
      // Cegah double submit (klik ganda / retry saat masih loading)
      if (this.statusSubmit === 'LOADING' || this.uploadBlocking) return
      try {
        await this.submitSanggah()
      } catch (error) {
        // Status error sudah diset di store
      }
    },
    handleSessionExpired() {
      if (process.client) {
        window.location.reload()
      }
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>

<!--
  Override JDS select — disalin dari pages/imah-aing/form/index.vue (`.citizen__form`),
  karena style itu hanya aktif di dalam form pengajuan. Tanpa ini teks opsi dropdown
  tidak terlihat (warna default JDS) dan popover bisa terpotong.
-->
<style>
.sanggah__form .jds-popover,
.sanggah__form .jds-popover__activator,
.sanggah__form .jds-select,
.sanggah__form .jds-input-text {
  width: 100% !important;
}

.sanggah__form .jds-popover__content {
  z-index: 50 !important;
  position: fixed !important;
}

.sanggah__form .jds-popover__content .jds-options__option-list-item {
  height: fit-content !important;
}

.sanggah__form .jds-options__option-list-item__text {
  color: black;
  white-space: unset !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

.sanggah__form .jds-input-text input {
  width: 100% !important;
  height: 100% !important;
  font-size: 14px !important;
  color: #616161 !important;
}
</style>
