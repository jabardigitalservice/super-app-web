<template>
  <div class="max-w-xl lg:max-w-2xl w-full flex items-center">
    <ValidationObserver
      v-slot="{ invalid }"
      class="flex items-center w-full max-w-xl"
    >
      <ValidationProvider
        v-slot="{ errors }"
        tag="div"
        class="flex-1"
        name="ID Aduan"
        rules="required|min:5"
      >
        <JdsInputText
          id="search"
          v-model="searchQuery"
          class="w-full text-gray-700 bg-transparent focus:outline-none text-sm"
          :error-message="errors[0]"
          placeholder="Masukan ID Aduan"
        >
          <template #prefix-icon>
            <jds-icon name="magnifier" size="1em" fill="#bdbdbd" />
          </template>
        </JdsInputText>
      </ValidationProvider>
      <BaseButton
        class="text-base font-bold text-white ml-2 dark:border-0 bg-green-700 hover:bg-green-600"
        :disabled="invalid"
        @click="handleInput"
      >
        <BaseIconSvg
          icon="/icon/search.svg"
          class="!w-5 !h-5"
          fill-color="#FFFFFF"
        />
      </BaseButton>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.searchQuery)
    },
  },
}
</script>
