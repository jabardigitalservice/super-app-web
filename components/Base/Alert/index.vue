<template>
  <transition
    name="fade"
    enter-active-class="transition ease-out duration-75"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-75"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="message"
      class="py-[16px] px-[12px] font-lato bg-[#F9FBFC] border rounded-lg border-[#EFF1F3] dark:bg-dark-emphasis-medium"
    >
      <div class="flex justify-start items-start">
        <BaseIconSvg
          :icon="`/icon/info.svg`"
          class="!w-[24px] !h-[24px] !bg-green-600"
        />

        <div class="ml-[13px]">
          <p
            class="text-[14px] text-gray-800 font-lato dark:text-dark-text-medium"
          >
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </transition>
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
