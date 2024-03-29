<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-between items-center w-full">
      <label
        :class="{
          'text-gray-800 font-roboto text-sm dark:text-dark-text-high': true,
          'text-red-700 dark:text-dark-text-error': error || errorMessage,
        }"
        :for="label"
      >
        {{ label }}
      </label>
      <div
        v-if="isShowPasswordLevel && levelPassword"
        class="w-1/3 flex items-center"
      >
        <div
          :class="{
            'text-xs mr-2': true,
            'text-red-500': levelPassword === 'Lemah',
            'text-yellow-600': levelPassword === 'Sedang',
            'text-green-500': levelPassword === 'Kuat',
          }"
        >
          {{ levelPassword }}
        </div>
        <div class="w-full bg-gray-200 h-2 rounded-md">
          <div
            :class="{
              'h-2 rounded-md': true,
              'w-1/3 bg-red-500': levelPassword === 'Lemah',
              'w-2/3 bg-yellow-600': levelPassword === 'Sedang',
              'w-full bg-green-500': levelPassword === 'Kuat',
            }"
          />
        </div>
      </div>
    </div>
    <div
      :class="{
        'flex justify-between items-center w-full h-9 rounded-lg bg-gray-100 border border-gray-400 overflow-hidden': true,
        'border-green-700': isFocused,
        'border-red-700 dark:border-dark-text-error': error,
      }"
    >
      <div
        v-if="$slots['icon-left']"
        class="h-full w-8 flex items-center justify-center bg-gray-50 dark:bg-dark-emphasis-low"
        @click="onClickEye"
      >
        <slot name="icon-left" />
      </div>
      <input
        :id="label"
        class="bg-gray-50 h-9 w-full px-2 focus:outline-none text-gray-800 text-sm leading-4 placeholder-gray-600 dark:bg-dark-emphasis-low dark:text-dark-text-low"
        :placeholder="placeholder"
        :type="mType"
        :value="value"
        :autofocus="autofocus"
        autocomplete="on"
        :disabled="disabled"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="onInput"
      >
      <div
        v-if="type === 'password' || $slots['icon-right']"
        class="h-full w-8 flex items-center justify-center bg-gray-50 dark:bg-dark-emphasis-low"
      >
        <IconEyeOn
          v-if="!$slots['icon-right'] && iconEye === 'eye'"
          :class="{
            'cursor-pointer stroke-gray-800': true,
            'stroke-green-800': isTyped || isFocused,
          }"
          @click="onClickEye"
        />
        <IconEyeOff
          v-if="!$slots['icon-right'] && iconEye === 'eye-off'"
          :class="{
            'cursor-pointer stroke-gray-800': true,
            'stroke-green-800': isTyped || isFocused,
          }"
          @click="onClickEye"
        />
        <slot name="icon-right" />
      </div>
    </div>
    <p
      v-if="errorMessage"
      class="text-red-700 text-xs dark:text-dark-text-error"
    >
      {{ errorMessage }}
    </p>
    <slot name="text-info" />
  </div>
</template>

<script>
import IconEyeOn from '~/assets/icon/eye-on.svg?inline'
import IconEyeOff from '~/assets/icon/eye-off.svg?inline'

export default {
  name: 'BaseInputText',
  components: {
    IconEyeOn,
    IconEyeOff
  },
  props: {
    /**
     * Auto focus on fill
     */
    autofocus: {
      type: Boolean,
      default: false
    },
    /**
     * autocomplete value to input text if field save to browser
     */
    autocomplete: {
      type: String,
      default: 'off'
    },
    /**
     * value of input text
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * type of input text
     */
    type: {
      type: String,
      default: 'text'
    },
    /**
     * the label above input text
     */
    label: {
      type: String,
      default: ''
    },
    /**
     * placeholder input text
     */
    placeholder: {
      type: String,
      default: ''
    },
    /**
     * Error state
     */
    error: {
      type: Boolean,
      default: false
    },
    /**
     * Error message
     */
    errorMessage: {
      type: String,
      default: ''
    },
    /**
     * Show password level
     */
    isShowPasswordLevel: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isFocused: false,
      isTyped: false,
      iconEye: 'eye',
      isShowPassword: false,
      levelPassword: ''
    }
  },
  computed: {
    /**
     * handle certain condition for property type
     * in this case handle show password or hidden password
     */
    mType () {
      if (this.type === 'password' && !this.isShowPassword) {
        return 'password'
      } else if (this.type === 'password' && this.isShowPassword) {
        return 'text'
      }
      return this.type
    }
  },
  watch: {
    /**
     * check password strength input text on input
     */
    value (password) {
      // eslint-disable-next-line prefer-regex-literals
      const strongPassword = new RegExp(
        '(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])'
      )
      // eslint-disable-next-line prefer-regex-literals
      const mediumPassword = new RegExp('(?=.{6,})(?=.*[a-z|A-Z])(?=.*[0-9])')
      // eslint-disable-next-line prefer-regex-literals
      const lowPassword = new RegExp(
        '(?=.{6,})(?=.*[a-z|A-Z|^A-Za-z0-9])|(?=.{1,})(?=.*[a-z|A-Z|^A-Za-z0-9])'
      )
      if (strongPassword.test(password)) {
        this.levelPassword = 'Kuat'
      } else if (mediumPassword.test(password)) {
        this.levelPassword = 'Sedang'
      } else if (lowPassword.test(password)) {
        this.levelPassword = 'Lemah'
      } else {
        this.levelPassword = ''
      }
    }
  },
  methods: {
    /**
     * handle method when input text on input
     */
    onInput (e) {
      if (e.target.value.length) {
        this.isTyped = true
      } else {
        this.isTyped = false
      }
      /**
       * Emitting value of input text
       */
      this.$emit('input', e.target.value)
    },
    /**
     * handle method when icon eye clicked specifically for password type
     */
    onClickEye () {
      if (this.iconEye === 'eye') {
        this.iconEye = 'eye-off'
        this.isShowPassword = true
      } else {
        this.iconEye = 'eye'
        this.isShowPassword = false
      }
    }
  }
}
</script>
