<template>
  <section class="mx-auto max-w-2xl px-4 py-8 font-lato sm:py-12">
    <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
      <div>
        <h2 class="flex items-center gap-2 text-xl font-bold text-slate-800"><Icon name="magnifier" size="20px" /> Lacak Aduan Jalan Jabar</h2>
        <p class="mt-1 text-xs text-slate-500">Masukkan nomor tiket untuk melihat proses penanganan</p>
      </div>
      <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="$emit('submit')">
        <input :value="value" type="text" placeholder="Contoh: JA-20250115-00042" class="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-800 outline-none transition focus:border-jalan-aing-primary" @input="$emit('input', $event.target.value)">
        <button type="submit" class="rounded-xl bg-jalan-aing-primary px-6 py-3 font-bold text-white shadow-md transition hover:bg-jalan-aing-primary-dark">Lacak Aduan</button>
      </form>
      <div class="rounded-xl border border-slate-200/50 bg-slate-50 p-3 text-xs text-slate-500">
        Tracking detail tetap memakai route backend yang sudah ada; tab ini mengikuti layout Lacak Aduan dari prototype.
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'JalanAingTrackingPage',
  props: {
    value: { type: String, default: '' },
  },
}
</script>
