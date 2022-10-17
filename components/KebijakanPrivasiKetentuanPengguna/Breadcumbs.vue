<template>
  <nav class="flex flex-wrap items-center">
    <div class="inline-block">
      <nuxt-link to="/kebijakan-privasi-ketentuan-pengguna" class="font-lato text-[14px] font-bold text-[#1E88E5]">
        Kebijakan dan Ketentuan
      </nuxt-link>
    </div>
    <div class="inline-block flex-shrink-0 ml-[13px] mr-[17px] mt-1">
      <IconChevronRight class="icon-chevron-right" />
    </div>
    <div class="inline-block">
      <nuxt-link :to="link" class="font-lato text-[14px] font-bold text-gray-800 dark:text-[#20A95A]">
        {{ title }}
      </nuxt-link>
    </div>
  </nav>
</template>

<script>
import IconChevronRight from '~/assets/icon/chevron-right.svg?inline'

export default {
  name: 'BreadcrumbLayout',
  components: {
    IconChevronRight
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    }
  }

}
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
    .icon-chevron-right path {
      fill: #4F5050;
    }
  }
</style>
