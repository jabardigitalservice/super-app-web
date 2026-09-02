<template>
  <div class="overflow-x-auto pb-2">
    <div class="flex min-w-max px-1">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        class="relative flex flex-col items-center"
        :style="{ width: itemWidth + 'px' }"
      >
        <!-- connector: menghubungkan step sebelumnya ke step ini -->
        <div
          v-if="index > 0"
          class="absolute h-0.5"
          :class="connectorClass(item)"
          :style="{
            top: circleSize / 2 - 1 + 'px',
            right: '50%',
            width: itemWidth + 'px',
          }"
        />

        <!-- marker -->
        <div
          class="relative z-10 flex items-center justify-center rounded-full font-bold leading-none"
          :class="markerClass(item)"
          :style="{
            width: circleSize + 'px',
            height: circleSize + 'px',
            fontSize: markerFontSize + 'px',
          }"
        >
          <svg
            v-if="item.status === 'completed'"
            class="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- label -->
        <span
          class="mt-2 text-center leading-tight"
          :class="labelClass(item)"
          :style="{
            maxWidth: labelMaxWidth + 'px',
            fontSize: labelFontSize + 'px',
          }"
        >
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImahAingStepFlow',
  props: {
    /** Array step: { id, label, status: 'completed' | 'active' | 'pending' } */
    items: {
      type: Array,
      default: () => [],
    },
    itemWidth: {
      type: Number,
      default: 84,
    },
    circleSize: {
      type: Number,
      default: 28,
    },
    labelMaxWidth: {
      type: Number,
      default: 76,
    },
    markerFontSize: {
      type: Number,
      default: 12,
    },
    labelFontSize: {
      type: Number,
      default: 10,
    },
  },
  methods: {
    markerClass(item) {
      switch (item.status) {
        case 'completed':
          return 'bg-green-800 text-white dark:bg-green-600'
        case 'active':
          return 'bg-green-500 text-white ring-4 ring-green-100 dark:bg-green-400 dark:ring-green-900/40'
        default:
          return 'bg-gray-200 text-gray-500 dark:bg-dark-emphasis-medium dark:text-dark-text-low'
      }
    },
    connectorClass(item) {
      // garis dianggap "terlewati" kalau step tujuannya completed/active
      return item.status === 'pending'
        ? 'bg-gray-200 dark:bg-dark-emphasis-medium'
        : 'bg-green-800 dark:bg-green-600'
    },
    labelClass(item) {
      return item.status === 'pending'
        ? 'text-gray-400 dark:text-dark-text-low'
        : 'font-medium text-gray-700 dark:text-dark-text-high'
    },
  },
}
</script>
