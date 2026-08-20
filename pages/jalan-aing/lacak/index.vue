<template>
  <div class="ja-tracking-page">
    <JalanAingHeader active="lacak" sticky />

    <main class="ja-tracking-main">
      <section class="ja-tracking-intro" aria-labelledby="tracking-title">
        <p>Lacak status</p>
        <h1 id="tracking-title">Pantau penanganan aduan Anda.</h1>
        <span>Masukkan nomor tiket untuk melihat perkembangan laporan jalan.</span>
      </section>

      <section class="ja-tracking-search" aria-labelledby="ticket-heading">
        <div>
          <h2 id="ticket-heading">Nomor tiket aduan</h2>
          <p>Nomor tiket diberikan setelah laporan berhasil dikirim.</p>
        </div>
        <form @submit.prevent="trackTicket">
          <label for="tracking-ticket">Nomor tiket <span aria-hidden="true">*</span></label>
          <div>
            <input id="tracking-ticket" v-model.trim="ticket" type="text" required minlength="5" autocomplete="off" placeholder="Contoh: JA-20250115-00042" :aria-invalid="Boolean(error)" aria-describedby="tracking-ticket-error" @input="error = ''">
            <button type="submit">Lacak aduan <Icon name="arrow-right" size="16px" aria-hidden="true" /></button>
          </div>
          <small id="tracking-ticket-error" :class="{ 'is-error': error }">{{ error || 'Gunakan nomor tiket yang tercantum pada bukti pengiriman.' }}</small>
        </form>
      </section>

      <section v-if="submittedTicket" class="ja-tracking-result" aria-live="polite" aria-labelledby="timeline-heading">
        <section class="ja-complaint-summary" aria-label="Ringkasan aduan">
          <header>
            <div>
              <p>{{ submittedTicket }}</p>
              <h2>Lubang jalan dalam dekat Simpang Tamblong</h2>
            </div>
            <span>Diproses</span>
          </header>
          <dl>
            <div><dt><Icon name="calendar-date-outline" size="21px" aria-hidden="true" /> Dibuat</dt><dd>10 Jul 2026</dd></div>
            <div><dt><Icon src="/icon/pin-complaint.svg" size="21px" aria-hidden="true" /> Posisi</dt><dd>-6.9210, 107.6110</dd></div>
          </dl>
          <section>
            <h3>Deskripsi masalah</h3>
            <p>Terdapat lubang cukup besar dan dalam di lajur kiri jalan dekat persimpangan Tamblong. Sangat membahayakan pengendara motor saat hujan karena tertutup genangan air.</p>
          </section>
          <figure class="ja-complaint-photo-placeholder">
            <Icon name="eye" size="22px" aria-hidden="true" />
            <figcaption>Foto bukti akan tampil di sini</figcaption>
          </figure>
        </section>

        <div class="ja-tracking-result-head">
          <div>
            <p>Riwayat aduan</p>
            <h2 id="timeline-heading">Status laporan {{ submittedTicket }}</h2>
          </div>
          <span>Terakhir diperbarui hari ini</span>
        </div>

        <ol class="ja-timeline">
          <li v-for="(item, index) in timeline" :key="item.status" :class="{ 'is-current': index === timeline.length - 1 }">
            <div class="ja-timeline-marker" aria-hidden="true">
              <Icon :name="index === timeline.length - 1 ? 'refresh' : 'check-mark-circle'" size="15px" />
            </div>
            <article>
              <header>
                <h3>{{ item.status }}</h3>
                <time>{{ item.time }}</time>
              </header>
              <p>{{ item.description }}</p>
              <aside v-if="item.note">
                <Icon name="info-circle-outline" size="19px" aria-hidden="true" />
                <div>
                  <strong>Catatan Petugas Lapangan</strong>
                  <p>{{ item.note }}</p>
                </div>
              </aside>
            </article>
          </li>
        </ol>
      </section>
    </main>

    <JalanAingFooter />
  </div>
</template>

<script>
const timeline = [
  { status: 'Terkirim', time: '15 Jan 2025, 08:30', description: 'Laporan kerusakan berhasil dicatat dan menunggu peninjauan petugas.' },
  { status: 'Diverifikasi', time: '15 Jan 2025, 14:22', description: 'Laporan telah ditinjau dan dinyatakan valid oleh tim verifikator. Koordinasi lanjutan diteruskan ke dinas regional.' },
  { status: 'Diproses (Sedang Dikerjakan)', time: '16 Jan 2025, 09:15', description: 'Laporan sedang ditindaklanjuti di lapangan oleh tim penanganan wilayah.', note: 'Proses penanganan dan perbaikan sedang berlangsung. Diupayakan selesai dalam waktu dekat.' },
]

export default {
  name: 'JalanAingTrackingPage',
  data() {
    return { ticket: '', submittedTicket: '', error: '', timeline }
  },
  mounted() {
    const ticket = String(this.$route.query.ticket || '').trim().toUpperCase()
    if (!ticket) return
    this.ticket = ticket
    this.submittedTicket = ticket
  },
  methods: {
    trackTicket() {
      const ticket = this.ticket.trim().toUpperCase()
      if (ticket.length < 5) {
        this.error = 'Masukkan nomor tiket yang valid.'
        return
      }
      this.ticket = ticket
      this.submittedTicket = ticket
      this.$router.replace({ query: { ...this.$route.query, ticket } })
    },
  },
}
</script>

<style scoped>
.ja-tracking-page { --ja-ink: #14233f; --ja-rule: #dce7e0; --ja-green: #0d6d43; min-height: 100vh; background: #f5f5f7; color: var(--ja-ink); font-family: Roboto, sans-serif; }
.ja-tracking-main { width: min(1000px, calc(100% - 48px)); margin: 0 auto; padding: clamp(38px, 6vw, 74px) 0 80px; }
.ja-tracking-intro { max-width: 620px; margin-bottom: 32px; }
.ja-tracking-intro p, .ja-tracking-result-head p { margin: 0; color: var(--ja-green); font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.ja-tracking-intro h1 { margin: 8px 0 7px; font-size: clamp(28px, 4vw, 40px); font-weight: 700; letter-spacing: -.035em; line-height: 1.1; }
.ja-tracking-intro span { color: #68758a; font-size: 16px; line-height: 1.5; }
.ja-tracking-search, .ja-tracking-result { border: 1px solid #dfe5e8; border-radius: 16px; background: #fff; }
.ja-tracking-search { display: grid; grid-template-columns: minmax(220px, .9fr) minmax(380px, 1.4fr); gap: 38px; padding: clamp(22px, 4vw, 34px); }
.ja-tracking-search h2 { margin: 0 0 7px; font-size: 19px; letter-spacing: -.02em; }
.ja-tracking-search p { margin: 0; color: #68758a; font-size: 14px; line-height: 1.5; }
.ja-tracking-search label { display: block; margin-bottom: 9px; color: #536176; font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.ja-tracking-search label span { color: #c94b4b; }
.ja-tracking-search form > div { display: flex; gap: 10px; }
.ja-tracking-search input { min-width: 0; flex: 1; height: 48px; box-sizing: border-box; padding: 0 14px; border: 1px solid #d9dfe3; border-radius: 10px; background: #fff; color: var(--ja-ink); font: inherit; font-size: 15px; font-weight: 600; letter-spacing: .03em; outline: 0; text-transform: uppercase; }
.ja-tracking-search input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #fff inset; -webkit-text-fill-color: var(--ja-ink); }
.ja-tracking-search input::placeholder { color: #9aa5b5; font-weight: 400; letter-spacing: 0; text-transform: none; }
.ja-tracking-search input:focus { border-color: #81938a; box-shadow: 0 0 0 3px rgba(13, 109, 67, .12); }
.ja-tracking-search input[aria-invalid='true'] { border-color: #c94b4b; }
.ja-tracking-search button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 7px; padding: 0 17px; border: 1px solid var(--ja-green); border-radius: 10px; background: var(--ja-green); color: #fff; font: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: background-color 160ms ease, transform 120ms ease-out; white-space: nowrap; }
.ja-tracking-search button:hover { background: #095b38; }
.ja-tracking-search button:active { transform: scale(.97); }
.ja-tracking-search small { display: block; margin-top: 8px; color: #7c8798; font-size: 12px; }
.ja-tracking-search small.is-error { color: #a02c2c; font-weight: 600; }
.ja-tracking-result { margin-top: 18px; padding: clamp(20px, 3vw, 28px); }
.ja-complaint-summary { margin-bottom: 26px; padding-bottom: 26px; border-bottom: 1px solid var(--ja-rule); }
.ja-complaint-summary > header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.ja-complaint-summary > header p { margin: 0 0 7px; color: #8c9bb3; font-size: 13px; font-weight: 700; letter-spacing: .06em; }
.ja-complaint-summary > header h2 { margin: 0; font-size: clamp(21px, 2.6vw, 27px); letter-spacing: -.025em; line-height: 1.2; }
.ja-complaint-summary > header > span { flex: 0 0 auto; padding: 7px 13px; border: 1px solid #c6b2f3; border-radius: 999px; background: #faf7ff; color: #6930ca; font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.ja-complaint-summary dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin: 22px 0; padding: 18px 0; border-top: 1px solid #edf0f2; border-bottom: 1px solid #edf0f2; }
.ja-complaint-summary dl div { display: flex; align-items: center; gap: 10px; }
.ja-complaint-summary dt { display: inline-flex; align-items: center; gap: 7px; color: #536176; font-size: 14px; font-weight: 700; }
.ja-complaint-summary dd { margin: 0; color: var(--ja-ink); font-size: 14px; font-weight: 600; }
.ja-complaint-summary dt :deep(img) { object-fit: contain; }
.ja-complaint-summary section { padding: 17px 18px; border: 1px solid #dce5ee; border-radius: 12px; background: #f8fafc; }
.ja-complaint-summary section h3 { margin: 0 0 8px; color: #8c9bb3; font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.ja-complaint-summary section p { margin: 0; color: #4a5870; font-size: 15px; font-weight: 500; line-height: 1.5; }
.ja-complaint-photo-placeholder { display: grid; min-height: 144px; place-items: center; gap: 8px; margin: 18px 0 0; border: 1px dashed #c7d3dc; border-radius: 12px; background: linear-gradient(135deg, #edf6f1, #f6f8fa); color: #68758a; text-align: center; }
.ja-complaint-photo-placeholder figcaption { font-size: 13px; font-weight: 600; }
.ja-tracking-result-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding-bottom: 18px; border-bottom: 1px solid var(--ja-rule); }
.ja-tracking-result-head h2 { margin: 6px 0 0; font-size: 21px; letter-spacing: -.025em; }
.ja-tracking-result-head > span { color: #7c8798; font-size: 12px; font-weight: 600; }
.ja-timeline { margin: 20px 0 0; padding: 0; list-style: none; }
.ja-timeline li { position: relative; display: grid; grid-template-columns: 36px 1fr; gap: 14px; min-height: 0; }
.ja-timeline li:not(:last-child)::before { position: absolute; top: 30px; bottom: 0; left: 17px; width: 1px; background: #dce5ee; content: ''; }
.ja-timeline-marker { position: relative; z-index: 1; display: grid; width: 34px; height: 34px; place-items: center; border: 5px solid #f2f7f4; border-radius: 50%; box-sizing: border-box; background: #fff; color: #29b97b; }
.ja-timeline li.is-current .ja-timeline-marker { border-color: #eff4fc; color: #2962ba; }
.ja-timeline article { padding-bottom: 20px; }
.ja-timeline article header { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; }
.ja-timeline h3 { margin: 0; font-size: 18px; letter-spacing: -.02em; }
.ja-timeline li.is-current h3, .ja-timeline li.is-current time { color: #2962ba; }
.ja-timeline time { color: #8c9bb3; font-size: 12px; font-weight: 700; letter-spacing: .04em; white-space: nowrap; }
.ja-timeline article > p { margin: 6px 0 0; color: #62718a; font-size: 15px; line-height: 1.45; }
.ja-timeline aside { display: flex; gap: 10px; margin-top: 12px; padding: 14px 16px; border: 1px solid #dce5ee; border-radius: 10px; background: #f8fafc; color: #2962ba; }
.ja-timeline aside strong { display: block; color: #334155; font-size: 14px; }
.ja-timeline aside p { margin: 4px 0 0; color: #52627b; font-size: 14px; line-height: 1.45; }
.ja-tracking-search input:focus-visible, .ja-tracking-search button:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
@media (max-width: 640px) { .ja-tracking-main { padding-bottom: calc(80px + env(safe-area-inset-bottom)); } }
@media (max-width: 700px) { .ja-tracking-main { width: min(100% - 32px, 560px); padding-top: 32px; } .ja-tracking-search { grid-template-columns: 1fr; gap: 22px; } .ja-tracking-search form > div { display: grid; grid-template-columns: 1fr; } .ja-complaint-summary > header { display: block; } .ja-complaint-summary > header > span { display: inline-block; margin-top: 12px; } .ja-complaint-summary dl { grid-template-columns: 1fr; gap: 12px; } .ja-tracking-result-head { display: block; } .ja-tracking-result-head > span { display: block; margin-top: 9px; } .ja-timeline li { grid-template-columns: 34px 1fr; gap: 10px; } .ja-timeline-marker { width: 32px; height: 32px; border-width: 4px; } .ja-timeline li:not(:last-child)::before { top: 28px; left: 16px; } .ja-timeline article header { display: block; } .ja-timeline time { display: block; margin-top: 4px; } }
@media (prefers-reduced-motion: reduce) { .ja-tracking-search button { transition: none; } .ja-tracking-search button:active { transform: none; } }
</style>
