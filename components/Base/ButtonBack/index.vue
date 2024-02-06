<template>
  <div v-if="$route.query.origin" class="font-bold h-[50px] border-b bg-white flex items-center dark:border-dark-emphasis-medium dark:bg-black sticky top-0 z-10">
    <button class="flex items-center" @click="$router.go(-1)">
      <BaseIconSvg :icon="`/icon/arrow-left.svg`" class="w-[44px] h-[44px] bg-black dark:!bg-white ml-3" />
      <span class="text-gray-900 dark:text-dark-text-high ml-2">Kembali</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'BaseButtonBack'

}
</script>
