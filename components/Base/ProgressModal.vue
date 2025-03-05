<template>
  <BaseModal :is-open="open">
    <template #header>
      <h4 class="font-roboto text-[21px] font-bold leading-8 text-green-800">
        {{ header }}
      </h4>
    </template>
    <template #content>
      <div class="w-full p-4 min-h-[80px] flex items-center justify-center">
        <p class="text-sm leading-6 text-blue-gray-800 text-center">
          {{ message }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="bg-gray-50 p-4 min-h-[80px] flex justify-center items-center">
        <progress max="100" :value="value" />
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
    value: {
      type: Number,
      default: 0,
      required: true,
    },
    header: {
      type: String,
      default: 'Mengirim Aduan',
    },
    message: {
      type: String,
      default: 'Mohon tunggu, pengiriman Aduan sedang diproses.',
    },
  },
}
</script>

<style scoped>
progress {
  width: 100%;
  height: 14px;
}
progress::-webkit-progress-bar {
  background-color: #f5f5f5;
  border-radius: 4px;
}
progress::-moz-progress-bar {
  background-color: #f5f5f5;
  border-radius: 4px;
}
progress::-webkit-progress-value {
  background-color: #069550;
  border-radius: 4px;
  -webkit-transition: width 0.2s ease;
  -moz-transition: width 0.2s ease;
  -o-transition: width 0.2s ease;
  transition: width 0.2s ease;
}
</style>
