<template>
  <div class="mx-auto max-w-6xl space-y-12 px-4 py-8 font-lato sm:px-6">
    <section class="relative flex min-h-[360px] flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/50 via-white to-slate-100/50 p-8 sm:p-12">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(21,101,192,0.08),transparent_60%)]" />
      <div class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-10 lg:block">
        <div class="jalan-aing-hero-map h-full w-full" />
      </div>

      <div class="relative z-10 max-w-xl space-y-6">
        <div class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-jalan-aing-primary">
          <span class="h-2 w-2 animate-pulse rounded-full bg-jalan-aing-primary" />
          GIS Terpadu Provinsi Jawa Barat
        </div>
        <div class="space-y-3">
          <h1 class="text-4xl font-bold leading-tight tracking-tight text-jalan-aing-primary">
            Jalan Aing
          </h1>
          <p class="text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
            Platform Geospasial Pelayanan Jalan Provinsi Jawa Barat. Cari informasi infrastruktur jalan, faskes, CCTV, APJ, serta laporkan kerusakan jalan di sekitar Anda dalam hitungan detik.
          </p>
        </div>
        <div class="flex flex-col gap-3 pt-4 sm:flex-row">
          <button type="button" class="flex items-center justify-center gap-2 rounded-lg bg-jalan-aing-primary px-8 py-3.5 font-bold text-white transition-all hover:bg-jalan-aing-primary-dark active:scale-95" @click="$emit('open-map')">
            <Icon src="/icon/pin-map.svg" size="18px" />
            Buka Peta Interaktif
            <Icon name="chevron-right" size="16px" />
          </button>
          <button type="button" class="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-8 py-3.5 font-bold text-slate-700 transition-all hover:bg-slate-200" @click="$emit('open-complaint')">
            <Icon name="pencil-outline" size="18px" />
            Buat Aduan Masyarakat
          </button>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      <article v-for="stat in statistics" :key="stat.label" class="space-y-2 rounded-xl border p-5 transition-all duration-200 hover:-translate-y-1 sm:p-6" :class="stat.highlight ? 'border-blue-100 bg-blue-50/20' : 'border-slate-100 bg-white'">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="stat.iconClass"><Icon :name="stat.icon" size="20px" /></div>
        <h3 class="text-2xl font-bold text-slate-800">{{ stat.value }} <span class="text-xs font-semibold text-slate-400">{{ stat.unit }}</span></h3>
        <p class="text-xs font-semibold text-slate-700">{{ stat.label }}</p>
        <p class="text-xs text-slate-400">{{ stat.note }}</p>
      </article>
    </section>

  </div>
</template>

<script>
export default {
  name: 'JalanAingHomePage',
  props: {
    statistics: { type: Array, required: true },
  },
}
</script>

<style scoped>
.jalan-aing-hero-map {
  background-image:
    linear-gradient(145deg, transparent 0 38%, rgba(21, 101, 192, 0.25) 38% 40%, transparent 40% 58%, rgba(21, 101, 192, 0.2) 58% 60%, transparent 60%),
    linear-gradient(35deg, transparent 0 42%, rgba(100, 116, 139, 0.4) 42% 43%, transparent 43% 68%, rgba(100, 116, 139, 0.3) 68% 69%, transparent 69%);
  transform: rotate(-12deg) scale(1.3);
}
</style>
