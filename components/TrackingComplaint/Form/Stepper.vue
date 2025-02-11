<template>
  <ul
    class="form-stepper w-full min-w-0 min-h-[84px] overflow-auto flex lg:flex-row gap-1 lg:justify-center"
  >
    <li
      v-for="{ title, id } in formTitle"
      :key="id + title"
      class="flex items-center min-w-fit"
    >
      <span
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        :class="currentFormStep === id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
      >
        {{ id }}
      </span>
      <h2
        class="flex-shrink-0 mx-2 font-roboto text-base leading-6 "
        :class="currentFormStep === id ? 'text-black dark:text-dark-emphasis-high' : 'text-gray-600'"
      >
        {{ title }}
      </h2>
      <span class="w-6 h-6 flex items-center justify-start">
        <!-- TODO: ADD ARROW JSA -->
        <Icon name="chevron-right" class="text-gray-400" size="12px" />
      </span>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      formTitle: [
        { id: 1, title: 'Data Wargi' },
        { id: 2, title: 'Informasi Aduan' },
        { id: 3, title: 'Foto Aduan' },
        { id: 4, title: 'Lokasi Aduan' },
      ],
    }
  },
  computed: {
    ...mapGetters('citizenComplaintForm', ['currentFormStep']),
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
