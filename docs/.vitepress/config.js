import { defineConfig } from 'vitepress'
import { RssPlugin } from 'vitepress-plugin-rss'
import imagemin from 'vite-plugin-imagemin'

// RSS Feed Configuration
const RSS_CONFIG = {
  title: 'Qiankun Blog',
  baseUrl: 'https://qiankun.co.uk',
  copyright: `Copyright © ${new Date().getFullYear()} Qiankun`,
  description: 'Thoughts on technology, development, and more',
  language: 'en-GB',
  author: {
    name: 'Qiankun',
    link: 'https://qiankun.co.uk'
  },
  filename: 'feed.rss',
  filter: (post) => post.filepath.startsWith('blog/') && post.filepath !== 'blog/index.md'
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Qiankun",
  description: "Personal website and blog - thoughts on technology, development, and more",

  // Vite plugins
  vite: {
    plugins: [
      RssPlugin(RSS_CONFIG),
      imagemin({
        gifsicle: { optimizationLevel: 3 },
        optipng: { optimizationLevel: 5 },
        mozjpeg: { quality: 80 },
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeEmptyAttrs', active: false }
          ]
        },
        webp: { quality: 80 }
      })
    ]
  },

  // SEO and Meta
  lang: 'en-GB',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'Qiankun Blog RSS', href: '/feed.rss' }],
    ['meta', { name: 'author', content: 'Qiankun' }],
    ['meta', { name: 'keywords', content: 'qiankun, blog, technology, development, software' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_GB' }],
    ['meta', { property: 'og:site_name', content: 'Qiankun' }],
    ['meta', { property: 'og:url', content: 'https://qiankun.co.uk/' }],
    ['meta', { property: 'og:image', content: 'https://qiankun.co.uk/og-image.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://qiankun.co.uk/og-image.svg' }],
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-4PF046MSJJ' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-4PF046MSJJ');`],
  ],

  // Clean URLs (no .html extension)
  cleanUrls: true,

  // Sitemap generation
  sitemap: {
    hostname: 'https://qiankun.co.uk'
  },

  // Theme configuration
  themeConfig: {
    // Logo
    logo: '/logo.svg',
    siteTitle: 'Qiankun',

    // Navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'AI Workflow', link: '/ai-workflow/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Contact', link: '/contact' }
    ],

    // Sidebar configuration
    sidebar: {
      '/ai-workflow/': [
        {
          text: 'AI Workflow',
          items: [
            { text: 'Overview', link: '/ai-workflow/' },
            { text: 'Core Concepts', link: '/ai-workflow/concepts' },
            { text: 'Patterns', link: '/ai-workflow/patterns' },
            { text: 'Agents', link: '/ai-workflow/agents' },
            { text: 'Tooling', link: '/ai-workflow/tools' }
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog Posts',
          items: [
            { text: 'ETRM Systems', link: '/blog/etrm-systems' },
            { text: 'Welcome Post', link: '/blog/welcome' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KennyZhu' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/KennyZhu' },
      // { icon: 'twitter', link: 'https://twitter.com/KennyZhu' }
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

    // Edit link - update with your GitHub username
    editLink: {
      pattern: 'https://github.com/KennyZhu/qiankun-website/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // Last updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium'
      }
    }
  }
})
