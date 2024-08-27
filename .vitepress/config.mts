import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VolgaSprint",
  description: "Notes while VolgaSprinting",
  base: '/volgasprint/',
  head: [
    ['link', { rel: 'shortcut icon', href: 'volgasprint_ru.svg', type: 'image/svg' }]
  ],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      message: 'From Russia with ❤️',
      copyright: 'Copyleft © 2024-present mrflos - AGPL3 licence'
    },
    logo: '/volgasprint_ru.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Collective notes', link: 'https://pad.lassul.us/veFzwAxHRk2nWQxG6pjQiA' },
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'Nix OS Projects',
        items: [
          { text: 'The Nix cache server', link: '/nix-cache-server' },
          { text: 'Packaging YesWiki', link: '/yeswiki' },
        ]
      },
      {
        text: 'Other projects / misc',
        items: [
          { text: 'ERIS Cookbook', link: '/eris' },
          { text: 'Basics in electronics', link: '/electronics' },
          { text: 'Tips and tricks', link: '/tips-n-tricks' },
          { text: 'Links', link: '/links' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mrflos/volgasprint' },
      { icon: 'mastodon', link: 'https://mastodon.cc/@mrflos' }
    ]
  }
})
