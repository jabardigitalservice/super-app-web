<template>
  <section class="grid grid-cols-1 gap-x-8 gap-y-6 mb-4">
    <div class="flex flex-col gap-2" name="Tipe Aduan">
      <div class="flex flex-col gap-2">
        <h4 class="font-roboto font-medium text-black text-sm">
          Tipe Aduan <span class="text-red-500">*</span>
        </h4>
        <ValidationProvider
          v-slot="{ errors }"
          tag="div"
          class="w-full grid grid-cols-1 gap-3 mb-2 md:grid-cols-2"
          name="Tipe Aduan"
          rules="required"
        >
          <label
            v-for="item in complaintOptions"
            :key="item.id"
            :for="item.title + item.id"
          >
            <input
              :id="item.title + item.id"
              v-model="setType"
              type="radio"
              :value="item.value"
              class="hidden"
            />
            <div
              class="max-w-[328px] h-full rounded-xl border bg-white grid grid-cols-[1fr,16px] gap-2 py-4 px-3"
              :class="{
                'border-gray-300': !errors[0],
                'border-red-600': errors[0],
              }"
            >
              <div>
                <h6
                  :class="{
                    'font-roboto text-sm font-bold text-gray-900': isSelected(
                      item.value
                    ),
                    'font-roboto text-sm text-gray-800': !isSelected(
                      item.value
                    ),
                  }"
                >
                  {{ item.title }}
                </h6>
                <p class="font-roboto text-xs text-gray-700">
                  {{ item.description }}
                </p>
              </div>
              <div class="justify-self-end">
                <div
                  v-show="!isSelected(item.value)"
                  class="w-4 h-4 rounded-full bg-gray-300"
                />
                <Icon
                  v-show="isSelected(item.value)"
                  name="check-mark-circle"
                  size="16px"
                  class="text-green-600"
                />
              </div>
            </div>
          </label>

          <span class="font-lato text-[13px] text-red-600 mt-1">{{
            errors[0]
          }}</span>
        </ValidationProvider>
      </div>

      <div
        v-show="setType === 'public'"
        class="flex flex-row gap-2 justify-start max-w-[310px]"
      >
        <label
          for="anonymousId"
          class="font-roboto text-gray-700 text-[12px] leading-[18px]"
        >
          Sembunyikan identitas Anda <b>(Anonim)</b>
        </label>
        <JdsToggle id="anonymousId" v-model="isAnonymous" class="mr-3" />
      </div>
    </div>

    <!-- TODO: FLOWNYA JIKA MEMILIH KATEGORI LAINNYA, MAKA MUNCUL CATEGORY_CHILD_ID FREETEXT -->
    <ValidationProvider
      v-slot="{ errors }"
      rules="required"
      class="flex flex-col gap-2"
      tag="section"
      name="Kategori"
    >
      <label for="category" class="font-roboto font-medium text-black text-sm">
        Kategori Aduan <span class="text-red-500">*</span>
      </label>
      <JdsSelect
        id="category"
        v-model="setValueCategory"
        filterable
        filter-type="contain"
        placeholder="Pilih kategori aduan"
        :error-message="errors[0]"
        :options="categoriesOption"
      />
    </ValidationProvider>

    <!-- TODO: FLOWNYA JIKA MEMILIH KATEGORI LAINNYA, MAKA MUNCUL SUB_CATEGORY_CHILD_ID FREETEXT -->
    <ValidationProvider
      v-if="!isSubcategory"
      v-slot="{ errors }"
      :rules="isSubcategory ? '' : 'required'"
      tag="section"
      class="flex flex-col gap-2"
      name="Sub Kategori"
    >
      <label
        for="subCategory"
        class="font-roboto font-medium text-black text-sm"
      >
        Sub Kategori <span class="text-red-500">*</span>
      </label>
      <JdsSelect
        id="subCategory"
        v-model="setValueSubCategory"
        filterable
        filter-type="contain"
        placeholder="Pilih sub kategori"
        :disabled="isSubcategory"
        :error-message="errors[0]"
        :options="subCategoriesOption"
      />
    </ValidationProvider>

    <ValidationProvider
      v-if="isSubcategory"
      v-slot="{ errors }"
      :rules="isSubcategory ? 'required' : ''"
      class="flex flex-col gap-2 z-10"
      name="Sub Kategori - lainnya"
    >
      <label
        for="otherSubCategoy"
        class="font-roboto font-medium text-black text-sm"
      >
        Sub Kategori <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="otherSubCategoy"
        v-model="setValueOtherSubCategory"
        name="otherSubCategoy"
        class="cursor-pointer w-full"
        :error-message="errors[0]"
        placeholder="Masukkan disini"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2"
      rules="required"
      name="Judul"
    >
      <label class="font-roboto font-medium text-black text-sm" for="title">
        Judul <span class="text-red-500">*</span>
      </label>
      <JdsInputText
        id="title"
        v-model="setTitle"
        class="cursor-pointer w-full"
        :error-message="errors[0]"
        placeholder="Masukkan disini"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      tag="div"
      class="flex flex-col gap-2"
      rules="required"
      name="Pengalaman"
    >
      <label
        for="experience"
        class="font-roboto font-medium text-black text-sm"
      >
        Ceritakan Pengalaman Anda <span class="text-red-500">*</span>
      </label>
      <p class="font-lato text-[12px] leading-[18px] text-gray-600">
        Detail permasalahan dapat memuat info berupa waktu kejadian, jenis
        pelanggaran, dsb. <br />
        Ceritakan aduan yang ingin disampaikan dengan detail.
      </p>
      <textarea
        id="experience"
        placeholder="Masukkan disini"
        :value="setValueReason"
        rows="3"
        maxlength="1000"
        class="w-full border rounded-lg px-2 py-1 bg-gray-50 mb-1 hover:bg-white disabled:bg-gray-200 disabled:border-gray-500 hover:border-green-600 focus:outline-none focus:border-green-500 focus:outline-1 focus:outline-offset-[-2px] focus:outline-yellow-500 text-black"
        :class="{
          'border-gray-500': !errors[0],
          'border-red-600': errors[0],
        }"
        @input="setReason($event.target.value)"
      />
      <p
        class="text-xs text-left"
        :class="{
          'text-gray-500': !errors[0],
          'text-red-600': errors[0],
        }"
      >
        Tersisa {{ 1000 - setValueReason.length }} karakter
      </p>
      <span class="font-lato text-[13px] text-red-600 mt-1">{{
        errors[0]
      }}</span>
    </ValidationProvider>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      complaintOptions: [
        {
          id: 1,
          title: 'Publik',
          description: 'Aduan Anda dapat dilihat oleh publik',
          value: 'public',
        },
        {
          id: 2,
          title: 'Private/Rahasia',
          description: 'Aduan hanya dapat dilihat oleh Anda',
          value: 'private',
        },
      ],
    }
  },
  computed: {
    ...mapState('citizenComplaintForm', ['informasi_aduan']),
    ...mapGetters('citizenComplaintForm', [
      'categoriesOption',
      'subCategoriesOption',
    ]),
    isSubcategory() {
      if (this.informasi_aduan?.category) {
        return this.informasi_aduan?.category?.includes('lainnya')
      }
      return false
    },
    isAnonymous: {
      get() {
        return this.informasi_aduan.is_anonymous
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_INFORMASI_ADUAN_IS_ANONYMOUS',
          value
        )
      },
    },
    setTitle: {
      get() {
        return this.informasi_aduan.title
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_INFORMASI_ADUAN_TITLE',
          value
        )
      },
    },
    setValueReason() {
      return this.informasi_aduan.reason
    },
    setType: {
      get() {
        return this.informasi_aduan.type
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_INFORMASI_ADUAN_TYPE',
          value
        )
      },
    },
    setValueCategory: {
      get() {
        return this.informasi_aduan.category
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_INFORMASI_ADUAN_CATEGORY',
          value
        )
        this.handleCategorySelected()
      },
    },
    setValueSubCategory: {
      get() {
        return this.informasi_aduan.sub_category
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_INFORMASI_ADUAN_SUB_CATEGORY',
          value
        )
      },
    },
    setValueOtherSubCategory: {
      get() {
        return this.informasi_aduan.sub_category_other
      },
      set(value) {
        this.$store.commit(
          'citizenComplaintForm/SET_INFORMASI_ADUAN_SUB_CATEGORY_OTHER',
          value
        )
      },
    },
  },
  mounted() {
    this.setCategoriesOption('kategoriAduan')
  },
  methods: {
    ...mapActions('citizenComplaintForm', [
      'setCategoriesOption',
      'handleCategorySelected',
    ]),
    isSelected(value) {
      return this.setType === value
    },
    setReason(value) {
      this.$store.commit(
        'citizenComplaintForm/SET_INFORMASI_ADUAN_REASON',
        value
      )
    },
  },
}
</script>

<style scoped>
textarea:focus {
  border: 1px solid white;
  outline: none;
  box-shadow: inset 0px 0px 0px 1px #069550, inset 0px 0px 0px 2px #ffc800;
}
</style>
