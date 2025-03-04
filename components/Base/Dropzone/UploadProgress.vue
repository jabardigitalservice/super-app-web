<template>
  <client-only>
    <section>
      <div
        :class="{
          'min-h-[110px] overflow-auto w-full rounded-md px-5 py-4 border border-gray-400': true,
          'border-red-600': status === 'ERROR',
        }"
        :data-cy="
          dataCy
            ? `${dataCy}-dropzone-upload-progress`
            : 'dropzone-upload-progress'
        "
      >
        <div class="grid grid-cols-[auto,1fr,auto] gap-x-4 sm:gap-x-6">
          <div class="relative w-[86px] h-[75px] overflow-hidden rounded-md">
            <div v-if="!!imageFileSrc" class="w-[86px] h-[75px]">
              <img
                :src="imageFileSrc"
                alt="Preview image"
                class="h-full w-full object-contain object-center"
              />
            </div>
            <transition name="fade">
              <div
                v-if="status === 'UPLOADING'"
                class="absolute bottom-0 w-full h-0 bg-[#1975CA] opacity-60 transition-all ease-out"
                :style="{ height: `${progress}%` }"
              />
            </transition>
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex flex-col gap-1 mb-3">
              <p
                class="font-lato font-bold text-[15px] leading-6 line-clamp-1 break-all"
              >
                {{ fileName }}
              </p>
              <p
                v-show="status === 'UPLOADING' || status === 'HASDEFAULT'"
                class="w-full font-lato text-[12px] leading-[18px] text-gray-500"
              >
                <span
                  v-show="status === 'UPLOADING' || status === 'HASDEFAULT'"
                >
                  {{ fileSize }}
                </span>
                <span v-show="status === 'UPLOADING'">|| {{ progress }}% </span>
              </p>
              <p
                v-show="status === 'SUCCESS'"
                class="w-full font-lato text-[12px] leading-[18px] text-gray-500 flex gap-2"
              >
                <span> Upload Berhasil </span>
                <span>
                  <Icon
                    name="check-mark"
                    size="14px"
                    class="h-4 text-green-700"
                  />
                </span>
              </p>
              <p
                v-show="status === 'ERROR'"
                class="w-full font-lato text-[12px] font-medium leading-[18px] text-red-700"
              >
                Upload Gagal
              </p>
            </div>
          </div>
          <div class="self-center flex flex-row gap-2">
            <!-- Delete Button -->
            <button
              v-if="
                status === 'SUCCESS' ||
                status === 'ERROR' ||
                status === 'HASDEFAULT'
              "
              type="button"
              class="w-7 h-7 flex items-center justify-center bg-red-50 rounded-full"
              :data-cy="
                dataCy
                  ? `${dataCy}-dropzone-upload-progress__button-delete`
                  : 'dropzone-upload-progress__button-delete'
              "
              @click="$emit('delete')"
            >
              <Icon name="trash" size="16px" class="h-4 text-red-700" />
            </button>
            <!-- Retry Button -->
            <button
              v-if="isShowRetryButton"
              type="button"
              class="w-7 h-7 flex items-center justify-center bg-blue-gray-50 rounded-full"
              :data-cy="
                dataCy
                  ? `${dataCy}-dropzone-upload-progress__button-retry`
                  : 'dropzone-upload-progress__button-retry'
              "
              @click="$emit('retry')"
            >
              <Icon src="/icon/retry.svg" size="16px" />
            </button>
          </div>
          <!-- UPLOAD PROGRESS BAR -->
          <div
            v-show="status === 'UPLOADING'"
            class="col-span-3 w-full h-2 bg-gray-100 rounded-lg mt-4"
          >
            <div
              class="bg-blue-600 h-2 rounded-lg transition-all ease-in"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import mime from 'mime-types'

export default {
  name: 'DropzoneUploadProgress',
  props: {
    progress: {
      type: Number,
      default: 50,
    },
    file: {
      validator: (value) => {
        return value instanceof File
      },
      default: null,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    showRetryButton: {
      type: Boolean,
      default: true,
    },
    imageSize: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      validator(value) {
        // The value must match one of these strings
        return ['NONE', 'UPLOADING', 'SUCCESS', 'ERROR', 'HASDEFAULT'].includes(
          value
        )
      },
      default: 'NONE',
    },
    dataCy: {
      type: String,
      default: null,
    },
  },
  computed: {
    isShowRetryButton() {
      return this.status === 'ERROR' && this.ShowRetryButton
    },
    fileName() {
      return this.file ? this.file.name : ''
    },
    fileSize() {
      const sizeImage = this.imageSize !== 0 ? this.imageSize : this.file.size

      if (!sizeImage) {
        return null
      }

      const sizeToMB = sizeImage / 1000000
      return `${sizeToMB.toFixed(2)} MB`
    },
    fileType() {
      return this.file && this.file.type ? mime.extension(this.file.type) : ''
    },
    imageFileSrc() {
      if (this.imageUrl) {
        return this.imageUrl
      }

      if (this.file) {
        const fileExtension = mime.extension(this.file.type)
        if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
          return URL.createObjectURL(this.file)
        }
      }

      // Fallback to default image
      return '/images/citizen-complaint/default-image.webp'
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
