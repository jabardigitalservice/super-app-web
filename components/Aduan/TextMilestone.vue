<template>
  <p class="font-lato flex flex-col text-[12px] mt-1">
    <span
      v-if="$slots['date-time']"
      class="text-gray-500 mb-1 text-[11px]"
    ><slot name="date-time" /></span>
    <span
      v-if="$slots['information']"
      class="text-gray-600"
    ><slot name="information" /></span>
    <span
      v-if="$slots['status']"
      class="text-gray-900"
    ><slot name="status" /></span>

    <slot />
  </p>
</template>
