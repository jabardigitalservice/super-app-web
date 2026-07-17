<template>
  <transition name="location-dialog">
    <div
      v-if="open"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 p-4 font-lato"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jalan-aing-location-dialog-title"
    >
      <div class="w-full max-w-md overflow-hidden rounded-2xl border border-jalan-aing-border bg-white shadow-2xl">
        <div class="border-b border-jalan-aing-border px-5 py-4">
          <h2 class="text-base font-bold text-jalan-aing-ink">{{ header }}</h2>
        </div>

        <div class="flex gap-4 p-5">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jalan-aing-primary-soft">
            <Icon :name="nameIcon" :size="size || '24px'" :class="nameIcon === 'warning' ? 'text-red-500' : 'text-jalan-aing-primary'" />
          </div>
          <div>
            <h3 id="jalan-aing-location-dialog-title" class="text-lg font-bold leading-6 text-jalan-aing-ink">{{ title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-jalan-aing-muted">{{ description }}</p>
          </div>
        </div>

        <div class="flex flex-col-reverse gap-2 border-t border-jalan-aing-border bg-jalan-aing-mist/70 p-4 sm:flex-row sm:justify-end">
          <button type="button" class="w-full rounded-xl border border-jalan-aing-primary-border bg-white px-4 py-2.5 text-sm font-bold text-jalan-aing-primary transition hover:bg-jalan-aing-primary-soft sm:w-auto" @click="$emit('close')">
            {{ labelSecondaryButton }}
          </button>
          <button type="button" class="w-full rounded-xl bg-jalan-aing-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-jalan-aing-primary-dark sm:w-auto" @click="$emit('confirm')">
            {{ labelPrimaryButton }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'JalanAingLocationPermissionDialog',
  props: {
    open: { type: Boolean, required: true },
    header: { type: String, default: 'Akses Lokasi' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    labelPrimaryButton: { type: String, default: 'Izinkan Lokasi' },
    labelSecondaryButton: { type: String, default: 'Nanti Saja' },
    nameIcon: { type: String, default: '' },
    size: { type: String, default: '28px' },
  },
}
</script>

<style scoped>
.location-dialog-enter-active,
.location-dialog-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.location-dialog-enter,
.location-dialog-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
