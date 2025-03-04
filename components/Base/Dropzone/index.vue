<template>
  <div
    ref="dropzone"
    :class="{
      'w-full min-h-[250px] p-6 border border-dashed bg-gray-50 flex flex-col justify-center items-center rounded-lg': true,
      'border-red-500': isError,
    }"
    @drop.prevent="onDropFile"
  >
    <Icon class="mb-3" src="/icon/add-image.svg" size="36px" />
    <label for="file" class="cursor-pointer text-center">
      <span
        class="font-lato font-medium text-sm leading-6 text-blue-gray-300 mb-3"
      >
        {{ guide }}
      </span>
      <span
        :class="{
          'text-sm text-black font-roboto font-medium': true,
          'opacity-50': disabled,
        }"
      >
        <u> Klik untuk Upload </u>
      </span>
    </label>
    <input
      id="file"
      type="file"
      hidden
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      :data-cy="
        dataCy ? `${dataCy}-dropzone__input-file` : 'dropzone__input-file'
      "
      @change="onChooseFile"
    />

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <slot name="description" />
    </transition>
  </div>
</template>

<script>
const events = ['dragenter', 'dragover', 'dragleave', 'drop']

export default {
  name: 'Dropzone',

  props: {
    guide: {
      type: String,
      default: 'Seret dan lepaskan file disini atau',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxSize: {
      type: Number,
      default: 0,
    },
    accept: {
      type: String,
      default: 'image/*',
    },
    isError: {
      type: Boolean,
      default: false,
    },
    dataCy: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    events.forEach((eventName) => {
      this.$refs.dropzone.addEventListener(eventName, this.preventDefaults)
    })
  },
  beforeDestroy() {
    events.forEach((eventName) => {
      this.$refs.dropzone.removeEventListener(eventName, this.preventDefaults)
    })
  },
  methods: {
    onDropFile(e) {
      if (this.disabled) {
        return
      }

      const files = this.multiple
        ? e.dataTransfer.files
        : e.dataTransfer.files[0]

      this.$emit('change', files ?? [])
    },
    onChooseFile(e) {
      const files = this.multiple ? e.target.files : e.target.files[0]
      this.$emit('change', files ?? [])
    },
    onClick() {
      this.$emit('click')
    },
    preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    },
  },
}
</script>
