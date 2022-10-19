export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Sapawarga',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'supported-color-schemes', content: 'light dark' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/styles.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

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
    '@nuxtjs/svg'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://sentry.nuxtjs.org/
    '@nuxtjs/sentry'
  ],

  // sentry config
  sentry: {
    dsn: process.env.SENTRY_DSN, // Enter your project's DSN here
    tracing: {
      tracesSampleRate: parseFloat(process.env.SENTRY_SAMPLE_RATE),
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: ['mount', 'update'],
          timeout: 2000,
          trackComponents: true
        }
      },
      browserOptions: {}
    },
    disabled: process.env.SENTRY_ENABLED === 'false'
  },

  // google fonts
  googleFonts: {
    display: 'swap',
    families: {
      Roboto: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      },
      Lato: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      }
    },
    overwriting: true
  },

  // Private runtime config
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL + '/' + process.env.VERSION_ENDPOINT
    }
  },

  // Public runtime config
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BASE_URL + '/' + process.env.VERSION_ENDPOINT
    },
    sentry: {
      config: {
        environment: process.env.SENTRY_ENVIRONMENT
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3000', // fallback
    headers: {
      common: {
        'Api-Key': process.env.API_KEY,
        'Cache-Control': 'no-cache'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: process.env.PUBLIC_PATH
  }
}
