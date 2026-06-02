<template>
  <div class="flex flex-col gap-3 md:gap-4">
    <div
      v-for="n in 5"
      :key="n"
      class="flex gap-3 px-4 py-[14px] md:p-4 border-l-4 border-gray-200 animate-pulse bg-white dark:bg-dark-emphasis-low"
    >
      <div class="w-5 h-5 bg-gray-200 dark:bg-dark-emphasis-medium rounded flex-shrink-0 mt-1" />
      <div class="flex-1">
        <div class="h-3 bg-gray-200 dark:bg-dark-emphasis-medium rounded w-1/3 mb-2" />
        <div class="h-4 bg-gray-200 dark:bg-dark-emphasis-medium rounded w-2/3 mb-1" />
        <div class="flex justify-between items-center mt-2">
          <div class="h-3 bg-gray-200 dark:bg-dark-emphasis-medium rounded w-1/4" />
          <div class="h-3 bg-gray-200 dark:bg-dark-emphasis-medium rounded w-1/4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImahAingHistorySkeleton'
}
</script>
