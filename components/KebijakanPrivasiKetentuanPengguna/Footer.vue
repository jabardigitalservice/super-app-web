<template>
  <div class="flex justify-center items-center mt-[32px] mb-[21px]">
    <div class="flex-shrink-0 rounded-full bg-green-50 dark:bg-[#292C2A] w-[46px] h-[46px] px-[12px] py-[8px]">
      <Logo class="h-[30px] w-[23px] flex items-center" />
    </div>
    <p class="text-[14px] font-lato text-gray-600 ml-3 dark:text-[#868C89]">
      <span class="text-gray-800 font-bold dark:text-[#E9E9E9]">SAPAWARGA</span> - Copyright &copy; 2022
    </p>
  </div>
</template>

<script>
import Logo from '~/assets/images/logo.svg?inline'

export default {
  name: 'FooterKebijakanPrivasi',
  components: { Logo }
}
</script>
