<template>
  <section class="grid grid-cols-1 gap-x-8 gap-y-4 mb-4">
    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="Nama"
      rules="required"
    >
      <img
        src="/images/ilustrasi-ktp.webp"
        alt="Icon User"
        width="120px"
        height="120px"
        class="mb-4"
        loading="eager"
      />
      <label
        class="font-roboto font-medium text-black dark:text-dark-emphasis-high text-sm"
        for="name"
      >
        Nama <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="name"
        v-model="setName"
        class="cursor-pointer w-full"
        :error-message="errors[0]"
        placeholder="Masukkan nama sesuai KTP"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      rules="required|phoneNumber|numeric|min:10"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="No Kontak"
    >
      <label
        class="font-roboto font-medium text-black dark:text-dark-emphasis-high text-sm"
        for="phone"
      >
        No Kontak <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="phone"
        v-model="setPhone"
        class="cursor-pointer w-full"
        :error-message="errors[0]"
        placeholder="Masukkan No Kontak"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      ref="email_form"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="Email"
      rules="required|email"
    >
      <label
        class="font-roboto font-medium text-black dark:text-dark-emphasis-high text-sm"
        for="email"
      >
        Email <span class="text-red-500">*</span>
      </label>
      <div
        class="flex flex-row gap-2 px-2 py-[10px] border rounded-lg dark:border-dark-emphasis-medium"
      >
        <Icon src="/icon/info-circle-outline.svg" size="16px" />
        <span
          class="font-lato text-[12px] leading-[18px] text-black dark:text-dark-emphasis-high"
        >
          Disarankan email sudah terhubung dengan Aplikasi Sapawarga
        </span>
      </div>
      <JdsInputText
        id="email"
        v-model="setEmail"
        class="cursor-pointer w-full"
        :error-message="errors[0]"
        placeholder="Masukkan email"
        @input="checkEmail()"
      >
        <template #suffix-icon>
          <jdsSpinner v-if="isEmailLoading" size="20px" :cycle="1500" />
        </template>
      </JdsInputText>

      <transition name="fade">
        <div v-if="isEmailInfo">
          <p class="flex flex-row gap-2 justify-start items-center">
            <Icon
              :name="
                isEmailValid ? 'check-mark-circle' : 'exclamation-mark-circle'
              "
              size="16px"
              :class="isEmailValid ? 'text-green-600' : 'text-[#FF7500]'"
            />
            <span
              class="font-lato text-[13px] self-center"
              :class="isEmailValid ? 'text-green-600' : 'text-[#FF7500]'"
            >
              {{
                isEmailValid
                  ? 'Email sudah terhubung dengan Aplikasi Sapawarga.'
                  : 'Email belum terdaftar di Sapawarga.'
              }}
            </span>
          </p>

          <p
            v-show="!isEmailValid"
            class="font-lato text-[13px] text-[#404040]"
          >
            <a
              href="/sapawarga"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600"
            >
              Daftar
            </a>
            <span class="text-black dark:text-dark-emphasis-high">
              terlebih dahulu untuk melacak status Anda dengan mudah.
            </span>
          </p>
        </div>
      </transition>
    </ValidationProvider>
  </section>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapActions, mapGetters, mapState } from 'vuex'
import delay from '~/utils/delay'

export default {
  data() {
    return {
      isEmailLoading: false,
      isEmailInfo: false,
    }
  },
  computed: {
    ...mapState('citizenComplaintForm', ['data_wargi']),
    ...mapGetters('citizenComplaintForm', ['email', 'isEmailValid']),
    setPhone: {
      get() {
        return this.data_wargi.phone
      },
      set(value) {
        this.$store.commit('citizenComplaintForm/SET_DATA_WARGI_PHONE', value)
      },
    },
    setName: {
      get() {
        return this.data_wargi.name
      },
      set(value) {
        this.$store.commit('citizenComplaintForm/SET_DATA_WARGI_NAME', value)
      },
    },
    setEmail: {
      get() {
        return this.data_wargi.email
      },
      set(value) {
        this.$store.commit('citizenComplaintForm/SET_DATA_WARGI_EMAIL', value)
      },
    },
  },
  methods: {
    ...mapActions('citizenComplaintForm', ['handleCheckEmail']),
    checkEmail: debounce(async function () {
      this.isEmailLoading = false
      this.isEmailInfo = false

      try {
        const validationResult = await this.$refs.email_form.validate()

        if (validationResult.valid) {
          this.isEmailLoading = true

          await delay(500)
          this.handleCheckEmail()

          await delay(750)
          this.isEmailLoading = false
          this.isEmailInfo = true
        }
      } catch (error) {
        console.error(error)
      }
    }, 500),
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
