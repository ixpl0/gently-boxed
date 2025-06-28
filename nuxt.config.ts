// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['~/assets/css/global.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
  ],

  alias: {
    // FSD layers (ordered by architecture level: bottom to top)
    '#shared': '~/shared',       // Layer 1: Shared kernel (reusable across app)
    '#entities': '~/entities',   // Layer 2: Business entities
    '#features': '~/features',   // Layer 3: User features/use cases
    '#widgets': '~/widgets',     // Layer 4: Page blocks/complex components
    '#pages': '~/pages',         // Layer 5: Application pages
    '#processes': '~/processes', // Layer 6: Cross-page business processes (optional)
    '#app': '~/app',            // Layer 7: App-wide providers, layouts, etc
  },
});
