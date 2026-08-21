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
      <NuxtLink to="/jalan-aing" :class="{ 'is-active': navActive === 'beranda' }" :aria-current="navActive === 'beranda' ? 'page' : undefined">Beranda</NuxtLink>
      <NuxtLink to="/jalan-aing/peta" :class="{ 'is-active': navActive === 'peta' }" :aria-current="navActive === 'peta' ? 'page' : undefined">Peta Interaktif</NuxtLink>
      <NuxtLink to="/jalan-aing/aduan" :class="{ 'is-active': navActive === 'aduan' }" :aria-current="navActive === 'aduan' ? 'page' : undefined">Buat Aduan</NuxtLink>
      <NuxtLink to="/jalan-aing/lacak" :class="{ 'is-active': navActive === 'lacak' }" :aria-current="navActive === 'lacak' ? 'page' : undefined">Lacak Status</NuxtLink>
    </nav>
    <NuxtLink class="ja-help" to="/jalan-aing/aduan">Perlu bantuan?</NuxtLink>
    <nav class="ja-bottom-nav" aria-label="Navigasi utama">
      <NuxtLink to="/jalan-aing" :class="{ 'is-active': navActive === 'beranda' }" :aria-current="navActive === 'beranda' ? 'page' : undefined"><span aria-hidden="true"><Icon name="home-outline" size="18px" /></span><span>Beranda</span></NuxtLink>
      <NuxtLink to="/jalan-aing/peta" :class="{ 'is-active': navActive === 'peta' }" :aria-current="navActive === 'peta' ? 'page' : undefined"><span aria-hidden="true" class="ja-pin-icon"><svg width="18" height="18" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.4854 4.18137C22.6885 6.38421 23.9485 9.35752 23.999 12.4726C24.0496 15.5877 22.8866 18.6003 20.7561 20.8734L20.4854 21.1534L14.8281 26.8094C14.1102 27.5267 13.1466 27.9444 12.1323 27.9779C11.118 28.0113 10.1289 27.6579 9.36541 26.9894L9.17341 26.8094L3.51474 21.152C1.26429 18.9016 0 15.8493 0 12.6667C0 9.48408 1.26429 6.43182 3.51474 4.18137C5.76519 1.93092 8.81746 0.666626 12.0001 0.666626C15.1827 0.666626 18.235 1.93092 20.4854 4.18137ZM12.0001 8.6667C11.4748 8.6667 10.9546 8.77016 10.4693 8.97118C9.98404 9.1722 9.54308 9.46684 9.17165 9.83827C8.80021 10.2097 8.50557 10.6507 8.30456 11.136C8.10354 11.6213 8.00007 12.1414 8.00007 12.6667C8.00007 13.192 8.10354 13.7121 8.30456 14.1974C8.50557 14.6827 8.80021 15.1237 9.17165 15.4951C9.54308 15.8666 9.98404 16.1612 10.4693 16.3622C10.9546 16.5632 11.4748 16.6667 12.0001 16.6667C13.0609 16.6667 14.0784 16.2453 14.8285 15.4951C15.5786 14.745 16.0001 13.7276 16.0001 12.6667C16.0001 11.6058 15.5786 10.5884 14.8285 9.83827C14.0784 9.08813 13.0609 8.6667 12.0001 8.6667Z" fill="currentColor" /></svg></span><span>Peta</span></NuxtLink>
      <NuxtLink to="/jalan-aing/aduan" :class="{ 'is-active': navActive === 'aduan' }" :aria-current="navActive === 'aduan' ? 'page' : undefined"><span aria-hidden="true"><Icon name="warning" size="18px" /></span><span>Aduan</span></NuxtLink>
      <NuxtLink to="/jalan-aing/lacak" :class="{ 'is-active': navActive === 'lacak' }" :aria-current="navActive === 'lacak' ? 'page' : undefined"><span aria-hidden="true"><Icon name="magnifier" size="18px" /></span><span>Lacak</span></NuxtLink>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'JalanAingHeader',
  props: { active: { type: String, default: '' }, sticky: { type: Boolean, default: false } },
  computed: {
    navActive() {
      const path = this.$route?.path || ''
      if (path === '/jalan-aing') return 'beranda'
      if (path.startsWith('/jalan-aing/peta')) return 'peta'
      if (path.startsWith('/jalan-aing/aduan')) return 'aduan'
      if (path.startsWith('/jalan-aing/lacak')) return 'lacak'
      return this.active
    },
  },
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
.ja-nav a:hover, .ja-nav a.is-active, .ja-help:hover { color: #0d6d43; }
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
  .ja-bottom-nav a.is-active { color: #0d6d43; box-shadow: inset 0 3px #0d6d43; }
  .ja-bottom-nav a:focus-visible { position: relative; z-index: 1; outline: 3px solid #ffcf51; outline-offset: -3px; }
  .ja-bottom-nav a:active { background: #edf4ef; }
}
@media (max-width: 640px) and (hover: hover) and (pointer: fine) {
  .ja-bottom-nav a:hover { color: #0d6d43; background: #f3f8f5; }
}
</style>
