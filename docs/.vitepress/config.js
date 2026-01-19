import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Qiankun",
  description: "Personal website and blog - thoughts on technology, development, and more",

  // SEO and Meta
  lang: 'en-GB',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Qiankun' }],
    ['meta', { name: 'keywords', content: 'qiankun, blog, technology, development, software' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_GB' }],
    ['meta', { property: 'og:site_name', content: 'Qiankun' }],
    ['meta', { property: 'og:url', content: 'https://qiankun.co.uk/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Google Analytics placeholder - uncomment and add your GA4 ID
    // ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
    // ['script', {}, `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-XXXXXXXXXX');`],
  ],

  // Clean URLs (no .html extension)
  cleanUrls: true,

  // Sitemap generation
  sitemap: {
    hostname: 'https://qiankun.co.uk'
  },

  // Theme configuration
  themeConfig: {
    // Logo (add your logo to docs/public/logo.svg)
    // logo: '/logo.svg',

    // Navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Contact', link: '/contact' }
    ],

    // Sidebar configuration
    sidebar: {
      '/blog/': [
        {
          text: 'Blog Posts',
          items: [
            { text: 'Welcome Post', link: '/blog/welcome' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/yourusername' },
      // { icon: 'twitter', link: 'https://twitter.com/yourusername' }
    ],

    // Footer
    footer: {
      message: 'Built with VitePress',
      copyright: `Copyright © ${new Date().getFullYear()} Qiankun`
    },

    // Search
    search: {
      provider: 'local'
    },

    // Edit link (if using GitHub)
    // editLink: {
    //   pattern: 'https://github.com/yourusername/qiankun-website/edit/main/docs/:path',
    //   text: 'Edit this page on GitHub'
    // },

    // Last updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium'
      }
    }
  }
})
