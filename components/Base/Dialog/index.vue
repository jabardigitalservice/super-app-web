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
    <div v-show="showPopup" class="fixed w-full bottom-0">
      <div class="flex mr-5">
        <BaseButton
          class="!rounded-full !bg-green-600 !w-[44px] !h-[44px] border-0 mb-4 ml-auto"
          @click="closeHandle"
        >
          <BaseIconSvg :icon="`/icon/close-button.svg`" class="!bg-white" />
        </BaseButton>
      </div>

      <div
        class="bg-white rounded-tr-2xl rounded-tl-2xl overflow-y-auto max-h-[calc(100vh-64px-120px)] "
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
            <slot />
          </p>

          <!-- allert message -->
          <BaseAlert :message="informationMessage" />
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
            @click="submitReject"
          >
            {{ labelButtonReject }}
          </BaseButton>
        </div>
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
    },
    submitReject () {
      this.$emit('reject')
    }
  }
}
</script>
