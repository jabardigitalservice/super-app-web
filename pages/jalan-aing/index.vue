<template>
  <main class="jalan-aing">
    <JalanAingHeader active="beranda" />

    <section class="ja-hero" aria-labelledby="hero-title">
      <svg class="ja-hero-map" viewBox="0 0 1040 440" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-42 78C55 75 79 124 142 134c66 11 83 75 101 139" />
        <path d="M-30 326c86-28 144-8 171 47 18 37 34 53 94 74" />
        <path d="M1086 77c-95-4-121 39-180 70-59 30-76 78-90 125" />
        <path d="M1070 344c-81-22-132 5-157 57-20 41-52 54-105 67" />
        <path class="ja-hero-route-detail" d="M0 94h68m-47 22h82m-54 22h69M1040 96h-68m47 22h-82m54 22h-69" />
        <circle cx="142" cy="134" r="7" />
        <circle cx="906" cy="147" r="7" />
        <circle cx="141" cy="373" r="7" />
        <circle cx="913" cy="401" r="7" />
      </svg>
      <p class="ja-kicker">Layanan aduan jalan Jawa Barat</p>
      <h1 id="hero-title">Temukan titiknya.<br>Laporkan kerusakannya.<br><span>Jalan Aing.</span></h1>
      <p class="ja-intro">Gunakan peta untuk menandai lokasi jalan rusak, lengkapi kondisi di lapangan, lalu kirim aduan dengan informasi yang jelas.</p>
      <svg class="ja-hero-road" viewBox="0 0 520 42" fill="none" aria-hidden="true">
        <path d="M10 27c53-24 92-20 132-2 47 21 79 13 117-6 40-20 76-16 113 3 38 20 77 17 138-9" />
        <path class="ja-road-dash" d="M31 25c45-15 77-10 111 4 42 18 72 12 108-6 39-19 74-16 111 2 38 18 76 15 127-7" />
        <circle cx="142" cy="25" r="6" />
        <circle cx="372" cy="25" r="6" />
        <path class="ja-road-pin" d="M260 8c-5 0-9 4-9 9 0 6 6 11 9 14 3-3 9-8 9-14 0-5-4-9-9-9Z" />
      </svg>
    </section>

    <section id="layanan" class="ja-service-panel" aria-labelledby="service-title">
      <div class="ja-service-head">
        <div>
          <p class="ja-kicker">Mulai dari sini</p>
          <h2 id="service-title">Apa yang ingin Anda lakukan?</h2>
        </div>
        <a href="/jalan-aing/peta">Buka peta jalan <span aria-hidden="true">→</span></a>
      </div>

      <div class="ja-service-grid">
        <a href="/jalan-aing/peta" class="ja-service-card ja-service-map">
          <span class="ja-service-icon"><Icon src="/icon/pin-map.svg" size="26px" /></span>
          <span class="ja-label">Peta Jalan</span>
          <strong>Tandai lokasi kejadian</strong>
          <small>Pilih titik jalan rusak agar lokasi ikut masuk ke aduan.</small>
        </a>
        <a href="/jalan-aing/aduan" class="ja-service-card">
          <span class="ja-service-icon"><Icon name="warning" size="24px" /></span>
          <span class="ja-label">Aduan</span>
          <strong>Laporkan jalan rusak</strong>
          <small>Isi jenis kerusakan, keterangan, dan foto pendukung.</small>
        </a>
        <a href="/jalan-aing/peta" class="ja-service-card">
          <span class="ja-service-icon"><Icon name="eye" size="24px" /></span>
          <span class="ja-label">Informasi Peta</span>
          <strong>Lihat ruas dan fasilitas</strong>
          <small>Aktifkan layer jalan, halte, layanan kesehatan, dan rest area.</small>
        </a>
        <a href="/jalan-aing/lacak" class="ja-service-card">
          <span class="ja-service-icon"><Icon name="magnifier" size="24px" /></span>
          <span class="ja-label">Pelacakan</span>
          <strong>Periksa status aduan</strong>
          <small>Gunakan nomor tiket untuk membuka halaman pelacakan aduan.</small>
        </a>
        <aside class="ja-latest">
          <p>Siap membuat aduan?</p>
          <h3>Mulai dari titik kerusakan yang paling dekat.</h3>
          <span>Lokasi, foto, dan keterangan singkat membuat aduan lebih mudah ditindaklanjuti.</span>
          <a href="/jalan-aing/peta">Tandai lokasi di peta <span aria-hidden="true">→</span></a>
        </aside>
      </div>
    </section>

    <JalanAingFooter />
  </main>
</template>

<script>
export default {
  name: 'JalanAingPage',
  head() {
    return { title: 'Jalan Aing — Layanan Aduan Jalan Jawa Barat' }
  },
}
</script>

<style scoped>
/* Hallmark · macrostructure: Ecosystem Index · tone: utilitarian · anchor hue: Jalan Aing green · pre-emit critique: P4 H5 E4 S5 R5 V5 */
.jalan-aing {
  --ja-ink: #14233f;
  --ja-muted: #58677d;
  --ja-paper: #fffefb;
  --ja-soft: #f4f7f5;
  --ja-rule: #dce7e0;
  --ja-green: #138b58;
  --ja-green-dark: #0d6d43;
  --ja-green-soft: #def4e7;
  --ja-blue: #5bb7e6;
  --ja-yellow: #ffcf51;
  min-height: 100vh;
  overflow-x: clip;
  background: var(--ja-paper);
  color: var(--ja-ink);
  font-family: Roboto, sans-serif;
  font-weight: 400;
}

.ja-hero,
.ja-service-panel,
.ja-service-grid,
.ja-service-card,
.ja-service-head { min-width: 0; }

.ja-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 28px;
  border-bottom: 1px solid var(--ja-rule);
  background: var(--ja-paper);
}

.ja-brand,
.ja-nav,
.ja-help,
.ja-service-head,
.ja-service-grid { display: flex; align-items: center; }

.ja-brand { gap: 10px; color: var(--ja-ink); font-size: 12px; font-weight: 700; letter-spacing: .11em; line-height: 1.08; text-decoration: none; text-transform: uppercase; }
.ja-brand-mark { display: block; width: 44px; height: 44px; flex: 0 0 auto; }
.ja-nav { gap: 30px; }
.ja-nav a,
.ja-help { color: #505867; font-size: 15px; font-weight: 700; text-decoration: none; }
.ja-nav a:hover, .ja-help:hover, .ja-service-head > a:hover { color: var(--ja-green-dark); }
.ja-help { white-space: nowrap; }

.ja-hero { position: relative; max-width: 1040px; margin: 0 auto; padding: 98px 28px 58px; text-align: center; overflow: hidden; }
.ja-hero > :not(.ja-hero-map) { position: relative; z-index: 1; }
.ja-hero-map { position: absolute; inset: 18px 0 0; width: 100%; height: calc(100% - 18px); color: var(--ja-rule); opacity: .82; pointer-events: none; }
.ja-hero-map path { stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.ja-hero-map .ja-hero-route-detail { stroke-width: 1; opacity: .65; }
.ja-hero-map circle { fill: var(--ja-paper); stroke: var(--ja-green); stroke-width: 2; }
.ja-hero-road { display: block; width: min(520px, 100%); height: 42px; margin: 18px auto 0; color: #abd8c1; }
.ja-hero-road path { stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.ja-hero-road .ja-road-dash { stroke: var(--ja-green); stroke-dasharray: 5 8; }
.ja-hero-road circle { fill: var(--ja-paper); stroke: var(--ja-green); stroke-width: 2; }
.ja-hero-road .ja-road-pin { fill: var(--ja-yellow); stroke: none; }
.ja-kicker { margin: 0; color: var(--ja-green-dark); font-size: 13px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.ja-hero h1 { max-width: 850px; margin: 18px auto 22px; font-size: clamp(43px, 6vw, 76px); font-weight: 900; letter-spacing: -.055em; line-height: 1.04; }
.ja-hero h1 span { display: inline-block; padding: .02em .2em .09em; border-radius: 16px; background: var(--ja-green); color: var(--ja-paper); letter-spacing: -.045em; }
.ja-intro { max-width: 760px; margin: 0 auto; color: #465467; font-size: 20px; font-weight: 400; line-height: 1.5; }

.ja-service-panel { max-width: 1080px; margin: 0 auto; padding: 28px; border: 1px solid var(--ja-rule); border-radius: 24px 24px 0 0; background: var(--ja-soft); }
.ja-service-head { justify-content: space-between; gap: 24px; margin: 0 0 22px; }
.ja-service-head h2 { margin: 6px 0 0; font-size: 28px; font-weight: 700; letter-spacing: -.03em; }
.ja-service-head > a { color: var(--ja-green-dark); font-weight: 700; text-decoration: none; white-space: nowrap; }
.ja-service-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: stretch; gap: 16px; }
.ja-service-card { display: flex; min-height: 226px; flex-direction: column; padding: 20px; border: 1px solid var(--ja-rule); border-radius: 18px; background: var(--ja-paper); color: var(--ja-ink); text-decoration: none; transition: border-color 180ms ease, transform 180ms ease; }
.ja-service-card:hover { border-color: var(--ja-green); transform: translateY(-2px); }
.ja-service-icon { display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 13px; background: var(--ja-green-soft); color: var(--ja-green-dark); }
.ja-label { display: inline-block; width: fit-content; margin-top: 18px; padding: 4px 8px; border-radius: 999px; background: var(--ja-green); color: var(--ja-paper); font-size: 11px; font-weight: 700; }
.ja-service-card strong { margin-top: 12px; font-size: 18px; font-weight: 700; line-height: 1.18; }
.ja-service-card small { margin-top: 8px; color: var(--ja-muted); font-size: 14px; font-weight: 400; line-height: 1.45; }
.ja-latest { grid-column: 1 / -1; display: grid; grid-template-columns: 150px minmax(260px, 1.3fr) 1fr auto; align-items: center; gap: 22px; padding: 20px 22px; border-radius: 18px; background: #317c58; box-sizing: border-box; color: var(--ja-paper); }
.ja-latest p { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.ja-latest h3 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; }
.ja-latest span { font-size: 14px; font-weight: 400; line-height: 1.45; }
.ja-latest a { color: var(--ja-paper); font-size: 14px; font-weight: 700; text-decoration: none; white-space: nowrap; }


@media (max-width: 820px) {
  .ja-header { min-height: 64px; padding: 0 20px; }
  .ja-nav { display: none; }
  .ja-help { font-size: 13px; }
  .ja-hero { padding-top: 72px; }
  .ja-service-grid { padding-right: 0; }
  .ja-latest { position: static; min-height: 192px; }
}

@media (max-width: 820px) {
  .ja-header, .ja-hero, .ja-service-panel { padding-left: 20px; padding-right: 20px; }
  .ja-brand { font-size: 10px; }
  .ja-brand-mark { transform: scale(.82); transform-origin: left center; width: 36px; }
  .ja-help { font-size: 12px; }
  .ja-hero { padding-top: 58px; padding-bottom: 42px; text-align: left; }
  .ja-hero h1 { max-width: 350px; margin-left: 0; font-size: 35px; overflow-wrap: anywhere; }
  .ja-intro { max-width: 300px; margin-left: 0; margin-right: 0; font-size: 16px; overflow-wrap: anywhere; }
  .ja-hero-road { width: 100%; height: 32px; margin-top: 14px; }
  .ja-hero-map { display: none; }
  .ja-service-panel { border-radius: 18px 18px 0 0; }
  .ja-service-head { align-items: flex-start; flex-direction: column; }
  .ja-service-head > a { white-space: normal; }
  .ja-service-grid { display: grid; grid-template-columns: minmax(0, 1fr); padding-right: 0; }
  .ja-service-card { width: 100%; min-height: 168px; box-sizing: border-box; }
  .ja-label { margin-top: 16px; }
  .ja-latest { grid-column: auto; grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .ja-latest > * { min-width: 0; overflow-wrap: anywhere; }
}

@media (prefers-reduced-motion: reduce) {
  .ja-service-card { transition-duration: 150ms; }
}
</style>
