<template>
  <footer class="ja-footer">
    <div class="ja-footer-main">
      <a class="ja-brand" href="/jalan-aing" aria-label="Jalan Aing, beranda">
        <svg class="ja-brand-mark" viewBox="0 0 58 64" fill="none" aria-hidden="true">
          <path d="M29 3C14.7 3 6 13.7 6 26.8c0 14.2 14.5 27 23 34.2 8.5-7.2 23-20 23-34.2C52 13.7 43.3 3 29 3Z" fill="#239CD5" />
          <path d="M29 3c14.3 0 23 10.7 23 23.8 0 14.2-14.5 27-23 34.2V3Z" fill="#356AB6" />
          <path d="M10.5 30.2c3.9 7.6 11.2 14.4 18.5 20.5 7.3-6.1 14.6-12.9 18.5-20.5-7.2-4.8-11.8-8.4-14-16.8h-9C22.3 21.8 17.7 25.4 10.5 30.2Z" fill="#078451" />
          <path d="M27.4 14.4h3.2l1.2 9.3h-5.6l1.2-9.3Zm-4.1 15.7h11.4l1.7 3.7H21.6l1.7-3.7Zm-7.2 10.4 3.1-2.1 3.4 3-2.7 2.3-3.8-3.2Zm22.8 0 3.8-3.2 2.7 2.3-3.4 3-3.1-2.1Z" fill="#FFFDF6" />
          <circle cx="40.5" cy="16.5" r="4.5" fill="#FFD05A" />
          <circle cx="40.5" cy="16.5" r="1.3" fill="#356AB6" />
        </svg>
        <span>Jalan<br>Aing</span>
      </a>
      <a class="ja-footer-cta" href="/jalan-aing/peta">Buka peta interaktif <span aria-hidden="true">→</span></a>
    </div>
    <div class="ja-footer-links">
      <p>Laporkan kondisi jalan dengan lokasi dan informasi yang jelas agar dapat ditindaklanjuti.</p>
      <nav aria-label="Layanan Jalan Aing">
        <strong>Layanan</strong>
        <a href="/jalan-aing/peta">Peta interaktif</a>
        <a href="/jalan-aing/aduan">Buat aduan</a>
        <a href="/jalan-aing/lacak">Lacak status</a>
      </nav>
      <nav aria-label="Panduan Jalan Aing">
        <strong>Panduan</strong>
        <a href="/jalan-aing">Mulai dari sini</a>
        <a href="/jalan-aing/aduan">Perlu bantuan?</a>
      </nav>
    </div>
    <div class="ja-footer-bottom"><span>Copyright ©2026 UPTD PLDDIG. All Rights Reserved |</span></div>
  </footer>
</template>

<script>
export default { name: 'JalanAingFooter' }
</script>

<style scoped>
.ja-footer { --ja-footer-ink: #14233f; --ja-footer-paper: #fffefb; --ja-footer-yellow: #ffcf51; margin-top: 72px; padding: 56px 28px 24px; background: #000; color: var(--ja-footer-paper); }
.ja-footer-main, .ja-footer-links, .ja-footer-bottom { max-width: 1080px; margin: 0 auto; }
.ja-footer-main { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding-bottom: 48px; border-bottom: 1px solid rgba(255, 254, 251, .22); }
.ja-brand { display: flex; align-items: center; gap: 10px; color: var(--ja-footer-paper); font-size: 12px; font-weight: 700; letter-spacing: .11em; line-height: 1.08; text-decoration: none; text-transform: uppercase; }
.ja-brand-mark { display: block; width: 44px; height: 44px; flex: 0 0 auto; }
.ja-footer-links p { margin: 0; }
.ja-footer-cta { display: inline-flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 999px; background: var(--ja-footer-yellow); color: var(--ja-footer-ink); font-size: 14px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.ja-footer-cta:hover { background: var(--ja-footer-paper); }
.ja-footer-cta:focus-visible, .ja-footer a:focus-visible { outline: 3px solid var(--ja-footer-yellow); outline-offset: 4px; }
.ja-footer-links { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(140px, .7fr) minmax(140px, .7fr); gap: 36px; padding: 38px 0 46px; }
.ja-footer-links > p { max-width: 360px; color: #c7d7d3; font-size: 16px; line-height: 1.55; }
.ja-footer-links nav { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.ja-footer-links strong { margin-bottom: 4px; color: #9fe1bf; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.ja-footer-links a { color: var(--ja-footer-paper); font-size: 14px; line-height: 1.35; text-decoration: none; }
.ja-footer-links a:hover { color: var(--ja-footer-yellow); }
.ja-footer-bottom { display: flex; justify-content: space-between; gap: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 254, 251, .16); color: #a9bbb7; font-size: 12px; }
@media (max-width: 820px) { .ja-footer { margin-top: 48px; padding: 42px 20px 22px; } .ja-footer-main, .ja-footer-bottom { align-items: flex-start; flex-direction: column; } .ja-footer-main { gap: 28px; padding-bottom: 32px; } .ja-footer-cta { width: 100%; justify-content: space-between; box-sizing: border-box; } .ja-footer-links { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 22px; padding: 30px 0 36px; } .ja-footer-links > p { grid-column: 1 / -1; } .ja-footer-bottom { gap: 8px; } }
@media (max-width: 640px) { .ja-footer { padding-bottom: calc(86px + env(safe-area-inset-bottom)); } }
</style>
