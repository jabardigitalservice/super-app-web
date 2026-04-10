<template>
  <ul
    class="form-stepper w-full min-w-0 min-h-[84px] overflow-auto flex lg:flex-row gap-1 lg:justify-center"
  >
    <li
      v-for="item in displayedFormTitle"
      :key="item.id + item.title"
      class="flex items-center min-w-fit"
    >
      <span
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        :class="currentFormStep === item.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
      >
        {{ item.id }}
      </span>
      <h2
        class="flex-shrink-0 mx-2 font-roboto text-base leading-6 "
        :class="currentFormStep === item.id ? 'text-black dark:text-dark-emphasis-high' : 'text-gray-600'"
      >
        {{ item.title }}
      </h2>
      <span class="w-6 h-6 flex items-center justify-start">
        <Icon name="chevron-right" class="text-gray-400" size="12px" />
      </span>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      formTitle: [
        { id: 1, title: 'Perhatian' },
        { id: 2, title: 'Data Pengusul' },
        { id: 3, title: 'Dokumen' },
        { id: 4, title: 'Lokasi' },
      ],
    }
  },
  computed: {
    ...mapGetters('imahAingForm', ['currentFormStep']),
    ...mapState('imahAingForm', ['accountType']),
    displayedFormTitle() {
      return this.formTitle.filter((item) => {
        if (item.id !== 1) return true
        return this.accountType !== 'rt_rw_kades'
      })
    },
  },
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.form-stepper::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.form-stepper {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
