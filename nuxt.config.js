require('dotenv').config()

export default {
  // Target: https://go.nuxtjs.dev/config-target
  ssr: true,
  mode: 'universal',
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',
  // target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'sb-custom-app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    /* '@/assets/scss/custom.scss' */
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/components',
    '~/plugins/composition-api.js',
    '~/plugins/bootstrap.js',
    '~/plugins/storyblok-rich-text-renderer.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['storyblok-nuxt', {
      accessToken: 'QzOE47DZXNfrSwYzeFNCqwtt',
      cacheProvider: 'memory'
    }],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    [
      '@storyblok/nuxt-auth',
      {
        id: process.env.CONFIDENTIAL_CLIENT_ID,
        secret: process.env.CONFIDENTIAL_CLIENT_SECRET,
        redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI
      }
    ],
    'bootstrap-vue/nuxt'
  ],

   // specify module rules for css and scss
   module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  // use these settings to use custom css
  bootstrapVue: {
    bootstrapCSS: false,
    icons: true,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /* transpile: [''],
    extend(config, context) {
      config.module.rules.push({
        test: /\.(sass|scss)$/,
        use: {
          loader: "sass-loader",
          options: {
            additionalData: `
        @import "~storyblok-design-system/src/assets/styles/variables.scss";
        @import "~storyblok-design-system/src/assets/styles/global.scss";
        @import "~storyblok-design-system/src/assets/styles/resets.scss";
        @import "~storyblok-design-system/src/assets/styles/mixins.scss";`
          }
        }
      })
    } */
  }
}
