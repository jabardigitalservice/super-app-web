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
            <input id="tracking-ticket" v-model.trim="ticket" type="text" required minlength="5" autocomplete="off" placeholder="Contoh: JA202608310001" :aria-invalid="Boolean(error)" aria-describedby="tracking-ticket-error" @input="error = ''">
            <button type="submit" :disabled="isLoading">{{ isLoading ? 'Melacak…' : 'Lacak aduan' }} <Icon name="arrow-right" size="16px" aria-hidden="true" /></button>
          </div>
          <small id="tracking-ticket-error" :class="{ 'is-error': error }">{{ error || 'Gunakan nomor tiket yang tercantum pada bukti aduan Anda.' }}</small>
        </form>
      </section>

      <section v-if="isLoading" class="ja-tracking-result ja-tracking-loading" aria-live="polite">
        <span aria-hidden="true" />
        <p>Sedang mencari aduan Anda…</p>
      </section>

      <section v-else-if="complaint" class="ja-tracking-result" aria-live="polite" aria-labelledby="timeline-heading">
        <section class="ja-complaint-summary" aria-label="Ringkasan aduan">
          <header>
            <div>
              <p>{{ complaint.ticket }}</p>
              <h2>{{ complaint.title }}</h2>
            </div>
            <span :class="`is-${complaint.statusVariant}`">{{ complaint.statusName }}</span>
          </header>
          <dl>
            <div><dt><Icon name="calendar-date-outline" size="21px" aria-hidden="true" /> Dibuat</dt><dd>{{ complaint.createdAt }}</dd></div>
            <div><dt><Icon src="/icon/pin-complaint.svg" size="21px" aria-hidden="true" /> Lokasi</dt><dd>{{ complaint.address }}</dd></div>
            <div v-if="complaint.coordinates"><dt><Icon src="/icon/pin-complaint.svg" size="21px" aria-hidden="true" /> Koordinat</dt><dd>{{ complaint.coordinates }}</dd></div>
            <div v-if="complaint.source"><dt><Icon name="share" size="21px" aria-hidden="true" /> Sumber</dt><dd>{{ complaint.source }}</dd></div>
          </dl>
          <div v-if="complaint.category || complaint.subcategory" class="ja-complaint-tags">
            <span v-if="complaint.category">{{ complaint.category }}</span>
            <span v-if="complaint.subcategory">{{ complaint.subcategory }}</span>
          </div>
          <section>
            <h3>Deskripsi masalah</h3>
            <p>{{ complaint.description }}</p>
          </section>
          <div v-if="complaint.photos.length" class="ja-complaint-photos">
            <button v-for="(photo, index) in complaint.photos" :key="photo" type="button" class="ja-complaint-photo" :aria-label="`Perbesar foto bukti ${index + 1}`" @click="openPhotoPreview(photo)">
              <img :src="photo" :alt="`Foto bukti aduan ${index + 1}`" loading="lazy" @error="hideBrokenPhoto">
              <span class="ja-complaint-photo-zoom" aria-hidden="true"><Icon name="eye" size="18px" /></span>
            </button>
          </div>
          <figure v-else class="ja-complaint-photo-placeholder">
            <Icon name="eye" size="22px" aria-hidden="true" />
            <figcaption>Foto bukti tidak tersedia</figcaption>
          </figure>
        </section>

        <div class="ja-tracking-result-head">
          <div>
            <p>Riwayat aduan</p>
            <h2 id="timeline-heading">Status laporan {{ complaint.ticket }}</h2>
          </div>
          <span>Terakhir diperbarui {{ complaint.updatedAt }}</span>
        </div>

        <ol class="ja-timeline">
          <li v-for="(item, index) in timeline" :key="item.status" :class="{ 'is-current': index === timeline.length - 1 }">
            <div class="ja-timeline-marker" aria-hidden="true">
              <BaseIconSvg :icon="`/icon/${item.icon}`" :size="16" :fill-color="index === timeline.length - 1 ? '#2962ba' : '#29b97b'" />
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

    <dialog v-if="selectedPhoto" ref="photoDialog" class="ja-photo-dialog" aria-label="Pratinjau foto bukti" @close="selectedPhoto = ''" @click.self="closePhotoPreview">
      <button type="button" class="ja-photo-dialog-close" aria-label="Tutup pratinjau" @click="closePhotoPreview"><Icon name="times" size="18px" aria-hidden="true" /></button>
      <img :src="selectedPhoto" alt="Pratinjau besar foto bukti aduan">
    </dialog>
  </div>
</template>

<script>
const formatTimestamp = (value) => {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(value))
  } catch (_) {
    return '-'
  }
}

export default {
  name: 'JalanAingTrackingPage',
  data() {
    return {
      ticket: '',
      error: '',
      isLoading: false,
      complaint: null,
      timeline: [],
      selectedPhoto: '',
    }
  },
  mounted() {
    // Tiket hanya terisi otomatis saat datang dari dialog sukses (via store,
    // tanpa query URL). Setelah refresh store kosong → pengguna memasukkan
    // nomor tiket secara manual.
    const ticket = String(this.$store.state.aduan.lastComplaintTicket || '').trim().toUpperCase()
    this.$store.commit('aduan/setLastComplaintTicket', '')
    if (!ticket) return
    this.ticket = ticket
    this.fetchComplaint(ticket)
  },
  methods: {
    async fetchComplaint(ticket) {
      this.error = ''
      this.isLoading = true
      this.complaint = null
      try {
        const token = await this.$getToken('client_credentials')
        const response = await this.$gatewayPartnerAPI.get('/aduan/complaints', {
          headers: { Authorization: `Bearer ${token}` },
          params: { phase: 'verification', search: ticket, limit: 5 },
        })
        const items = response.data?.data?.data || []
        const item = items.find((entry) => (entry.complaint_id || '').toUpperCase() === ticket) || items[0]
        if (!item) {
          this.error = `Aduan dengan nomor tiket ${ticket} tidak ditemukan. Periksa kembali nomor tiket Anda.`
          return
        }

        const statusId = (item.complaint_status?.id || item.status_id || '').toLowerCase()
        const statusName = item.complaint_status?.name || item.status_id || 'Terkirim'
        const photos = Array.isArray(item.photos) ? item.photos.map((photo) => photo?.url).filter(Boolean) : []
        const latitude = item.location_latitude || item.latitude
        const longitude = item.location_longitude || item.longitude

        this.complaint = {
          ticket: item.complaint_id || ticket,
          title: item.title || item.complaint_subcategory?.name || item.complaint_category?.name || 'Aduan Jalan Aing',
          description: item.description || 'Tidak ada deskripsi.',
          statusName,
          statusVariant: this.statusVariant(statusId),
          createdAt: formatTimestamp(item.created_at),
          updatedAt: formatTimestamp(item.updated_at || item.created_at),
          address: item.address || item.address_title || [item.village_name, item.district_name, item.city_name].filter(Boolean).join(', ') || '-',
          coordinates: latitude && longitude ? `${latitude}, ${longitude}` : '',
          source: item.complaint_source === 'sapawarga' ? 'Sapawarga' : (item.complaint_source || ''),
          category: item.complaint_category?.name || '',
          subcategory: item.complaint_subcategory?.name || '',
          photos,
        }

        this.timeline = [
          {
            status: 'Terkirim',
            icon: 'done.svg',
            time: formatTimestamp(item.created_at),
            description: 'Laporan Anda berhasil dicatat dan menunggu peninjauan petugas.',
          },
        ]
        if ((item.complaint_status?.id || '').toLowerCase() !== 'unverified') {
          this.timeline.push({
            status: statusName,
            icon: 'follow-up.svg',
            time: formatTimestamp(item.updated_at),
            description: `Status laporan saat ini: ${statusName}.`,
          })
        } else {
          this.timeline.push({
            status: statusName,
            icon: 'verfication.svg',
            time: formatTimestamp(item.updated_at || item.created_at),
            description: 'Laporan Anda sedang menunggu verifikasi oleh tim Dinas Bina Marga.',
          })
        }
      } catch (error) {
        const status = error.response?.status
        this.error = status === 404
          ? `Aduan dengan nomor tiket ${ticket} tidak ditemukan. Periksa kembali nomor tiket Anda.`
          : 'Layanan pelacakan sedang bermasalah. Silakan coba beberapa saat lagi.'
      } finally {
        this.isLoading = false
      }
    },
    statusVariant(statusId) {
      if (['finished', 'resolved', 'done', 'selesai'].some((key) => statusId.includes(key))) return 'success'
      if (['followup', 'process', 'proses', 'coordinated', 'ditindaklanjuti'].some((key) => statusId.includes(key))) return 'progress'
      if (['failed', 'rejected', 'canceled', 'ditolak', 'dibatalkan'].some((key) => statusId.includes(key))) return 'danger'
      return 'pending'
    },
    trackTicket() {
      const ticket = this.ticket.trim().toUpperCase()
      if (ticket.length < 5) {
        this.error = 'Masukkan nomor tiket yang valid.'
        return
      }
      this.ticket = ticket
      this.fetchComplaint(ticket)
    },
    hideBrokenPhoto(event) {
      event.target.closest('.ja-complaint-photo').style.display = 'none'
    },
    openPhotoPreview(photo) {
      this.selectedPhoto = photo
      this.$nextTick(() => this.$refs.photoDialog.showModal())
    },
    closePhotoPreview() {
      this.$refs.photoDialog.close()
    },
  },
}
</script>

<style scoped>
.ja-tracking-page { --ja-ink: #14233f; --ja-rule: #dce7e0; --ja-green: #0d6d43; min-height: 100vh; background: #f5f5f7; color: var(--ja-ink); font-family: Roboto, sans-serif; }
.ja-tracking-main { width: min(1000px, calc(100% - 48px)); margin: 0 auto; padding: clamp(38px, 6vw, 74px) 0 80px; }
.ja-tracking-intro { max-width: 620px; margin-bottom: 32px; }
.ja-tracking-intro p, .ja-tracking-result-head p { margin: 0; color: var(--ja-green); font-size: 12px; font-weight: 650; letter-spacing: .01em; }
.ja-tracking-intro h1 { margin: 6px 0 5px; font-size: clamp(24px, 2.4vw, 30px); font-weight: 650; letter-spacing: -.03em; line-height: 1.1; }
.ja-tracking-intro span { color: #6b7688; font-size: 14px; line-height: 1.4; }
.ja-tracking-search, .ja-tracking-result { border: 1px solid #dfe5e8; border-radius: 16px; background: #fff; }
.ja-tracking-search { display: grid; grid-template-columns: minmax(220px, .9fr) minmax(380px, 1.4fr); gap: 38px; padding: clamp(22px, 4vw, 34px); }
.ja-tracking-search h2 { margin: 0 0 7px; font-size: 20px; letter-spacing: -.02em; }
.ja-tracking-search p { margin: 0; color: #68758a; font-size: 14px; line-height: 1.5; }
.ja-tracking-search label { display: block; margin-bottom: 9px; color: #536176; font-size: 12px; font-weight: 650; letter-spacing: .04em; text-transform: uppercase; }
.ja-tracking-search label span { color: #c94b4b; }
.ja-tracking-search form > div { display: flex; gap: 10px; }
.ja-tracking-search input { min-width: 0; flex: 1; height: 48px; box-sizing: border-box; padding: 0 14px; border: 1px solid #d9dfe3; border-radius: 10px; background: #fff; color: var(--ja-ink); font: inherit; font-size: 15px; font-weight: 600; letter-spacing: .03em; outline: 0; text-transform: uppercase; }
.ja-tracking-search input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #fff inset; -webkit-text-fill-color: var(--ja-ink); }
.ja-tracking-search input::placeholder { color: #9aa5b5; font-weight: 400; letter-spacing: 0; text-transform: none; }
.ja-tracking-search input:focus { border-color: #81938a; box-shadow: 0 0 0 3px rgba(13, 109, 67, .12); }
.ja-tracking-search input[aria-invalid='true'] { border-color: #c94b4b; }
.ja-tracking-search button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 7px; padding: 0 17px; border: 1px solid var(--ja-green); border-radius: 10px; background: var(--ja-green); color: #fff; font: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: background-color 160ms ease, transform 120ms ease-out; white-space: nowrap; }
.ja-tracking-search button:hover { background: #095b38; }
.ja-tracking-search button:disabled { border-color: #d9dfe3; background: #e5e8eb; color: #9aa5b5; cursor: not-allowed; }
.ja-tracking-search button:active { transform: scale(.97); }
.ja-tracking-search small { display: block; margin-top: 8px; color: #7c8798; font-size: 12px; }
.ja-tracking-search small.is-error { color: #a02c2c; font-weight: 600; }
.ja-tracking-result { margin-top: 18px; padding: clamp(20px, 3vw, 28px); }
.ja-tracking-loading { display: grid; place-items: center; gap: 12px; padding: 56px 24px; color: #68758a; font-size: 14px; font-weight: 600; }
.ja-tracking-loading span { width: 30px; height: 30px; border: 3px solid #dce5ee; border-top-color: var(--ja-green); border-radius: 50%; animation: ja-tracking-spin 700ms linear infinite; }
@keyframes ja-tracking-spin { to { transform: rotate(360deg); } }
.ja-complaint-summary { margin-bottom: 26px; padding-bottom: 26px; border-bottom: 1px solid var(--ja-rule); }
.ja-complaint-summary > header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.ja-complaint-summary > header p { margin: 0 0 7px; color: #8c9bb3; font-size: 13px; font-weight: 700; letter-spacing: .06em; }
.ja-complaint-summary > header h2 { margin: 0; font-size: clamp(20px, 2.2vw, 24px); font-weight: 650; letter-spacing: -.025em; line-height: 1.2; }
.ja-complaint-summary > header > span { flex: 0 0 auto; padding: 7px 13px; border: 1px solid; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.ja-complaint-summary > header > span.is-pending { border-color: #f0dfb1; background: #fdf6e3; color: #8a6b12; }
.ja-complaint-summary > header > span.is-progress { border-color: #bcd3f5; background: #eff5fe; color: #2962ba; }
.ja-complaint-summary > header > span.is-success { border-color: #b7e2cc; background: #eef7f1; color: var(--ja-green); }
.ja-complaint-summary > header > span.is-danger { border-color: #f3c1c1; background: #fdeeee; color: #a02c2c; }
.ja-complaint-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 16px; }
.ja-complaint-tags span { padding: 6px 12px; border: 1px solid #c9ded2; border-radius: 999px; background: #eef4f0; color: var(--ja-green); font-size: 12px; font-weight: 700; letter-spacing: .03em; }
.ja-complaint-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 18px; }
.ja-complaint-summary dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin: 22px 0; padding: 18px 0; border-top: 1px solid #edf0f2; border-bottom: 1px solid #edf0f2; }
.ja-complaint-summary dl div { display: flex; align-items: center; gap: 10px; }
.ja-complaint-summary dt { display: inline-flex; align-items: center; gap: 7px; color: #536176; font-size: 14px; font-weight: 700; }
.ja-complaint-summary dd { margin: 0; color: var(--ja-ink); font-size: 14px; font-weight: 600; }
.ja-complaint-summary dt :deep(img) { object-fit: contain; }
.ja-complaint-summary section { padding: 17px 18px; border: 1px solid #dce5ee; border-radius: 12px; background: #f8fafc; }
.ja-complaint-summary section h3 { margin: 0 0 8px; color: #8c9bb3; font-size: 12px; font-weight: 650; letter-spacing: .04em; }
.ja-complaint-summary section p { margin: 0; color: #4a5870; font-size: 15px; font-weight: 500; line-height: 1.5; }
.ja-complaint-photo { position: relative; overflow: hidden; margin: 0; padding: 0; border: 1px solid #dce5ee; border-radius: 12px; background: none; cursor: zoom-in; }
.ja-complaint-photo img { display: block; width: 100%; height: 180px; object-fit: cover; transition: transform 200ms ease; }
.ja-complaint-photo-zoom { position: absolute; right: 10px; bottom: 10px; display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: rgba(20, 35, 63, .72); color: #fff; opacity: 0; transition: opacity 160ms ease; }
@media (hover: hover) and (pointer: fine) {
  .ja-complaint-photo:hover img { transform: scale(1.04); }
  .ja-complaint-photo:hover .ja-complaint-photo-zoom { opacity: 1; }
}
.ja-complaint-photo:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-photo-dialog { position: relative; max-width: min(920px, calc(100vw - 48px)); max-height: calc(100vh - 64px); margin: auto; padding: 0; border: 0; border-radius: 14px; background: #0c1526; overflow: hidden; }
.ja-photo-dialog::backdrop { background: rgba(20, 35, 63, .55); -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); }
.ja-photo-dialog img { display: block; max-width: 100%; max-height: calc(100vh - 64px); object-fit: contain; }
.ja-photo-dialog-close { position: absolute; top: 12px; right: 12px; display: grid; width: 40px; height: 40px; place-items: center; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .94); color: var(--ja-ink); cursor: pointer; box-shadow: 0 1px 5px rgba(20, 35, 63, .16); }
.ja-photo-dialog-close:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-complaint-photo-placeholder { display: grid; min-height: 144px; place-items: center; gap: 8px; margin: 18px 0 0; border: 1px dashed #c7d3dc; border-radius: 12px; background: linear-gradient(135deg, #edf6f1, #f6f8fa); color: #68758a; text-align: center; }
.ja-complaint-photo-placeholder figcaption { font-size: 13px; font-weight: 600; }
.ja-tracking-result-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding-bottom: 18px; border-bottom: 1px solid var(--ja-rule); }
.ja-tracking-result-head h2 { margin: 7px 0 0; font-size: 22px; font-weight: 650; letter-spacing: -.025em; }
.ja-tracking-result-head > span { color: #7c8798; font-size: 12px; font-weight: 600; }
.ja-timeline { margin: 20px 0 0; padding: 0; list-style: none; }
.ja-timeline li { position: relative; display: grid; grid-template-columns: 36px 1fr; gap: 14px; min-height: 0; }
.ja-timeline li:not(:last-child)::before { position: absolute; top: 30px; bottom: 0; left: 17px; width: 1px; background: #dce5ee; content: ''; }
.ja-timeline-marker { position: relative; z-index: 1; display: grid; width: 34px; height: 34px; place-items: center; border: 5px solid #f2f7f4; border-radius: 50%; box-sizing: border-box; background: #fff; color: #29b97b; }
.ja-timeline li.is-current .ja-timeline-marker { border-color: #eff4fc; color: #2962ba; }
.ja-timeline article { padding-bottom: 20px; }
.ja-timeline article header { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; }
.ja-timeline h3 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -.02em; }
.ja-timeline li.is-current h3, .ja-timeline li.is-current time { color: #2962ba; }
.ja-timeline time { color: #8c9bb3; font-size: 12px; font-weight: 700; letter-spacing: .04em; white-space: nowrap; }
.ja-timeline article > p { margin: 6px 0 0; color: #62718a; font-size: 15px; line-height: 1.45; }
.ja-timeline aside { display: flex; gap: 10px; margin-top: 12px; padding: 14px 16px; border: 1px solid #dce5ee; border-radius: 10px; background: #f8fafc; color: #2962ba; }
.ja-timeline aside strong { display: block; color: #334155; font-size: 14px; }
.ja-timeline aside p { margin: 4px 0 0; color: #52627b; font-size: 14px; line-height: 1.45; }
.ja-tracking-search input:focus-visible, .ja-tracking-search button:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
@media (max-width: 640px) { .ja-tracking-main { padding-bottom: calc(80px + env(safe-area-inset-bottom)); } }
@media (max-width: 700px) { .ja-tracking-main { width: min(100% - 32px, 560px); padding-top: 22px; } .ja-tracking-intro { margin-bottom: 18px; } .ja-tracking-intro p { font-weight: 650; letter-spacing: .02em; } .ja-tracking-intro h1 { font-size: 24px; letter-spacing: -.03em; } .ja-tracking-intro span { font-size: 13px; } .ja-tracking-search { grid-template-columns: 1fr; gap: 22px; } .ja-tracking-search form > div { display: grid; grid-template-columns: 1fr; } .ja-complaint-summary > header { display: block; } .ja-complaint-summary > header > span { display: inline-block; margin-top: 12px; } .ja-complaint-summary dl { grid-template-columns: 1fr; gap: 12px; } .ja-tracking-result-head { display: block; } .ja-tracking-result-head > span { display: block; margin-top: 9px; } .ja-timeline li { grid-template-columns: 34px 1fr; gap: 10px; } .ja-timeline-marker { width: 32px; height: 32px; border-width: 4px; } .ja-timeline li:not(:last-child)::before { top: 28px; left: 16px; } .ja-timeline article header { display: block; } .ja-timeline time { display: block; margin-top: 4px; } }
@media (prefers-reduced-motion: reduce) { .ja-tracking-search button { transition: none; } .ja-tracking-search button:active { transform: none; } .ja-tracking-loading span { animation: none; } }
</style>
