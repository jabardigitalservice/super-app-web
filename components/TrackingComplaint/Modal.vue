<template>
  <BaseModal :is-open="open" @close="$emit('close')">
    <template #header>
      <h4 class="font-roboto text-[21px] font-bold leading-8 text-green-800">
        {{ header }}
      </h4>
    </template>
    <template #content>
      <div
        :class="{
          'w-full flex justify-center gap-4 px-4 min-h-[80px] py-6 md:justify-start': true,
          'flex-col md:flex-row': srcIcon,
          'flex-row': nameIcon,
        }"
      >
        <div
          :class="{
            'w-full md:max-w-fit': srcIcon,
            'max-w-fit': nameIcon,
          }"
        >
          <Icon
            :class="{
              'mx-auto': srcIcon,
              'pt-2': nameIcon,
              'text-red-500': nameIcon === 'warning',
              'text-green-700': nameIcon === 'check-mark-circle',
            }"
            :src="srcIcon"
            :name="nameIcon"
            :size="size"
          />
        </div>
        <div>
          <h3
            class="pb-1 font-roboto text-[20px] leading-7 text-center font-semibold text-gray-900 md:text-left"
          >
            {{ title }}
          </h3>
          <p
            class="font-lato text-[14px] leading-[23px] text-gray-600 text-left"
          >
            {{ description }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div
        class="min-h-[80px] flex flex-col px-4 pb-4 gap-4 items-center md:pb-0 md:flex-row-reverse"
      >
        <Button
          class="w-full !justify-center md:!justify-start md:w-fit"
          variant="primary"
          @click="$emit('click')"
        >
          {{ labelPrimaryButton }}
        </Button>
        <Button
          class="w-full !justify-center md:!justify-start md:w-fit"
          variant="secondary"
          @click="$emit('close')"
        >
          {{ labelSecondaryButton }}
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    header: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    labelPrimaryButton: {
      type: String,
      default: '',
    },
    labelSecondaryButton: {
      type: String,
      default: '',
    },
    headerCloseButton: {
      type: Boolean,
      default: false,
    },
    srcIcon: {
      type: String,
      default: '',
    },
    nameIcon: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: null,
    },
  },
}
</script>
