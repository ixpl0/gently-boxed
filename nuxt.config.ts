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
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        // The poster type pair (Archivo Black + Oswald) for the front side, the
        // print pair (Bungee + Space Grotesk) for the back side and the retrowave
        // pair (Audiowide + Mr Dafoe) for the left side (see --font-* in global.css)
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Audiowide&family=Bungee&family=Mr+Dafoe&family=Oswald:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap',
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
