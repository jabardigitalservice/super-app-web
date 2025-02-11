<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow">
      <!-- Progress Steps -->
      <div class="flex items-center p-4 border-b">
        <template v-for="(step, index) in steps">
          <div
            :key="step.id"
            class="flex items-center"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              :class="[
                currentStep === index + 1
                  ? 'bg-green-600 text-white'
                  : completedSteps.includes(index + 1)
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span
              class="ml-2 text-sm"
              :class="currentStep === index + 1 ? 'text-gray-900 font-medium' : 'text-gray-500'"
            >
              {{ step.title }}
            </span>
            <div
              v-if="index < steps.length - 1"
              class="flex-1 border-t border-gray-300 mx-4"
            ></div>
          </div>
        </template>
      </div>

      <!-- Form Content -->
      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="p-6">
            <!-- Step 1: Data Wargi -->
            <div v-if="currentStep === 1">
              <h2 class="text-xl font-semibold mb-6">Data Wargi</h2>

              <ValidationProvider
                name="nama"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.nama"
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  />
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="phone"
                rules="required|numeric|min:10"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Handphone <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.phone"
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  />
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="email"
                rules="required|email"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  />
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </div>

            <!-- Step 2: Informasi Aduan -->
            <div v-if="currentStep === 2">
              <h2 class="text-xl font-semibold mb-6">Informasi Aduan</h2>

              <ValidationProvider
                name="tipeAduan"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Aduan <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      class="border rounded-lg p-4 cursor-pointer"
                      :class="formData.tipeAduan === 'publik' ? 'border-green-500 bg-green-50' : 'border-gray-300'"
                      @click="formData.tipeAduan = 'publik'"
                    >
                      <h3 class="font-medium">Publik</h3>
                      <p class="text-sm text-gray-500">Aduan Anda dapat dilihat oleh publik</p>
                    </div>
                    <div
                      class="border rounded-lg p-4 cursor-pointer"
                      :class="formData.tipeAduan === 'private' ? 'border-green-500 bg-green-50' : 'border-gray-300'"
                      @click="formData.tipeAduan = 'private'"
                    >
                      <h3 class="font-medium">Private/Rahasia</h3>
                      <p class="text-sm text-gray-500">Aduan hanya dapat dilihat oleh Anda</p>
                    </div>
                  </div>
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="kategori"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Kategori Aduan <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.kategori"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  >
                    <option value="">Pilih kategori aduan</option>
                    <option value="1">Infrastruktur</option>
                    <option value="2">Pelayanan Publik</option>
                    <option value="3">Keamanan</option>
                  </select>
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="judul"
                rules="required|min:5"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Judul <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.judul"
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  />
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="deskripsi"
                rules="required|min:20"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ceritakan Pengalaman Anda <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.deskripsi"
                    rows="4"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  ></textarea>
                  <div class="flex justify-end">
                    <span class="text-sm text-gray-500">{{ formData.deskripsi.length }}/1000</span>
                  </div>
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </div>

            <!-- Step 3: Foto Aduan -->
            <div v-if="currentStep === 3">
              <h2 class="text-xl font-semibold mb-6">Foto Aduan</h2>

              <ValidationProvider
                name="photos"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.png"
                      class="hidden"
                      ref="fileInput"
                      @change="handleFileUpload"
                    />
                    <button
                      type="button"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      @click="$refs.fileInput.click()"
                    >
                      Upload File
                    </button>
                    <p class="mt-2 text-sm text-gray-500">
                      atau seret dan lepaskan file di sini
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      Ukuran maksimal file adalah 1 Mb, File yang didukung adalah .jpg dan .png
                    </p>
                  </div>

                  <!-- Uploaded Files List -->
                  <div class="mt-4 space-y-2">
                    <div
                      v-for="(file, index) in formData.photos"
                      :key="index"
                      class="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div class="flex items-center">
                        <img
                          :src="file.preview"
                          class="w-12 h-12 object-cover rounded"
                        />
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                          <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="text-red-500 hover:text-red-700"
                        @click="removeFile(index)"
                      >
                        <span class="sr-only">Remove</span>
                        ×
                      </button>
                    </div>
                  </div>

                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </div>

            <!-- Step 4: Lokasi Aduan -->
            <div v-if="currentStep === 4">
              <h2 class="text-xl font-semibold mb-6">Lokasi Aduan</h2>

              <ValidationProvider
                name="kota"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Kota/Kabupaten <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.kota"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  >
                    <option value="">Pilih kota</option>
                    <option value="bandung">Kota Bandung</option>
                  </select>
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="kecamatan"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Kecamatan <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.kecamatan"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  >
                    <option value="">Pilih kecamatan</option>
                    <option value="babakan">Babakan Ciparay</option>
                  </select>
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <ValidationProvider
                name="kelurahan"
                rules="required"
                v-slot="{ errors }"
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Kelurahan/Desa <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.kelurahan"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="errors.length ? 'border-red-500' : 'border-gray-300'"
                  >
                    <option value="">Pilih kelurahan</option>
                    <option value="sukahaji">Kelurahan Sukahaji</option>
                  </select>
                  <span class="text-sm text-red-500">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Detail lokasi tambahan (optional)
                </label>
                <textarea
                  v-model="formData.detailLokasi"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Masukkan detail lokasi tambahan"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="px-6 py-4 bg-gray-50 flex justify-between rounded-b-lg">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              @click="prevStep"
              v-if="currentStep > 1"
            >
              Kembali
            </button>
            <button
              type="submit"
              class="ml-auto px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {{ currentStep === steps.length ? 'Kirim Aduan' : 'Simpan dan Lanjutkan' }}
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { extend } from 'vee-validate'
import { required, email, numeric, min } from 'vee-validate/dist/rules'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

// Register validation rules
extend('required', {
  ...required,
  message: 'Field ini wajib diisi'
})
extend('email', {
  ...email,
  message: 'Email tidak valid'
})
extend('numeric', {
  ...numeric,
  message: 'Hanya boleh berisi angka'
})
extend('min', {
  ...min,
  message: 'Minimal {length} karakter'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },

  data() {
    return {
      currentStep: 1,
      completedSteps: [],
      steps: [
        { id: 1, title: 'Data Wargi' },
        { id: 2, title: 'Informasi Aduan' },
        { id: 3, title: 'Foto Aduan' },
        { id: 4, title: 'Lokasi Aduan' }
      ],
      formData: {
        nama: '',
        phone: '',
        email: '',
        tipeAduan: '',
        kategori: '',
        judul: '',
        deskripsi: '',
        photos: [],
        kota: '',
        kecamatan: '',
        kelurahan: '',
        detailLokasi: ''
      }
    }
  },

  methods: {
     async onSubmit() {
      if (this.currentStep < this.steps.length) {
        await   this.completedSteps.push(this.currentStep)
        this.currentStep++
      } else {
        // Handle final form submission
        console.log('Form submitted:', this.formData)
        // Add your API call here
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
        this.completedSteps = this.completedSteps.filter(step => step < this.currentStep)
      }
    },

    handleFileUpload(event) {
      const files = Array.from(event.target.files)

      files.forEach(file => {
        if (file.size <= 1024 * 1024) { // 1MB limit
          const reader = new FileReader()
          reader.onload = e => {
            this.formData.photos.push({
              file,
              name: file.name,
              size: file.size,
              preview: e.target.result
            })
          }
          reader.readAsDataURL(file)
        }
      })
    },

    removeFile(index) {
      this.formData.photos.splice(index, 1)
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
}
</script>
