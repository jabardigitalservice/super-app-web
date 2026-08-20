<template>
  <header class="ja-header" :class="{ 'is-sticky': sticky }">
    <NuxtLink class="ja-brand" to="/jalan-aing" aria-label="Jalan Aing, beranda">
      <svg class="ja-brand-mark" viewBox="0 0 58 64" fill="none" aria-hidden="true">
        <path d="M29 3C14.7 3 6 13.7 6 26.8c0 14.2 14.5 27 23 34.2 8.5-7.2 23-20 23-34.2C52 13.7 43.3 3 29 3Z" fill="#239CD5" />
        <path d="M29 3c14.3 0 23 10.7 23 23.8 0 14.2-14.5 27-23 34.2V3Z" fill="#356AB6" />
        <path d="M10.5 30.2c3.9 7.6 11.2 14.4 18.5 20.5 7.3-6.1 14.6-12.9 18.5-20.5-7.2-4.8-11.8-8.4-14-16.8h-9C22.3 21.8 17.7 25.4 10.5 30.2Z" fill="#078451" />
        <path d="M27.4 14.4h3.2l1.2 9.3h-5.6l1.2-9.3Zm-4.1 15.7h11.4l1.7 3.7H21.6l1.7-3.7Zm-7.2 10.4 3.1-2.1 3.4 3-2.7 2.3-3.8-3.2Zm22.8 0 3.8-3.2 2.7 2.3-3.4 3-3.1-2.1Z" fill="#FFFDF6" />
        <circle cx="40.5" cy="16.5" r="4.5" fill="#FFD05A" />
        <circle cx="40.5" cy="16.5" r="1.3" fill="#356AB6" />
      </svg>
      <span>Jalan<br>Aing</span>
    </NuxtLink>
    <nav class="ja-nav" aria-label="Navigasi Jalan Aing">
      <NuxtLink to="/jalan-aing" :aria-current="active === 'beranda' ? 'page' : undefined">Beranda</NuxtLink>
      <NuxtLink to="/jalan-aing/peta" :aria-current="active === 'peta' ? 'page' : undefined">Peta Interaktif</NuxtLink>
      <NuxtLink to="/jalan-aing/aduan" :aria-current="active === 'aduan' ? 'page' : undefined">Buat Aduan</NuxtLink>
      <NuxtLink to="/jalan-aing/lacak" :aria-current="active === 'lacak' ? 'page' : undefined">Lacak Status</NuxtLink>
    </nav>
    <NuxtLink class="ja-help" to="/jalan-aing/aduan">Perlu bantuan?</NuxtLink>
    <nav class="ja-bottom-nav" aria-label="Navigasi utama">
      <NuxtLink to="/jalan-aing" :aria-current="active === 'beranda' ? 'page' : undefined"><span aria-hidden="true"><Icon name="home-outline" size="18px" /></span><span>Beranda</span></NuxtLink>
      <NuxtLink to="/jalan-aing/peta" :aria-current="active === 'peta' ? 'page' : undefined"><span aria-hidden="true"><Icon src="/icon/pin-map.svg" size="18px" /></span><span>Peta</span></NuxtLink>
      <NuxtLink to="/jalan-aing/aduan" :aria-current="active === 'aduan' ? 'page' : undefined"><span aria-hidden="true"><Icon name="warning" size="18px" /></span><span>Aduan</span></NuxtLink>
      <NuxtLink to="/jalan-aing/lacak" :aria-current="active === 'lacak' ? 'page' : undefined"><span aria-hidden="true"><Icon name="magnifier" size="18px" /></span><span>Lacak</span></NuxtLink>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'JalanAingHeader',
  props: { active: { type: String, default: '' }, sticky: { type: Boolean, default: false } },
}
</script>

<style scoped>
.ja-header { position: relative; z-index: 900; display: flex; min-height: 76px; align-items: center; justify-content: space-between; padding: 0 clamp(20px, 4vw, 48px); border-bottom: 1px solid #dce7e0; background: #fffefb; font-family: Roboto, sans-serif; }
.ja-header.is-sticky { position: sticky; top: 0; }
.ja-brand, .ja-nav { display: flex; align-items: center; }
.ja-brand { gap: 10px; color: #14233f; font-size: 12px; font-weight: 700; letter-spacing: .11em; line-height: 1.08; text-decoration: none; text-transform: uppercase; }
.ja-brand-mark { display: block; width: 44px; height: 44px; flex: 0 0 auto; }
.ja-nav { gap: 30px; }
.ja-nav a, .ja-help { color: #505867; font-size: 15px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.ja-nav a:hover, .ja-nav a[aria-current='page'], .ja-help:hover { color: #0d6d43; }
.ja-nav a:focus-visible, .ja-help:focus-visible { outline: 3px solid #ffcf51; outline-offset: 3px; }
.ja-bottom-nav { display: none; }
@media (max-width: 820px) {
  .ja-header { min-height: 64px; padding: 0 20px; }
  .ja-brand { font-size: 10px; }
  .ja-brand-mark { width: 36px; height: 36px; }
  .ja-help { font-size: 12px; }
}
@media (min-width: 641px) and (max-width: 820px) {
  .ja-nav { gap: 16px; }
  .ja-nav a, .ja-help { font-size: 13px; }
}
@media (max-width: 640px) {
  .ja-header { position: sticky; top: 0; z-index: 900; }
  .ja-nav { display: none; }
  .ja-bottom-nav { position: fixed; z-index: 1000; right: 0; bottom: 0; left: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); min-height: 64px; padding-bottom: env(safe-area-inset-bottom); border-top: 1px solid #dce7e0; background: #fffefb; }
  .ja-bottom-nav a { display: grid; min-height: 64px; place-items: center; align-content: center; gap: 5px; padding: 6px 4px; color: #68758a; font-size: 11px; font-weight: 700; line-height: 1; text-decoration: none; white-space: nowrap; }
  .ja-bottom-nav a[aria-current='page'] { color: #0d6d43; box-shadow: inset 0 3px #0d6d43; }
  .ja-bottom-nav a:focus-visible { position: relative; z-index: 1; outline: 3px solid #ffcf51; outline-offset: -3px; }
  .ja-bottom-nav a:active { background: #edf4ef; }
}
@media (max-width: 640px) and (hover: hover) and (pointer: fine) {
  .ja-bottom-nav a:hover { color: #0d6d43; background: #f3f8f5; }
}
</style>
