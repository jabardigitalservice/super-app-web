<template>
  <section class="grid grid-cols-1 gap-x-8 gap-y-6 mb-4">
    <h3
      class="font-roboto font-medium text-black text-sm dark:text-dark-emphasis-high"
    >
      Upload File <span class="text-red-500">*</span> <br />
      <span
        class="font-lato text-[12px] leading-[18px] text-gray-600 text-left dark:text-dark-emphasis-high"
      >
        Ukuran Maksimal file upload 1 Mb. File yang didukung adalah .jpg dan.png
      </span>
    </h3>
    <ValidationProvider
      v-slot="{ errors }"
      ref="imageUploader"
      class="flex flex-col gap-y-2"
      rules="required"
      name="Foto Aduan"
    >
      <BaseDropzone
        id="imageDropzone"
        accept=".jpg, .jpeg, .png"
        multiple
        :disabled="imagesFile.length >= 10"
        :is-error="errors.length > 0"
        :show-retry-button="false"
        @change="handleImage($event)"
      />
      <span class="font-lato text-[13px] text-red-700">{{ errors[0] }}</span>
    </ValidationProvider>

    <transition-group name="slide-fade">
      <div
        v-for="file in imagesFile"
        :key="file.id"
        class="flex flex-col gap-2 mb-4"
      >
        <BaseDropzoneUploadProgress
          v-show="!!file.image_file"
          :file="file.image_file"
          :progress="file.image_upload_progress"
          :status="file.image_upload_status"
          @delete="deleteImage(file.id)"
        />
        <span v-show="!!file.errors" class="font-lato text-[13px] text-red-700"
          >{{ file.errors[0] }}
        </span>
      </div>
    </transition-group>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('citizenComplaintForm', ['foto_aduan']),
    imagesFile() {
      return this.foto_aduan.raw_image
    },
    imageRules() {
      return this.imagesFile.length > 0 ? '' : 'required'
    },
  },
  methods: {
    ...mapActions('citizenComplaintForm', ['handleImagesFile', 'removeImage']),
    async handleImage(file) {
      const { valid } = await this.$refs.imageUploader.validate(file)

      if (valid) {
        this.handleImagesFile(file)
      }
    },
    deleteImage(id) {
      this.removeImage(id)
      document.querySelector('#imageDropzone input').value = ''
      this.$refs.imageUploader.syncValue()
    },
  },
}
</script>

<style scoped>
.custom-s-dash {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='silver' stroke-width='2' stroke-dasharray='8' stroke-dashoffset='5' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: 8px;
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
