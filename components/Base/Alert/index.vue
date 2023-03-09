<template>
  <!-- todo: in design only used alert information, if there is a design for error and approve, you should develop it here  -->
  <div
    v-if="message"
    class="py-[16px] px-[12px] font-lato text-gray-800 bg-[#F9FBFC] border rounded-lg border-[#EFF1F3]"
  >
    <div class="flex justify-start items-start">
      <BaseIconSvg
        :icon="`/icon/info.svg`"
        class="!w-[24px] !h-[24px] !bg-green-600"
      />

      <div class="ml-[13px]">
        <p class="text-[14px] text-gray-800 font-lato">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseAlert',
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>
