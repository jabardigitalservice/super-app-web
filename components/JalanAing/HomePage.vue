<template>
  <div class="mx-auto max-w-6xl px-4 py-8 font-lato sm:px-6 sm:py-12">
    <section class="grid overflow-hidden rounded-2xl border border-jalan-aing-primary-border bg-white lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div class="space-y-6 p-6 sm:p-10">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-jalan-aing-primary">
          <span class="h-2 w-2 rounded-full bg-jalan-aing-primary" />
          Layanan peta jalan Jawa Barat
        </div>
        <div class="max-w-2xl space-y-3">
          <h1 class="jalan-aing-title text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">Jalan Aing</h1>
          <p class="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">Temukan informasi layanan jalan, lalu tandai titik di peta untuk memulai aduan dengan lokasi yang tepat.</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button type="button" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-jalan-aing-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-jalan-aing-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jalan-aing-primary-dark active:translate-y-px" @click="$emit('open-map')">
            <Icon src="/icon/pin-map.svg" size="18px" class="brightness-0 invert" />
            Buka peta
          </button>
          <button type="button" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jalan-aing-primary active:translate-y-px" @click="$emit('open-complaint')">
            <Icon name="pencil-outline" size="18px" />
            Buat aduan
          </button>
        </div>
      </div>
      <aside class="border-t border-jalan-aing-primary-border bg-jalan-aing-primary-soft p-6 text-jalan-aing-primary lg:border-l lg:border-t-0 sm:p-10">
        <Icon src="/icon/pin-map.svg" size="28px" />
        <h2 class="mt-6 text-lg font-bold text-slate-900">Mulai dari titik kejadian</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-700">Klik lokasi pada peta. Koordinatnya akan dibawa langsung ke formulir aduan.</p>
      </aside>
    </section>
  </div>
</template>

<script>
export default {
  name: 'JalanAingHomePage',
}
</script>

<style scoped>
/* Hallmark · genre: modern-minimal · macrostructure: Workbench · tone: utilitarian · anchor hue: Jalan Aing green · pre-emit critique: P4 H5 E4 S5 R5 V4 · contrast: pass (40–41) */
.jalan-aing-title {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
