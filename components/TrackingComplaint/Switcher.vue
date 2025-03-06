<template>
  <div class="w-full h-[44px]">
    <ul class="sm:max-w-fit p-1 bg-gray-100 rounded-xl h-full">
      <li class="grid grid-cols-2 w-full">
        <button
          v-for="(tab, index) in items"
          :key="tab + index"
          :class="{
            'text-gray-500': selectedTab !== tab,
            'bg-white rounded-xl text-black font-semibold': selectedTab === tab,
            'rounded-l-lg': index === 0,
            'rounded-r-lg': index === items.length - 1,
          }"
          class="w-full p-2 rounded-l-lg text-sm"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedTab: this.items[0],
    }
  },
  methods: {
    switchTab(tab) {
      this.selectedTab = tab
      this.$emit('click', this.selectedTab)
    },
  },
}
</script>
