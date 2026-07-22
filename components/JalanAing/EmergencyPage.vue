<template>
  <section class="mx-auto max-w-3xl px-4 py-8 font-lato sm:py-12">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 class="text-2xl font-bold text-slate-800">Nomor Darurat</h2>
      <p class="mt-1 text-sm text-slate-500">Hubungi BPBD setempat saat terjadi bencana atau hambatan darurat di jalan.</p>
      <p v-if="loading" class="mt-8 text-sm text-slate-500">Memuat nomor darurat…</p>
      <p v-else-if="error" class="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Nomor darurat belum dapat dimuat. Silakan coba kembali nanti.</p>
      <ul v-else class="mt-6 divide-y divide-slate-100">
        <li v-for="item in contacts" :key="item.name" class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span class="font-semibold text-slate-800">{{ item.name }}</span>
          <a :href="`tel:${phone(item.number)}`" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-jalan-aing-primary px-4 text-sm font-bold text-white hover:bg-jalan-aing-primary-dark">{{ item.number }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { csvRecords } from '~/utils/jalan-aing-csv'

const BPBD_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1JSiHBGrGJztFuPgyYtkYJ3s8yTZPfEYnqKYrocUpN0w/gviz/tq?tqx=out:csv&gid=1000995846'

export default {
  name: 'JalanAingEmergencyPage',
  data: () => ({ contacts: [], loading: true, error: false }),
  async mounted() {
    try {
      const response = await fetch(BPBD_SHEET_URL)
      if (!response.ok) throw new Error('BPBD unavailable')
      this.contacts = csvRecords(await response.text()).map((item) => ({ name: item.Keterangan, number: item.Nomor })).filter((item) => item.name && item.number)
    } catch (error) {
      this.error = true
    } finally {
      this.loading = false
    }
  },
  methods: { phone: (number) => number.replace(/[^+\d]/g, '').split('+').join('+') },
}
</script>
