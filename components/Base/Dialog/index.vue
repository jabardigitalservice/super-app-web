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
      v-show="showPopup"
      class="fixed w-full h-1/2 md:h-1/3  bottom-0 bg-white rounded-tr-2xl rounded-tl-2xl overflow-y-auto"
    >
      <!-- HEADER -->
      <div class="h-[50px] bg-white py-[16px] px-[24px] rounded-t-lg">
        <h1 class="font-roboto text-[16px] font-bold text-green-600">
          {{ title }}
        </h1>
      </div>

      <!-- body -->
      <div class="px-[24px]">
        <p class="font-lato text-size[14px] text-gray-800 mt-6 md:mt-8 mb-4">
          <slot v-if="$slots['confirmationText']" name="confirmationText" />
        </p>
        <div
          v-if="informationMessage"
          class="py-[16px] px-[12px] font-lato text-gray-800 bg-[#F9FBFC] border rounded-lg border-[#EFF1F3]"
        >
          <div class="flex justify-start items-start">
            <BaseIconSvg
              :icon="`/icon/info.svg`"
              class="!w-[24px] !h-[24px] !bg-green-600"
            />

            <div class="ml-[13px]">
              <p class="text-[14px] text-gray-800 font-lato">
                {{ informationMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="h-fit px-[24px] justify-center py-[16px]">
        <BaseButton
          v-if="labelButtonApprove"
          class="border w-full bg-green-600 text-white rounded-lg text-[14px] font-lato"
          @click="submitHandle"
        >
          {{ labelButtonApprove }}
        </BaseButton>
        <BaseButton
          v-if="labelButtonReject"
          class="w-full border-none bg-white text-green-700 text-[14px] font-lato mt-4"
          @click="submitHandle"
        >
          {{ labelButtonReject }}
        </BaseButton>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: {
    showPopup: {
      type: Boolean,
      default: false
    },
    disabledButton: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    labelButtonApprove: {
      type: String,
      default: ''
    },
    labelButtonReject: {
      type: String,
      default: ''
    },
    informationMessage: {
      type: String,
      default: ''
    }
  },
  methods: {
    closeHandle () {
      this.$emit('close')
    },
    submitHandle () {
      this.$emit('submit')
    }
  }
}
</script>
