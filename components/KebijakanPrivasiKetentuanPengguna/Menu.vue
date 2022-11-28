<template>
  <div class="border-b-2 border-gray-100 dark:border-[#292C2A] mb-[24px] lg:dark:border-0 lg:mx-5 xl:mx-3">
    <div class="lg:flex justify-center items-start p-[16px]">
      <div class="flex-shrink-0">
        <component :is="icon" class="icon" />
      </div>
      <div class="lg:ml-5 mt-5 lg:mt-0 min-w-0 flex-1">
        <h1 class="uppercase text-[16px] font-roboto font-bold">
          {{ title }}
        </h1>
        <p class="text-[14x] font-lato mt-3 mb-3 text-[#424242]">
          {{ description }}
        </p>
        <NuxtLink :to="link" class="font-lato text-green-600 font-bold text-[14px] mb-3">
          Baca {{ title }} Kami
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import IconKetentuanPengguna from '~/assets/icon/ketentuan-pengguna.svg?inline'
import IconKebijakanPrivasi from '~/assets/icon/kebijakan-privasi.svg?inline'

export default {
  name: 'MenuPrivasi',
  components: { IconKebijakanPrivasi, IconKetentuanPengguna },
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
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
  p{
    color: #AAB0B7;
  }
  .icon rect{
    fill: #292C2A;
  }
}

@media (prefers-color-scheme: dark) and (min-width:1024px) {
  .border-style{
    border:none
  }
}
</style>
