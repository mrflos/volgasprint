import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VolgaSprint",
  description: "Notes while VolgaSprinting",
  base: '/volgasprint/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Nix projects', link: '/nix-projects' },
      { text: 'Basics in electronics', link: '/electronics' }
    ],

    sidebar: [
      {
        text: 'Menu',
        items: [
          { text: 'Nix projects', link: '/nix-projects' },
          { text: 'Basics in electronics', link: '/electronics' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
