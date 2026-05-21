import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'BrawlBox — Create Your Brawl Stars Character',
      meta: [
        { name: 'description', content: 'BrawlBox — Create your own custom Brawl Stars Brawler card with AI and download it!' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bangers&family=Outfit:wght@400;600;800;900&display=swap', crossorigin: 'anonymous' }
      ]
    }
  }
})
