<template>
  <div class="max-w-xl lg:max-w-2xl w-full flex flex-row gap-x-3">
    <div
      class="relative flex items-center w-full border border-gray-300 rounded-[10px]"
    >
      <div class="absolute left-4 flex items-center">
        <BaseIconSvg
          icon="/icon/search.svg"
          class="!w-5 !h-5"
          fillColor="#000000"
        />
      </div>
      <input
        type="text"
        placeholder="Masukan ID Aduan"
        class="w-full pl-12 pr-4 text-gray-700 bg-transparent focus:outline-none text-sm"
        v-model="search"
      />
    </div>
    <BaseButton
      class="text-base font-bold text-white mr-2 dark:border-0 bg-green-700 hover:bg-green-600"
      @click="handleSearch"
    >
      <BaseIconSvg
        icon="/icon/search.svg"
        class="!w-5 !h-5"
        fillColor="#FFFFFF"
      />
    </BaseButton>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
    }
  },
  methods: {
    handleSearch() {
      console.log('test:', this.search)
    },
  },
}
</script>
