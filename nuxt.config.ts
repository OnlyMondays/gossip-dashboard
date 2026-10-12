// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    public: { streamUrl: 'http://localhost:3000/stream' },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
