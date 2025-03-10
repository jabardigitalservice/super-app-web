let newRelic = {}
if (process.env.NODE_ENV === 'production') {
  newRelic = {
    src: '/newrelic-script.js',
    'data-account-id': `${process.env.NEW_RELIC_ACCOUNT_ID}`,
    'data-browser-license-key': `${process.env.NEW_RELIC_BROWSER_LICENSE_KEY}`,
    'data-application-id': `${process.env.NEW_RELIC_APPLICATION_ID}`,
  }
}

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Sapawarga',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'supported-color-schemes', content: 'light dark' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    script: [newRelic],
    __dangerouslyDisableSanitizers: ['script'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/styles.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-gtag.js',
    '~/plugins/newrelic-plugins.server.js',
    '~/plugins/aduan-api.js',
    { src: '~/plugins/dark-mode.js', mode: 'client' },
    { src: '~/plugins/vee-validate.js', mode: 'client' },
    '~/plugins/jds-design-system.js',
    '~/plugins/vue-gmaps.js',
    '~/plugins/aduan-get-token.js',
  ],

  render: {
    static: {
      setHeaders: (resp, path) => {
        if (
          resp.req.originalUrl === '/.well-known/apple-app-site-association'
        ) {
          resp.setHeader('Content-Type', 'application/json')
        }
      },
    },
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // google fonts
    '@nuxtjs/google-fonts',
    '@nuxtjs/svg',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // google fonts
  googleFonts: {
    display: 'swap',
    families: {
      Roboto: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      Lato: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
    },
    overwriting: true,
  },
  // Private runtime config
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL + '/' + process.env.VERSION_ENDPOINT,
    },
  },

  // Public runtime config
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BASE_URL + '/' + process.env.VERSION_ENDPOINT,
    },
    sentry: {
      config: {
        environment: process.env.SENTRY_ENVIRONMENT,
      },
    },
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    baseURLAduan: {
      url: process.env.BASE_URL_ADUAN,
      username: process.env.USERNAME_URL_ADUAN,
      password: process.env.PASSWORD_URL_ADUAN,
    },
    gmapsKey: process.env.GOOGLE_MAPS_API,
    apiAduanIdeal: {
      keycloakUrl: process.env.KEYCLOAK_URL,
      keycloakClientId: process.env.KEYCLOAK_CLIENT_ID_PARTNER,
      keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET_PARTNER,
    },
    urlFile: process.env.URL_FILE,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3000', // fallback
    headers: {
      common: {
        'Api-Key': process.env.API_KEY,
        'x-partner-id': process.env.X_PARTNER_ID,
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['@jabardigitalservice/jds-design-system'],
  },
}
