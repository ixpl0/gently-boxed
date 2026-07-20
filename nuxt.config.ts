// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Andrei Kashcheev',
      meta: [
        // The page is a fixed 500px-wide widget: narrow screens scale the whole
        // layout to fit, so 100vh/100dvh keep covering the entire visible screen
        {
          name: 'viewport',
          content: 'width=500',
        },
        {
          name: 'description',
          content: 'Frontend developer, team leader and AI harness architect. An interactive 3D business card.',
        },
      ],
    },
  },

  css: ['~/assets/css/global.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
  ],
});
