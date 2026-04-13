<template>
  <section class="grid grid-cols-1 mb-4 gap-x-8 gap-y-4">
    <img
      src="/images/ilustrasi-ktp.webp"
      alt="Icon User"
      width="120px"
      height="120px"
      class="mb-4"
      loading="eager"
    />

    <div
      class="flex flex-row gap-2 px-2 py-[10px] bg-blue-50 border border-blue-600 rounded-lg mb-4"
    >
      <Icon
        src="/icon/info-circle-outline.svg"
        size="16px"
        class="text-blue-600"
      />
      <span class="font-lato text-[12px] leading-[18px] text-blue-600">
        Silakan usulkan aduan untuk diri sendiri dengan melengkapi data di bawah
        ini.
      </span>
    </div>

    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="Nama Pengusul"
      rules="required"
    >
      <label
        class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        for="name"
      >
        Nama Pengusul <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="name"
        v-model="setName"
        class="w-full"
        :error-message="errors[0]"
        placeholder="Nama sesuai profil"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      rules="required|phoneNumber|numeric|min:10"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="No HP Pengusul"
    >
      <label
        class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        for="phone"
      >
        No HP Pengusul <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="phone"
        v-model="setPhone"
        class="w-full"
        :error-message="errors[0]"
        placeholder="Nomor HP sesuai profil"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      ref="email_form"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="Email"
      rules="email"
    >
      <label
        class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        for="email"
      >
        Email
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
        class="w-full cursor-pointer"
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
          <p class="flex flex-row items-center justify-start gap-2">
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

    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2 mb-5"
      name="NIK"
      rules="required|numeric|min:16|max:16"
    >
      <label
        class="text-sm font-medium text-black font-roboto dark:text-dark-emphasis-high"
        for="nik"
      >
        NIK <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="nik"
        v-model="setNik"
        class="w-full"
        :error-message="errors[0]"
        placeholder="Masukkan NIK"
        maxlength="16"
      />
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
    ...mapState('jalan-aing', ['data_wargi']),
    ...mapGetters('jalan-aing', ['email', 'isEmailValid']),
    setPhone: {
      get() {
        return this.data_wargi.phone
      },
      set(value) {
        this.$store.commit('jalan-aing/SET_DATA_WARGI_PHONE', value)
      },
    },
    setName: {
      get() {
        return this.data_wargi.name
      },
      set(value) {
        this.$store.commit('jalan-aing/SET_DATA_WARGI_NAME', value)
      },
    },
    setEmail: {
      get() {
        return this.data_wargi.email
      },
      set(value) {
        this.$store.commit('jalan-aing/SET_DATA_WARGI_EMAIL', value)
      },
    },
    setNik: {
      get() {
        return this.data_wargi.nik
      },
      set(value) {
        this.$store.commit('jalan-aing/SET_DATA_WARGI_NIK', value)
      },
    },
  },
  mounted() {
    this.fetchUserProfile()
  },
  methods: {
    ...mapActions('jalan-aing', ['handleCheckEmail', 'fetchUserProfile']),
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
