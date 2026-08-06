import { defineConfig } from "vitepress";
import { RssPlugin } from "vitepress-plugin-rss";
import imagemin from "vite-plugin-imagemin";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
import { VitePWA } from "vite-plugin-pwa";
import Icons from "unplugin-icons/vite";
import { brand } from "./theme/tokens.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build-time assertion: theme/tokens.js's `brand` (the Node-side copy, used
// for the PWA manifest) must match theme/custom.css's :root --vp-c-brand-1
// (the browser-side, canonical definition). These are two manually-synced
// sources of truth by design (tokens.js exists because config.js runs in
// Node before any stylesheet is parsed) — fail the build loudly instead of
// letting them silently drift on a future rebrand.
function assertBrandInSync() {
  const cssPath = join(__dirname, "theme/custom.css");
  const css = readFileSync(cssPath, "utf-8").replace(/\/\*[\s\S]*?\*\//g, "");
  const rootBlock = css.match(/:root\s*{([^}]*)}/)?.[1] ?? "";
  const cssBrand = rootBlock.match(/--vp-c-brand-1:\s*(#[0-9a-fA-F]{3,8})/)?.[1];
  if (!cssBrand || cssBrand.toLowerCase() !== brand.toLowerCase()) {
    throw new Error(
      `Brand colour out of sync: theme/tokens.js exports brand="${brand}" but ` +
        `theme/custom.css :root --vp-c-brand-1 is "${cssBrand ?? "not found"}". ` +
        `Update one to match the other (see the comments in both files).`,
    );
  }
}
assertBrandInSync();

// RSS Feed Configuration
const RSS_CONFIG = {
  title: "Qiankun Blog",
  baseUrl: "https://qiankun.co.uk",
  copyright: `Copyright © ${new Date().getFullYear()} Qiankun`,
  description:
    "Notes on energy trading and risk management systems, by Qiankun (Kenny) Zhu.",
  language: "en-GB",
  author: {
    name: "Qiankun",
    link: "https://qiankun.co.uk",
  },
  filename: "feed.rss",
  filter: (post) => post.url?.startsWith("/blog/") && post.url !== "/blog/",
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Qiankun",
  description:
    "Quantitative finance case studies — portfolio construction, systematic alpha research, and equity valuation, by Qiankun (Kenny) Zhu.",

  // Vite plugins
  vite: {
    plugins: [
      RssPlugin(RSS_CONFIG),
      groupIconVitePlugin(),
      Icons({ compiler: "vue3", autoInstall: true }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "logo.svg", "og-image.png"],
        manifest: {
          name: "Qiankun",
          short_name: "Qiankun",
          description:
            "Quantitative finance case studies by Qiankun (Kenny) Zhu",
          theme_color: brand,
          background_color: "#000000",
          display: "standalone",
          icons: [
            {
              src: "/logo.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,txt,woff2}"],
        },
      }),
      imagemin({
        gifsicle: { optimizationLevel: 3 },
        optipng: { optimizationLevel: 5 },
        mozjpeg: { quality: 80 },
        svgo: {
          plugins: [
            { name: "removeViewBox", active: false },
            { name: "removeEmptyAttrs", active: false },
          ],
        },
        webp: { quality: 80 },
      }),
    ],
  },

  // Markdown plugins
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(groupIconMdPlugin);
    },
  },

  // SEO and Meta
  lang: "en-GB",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Qiankun Blog RSS",
        href: "/feed.rss",
      },
    ],
    [
      "link",
      {
        rel: "preload",
        href: "/fonts/source-sans-3-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "",
      },
    ],
    ["meta", { name: "author", content: "Qiankun" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "quantitative finance, portfolio construction, equity valuation, systematic alpha research, ESG, risk management",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en_GB" }],
    ["meta", { property: "og:site_name", content: "Qiankun" }],
    ["meta", { property: "og:url", content: "https://qiankun.co.uk/" }],
    [
      "meta",
      { property: "og:image", content: "https://qiankun.co.uk/og-image.png" },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://qiankun.co.uk/og-image.png",
      },
    ],
    // Google Analytics
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-4PF046MSJJ",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-4PF046MSJJ');`,
    ],
  ],

  // Clean URLs (no .html extension)
  cleanUrls: true,

  // Sitemap generation
  sitemap: {
    hostname: "https://qiankun.co.uk",
  },

  // Theme configuration
  themeConfig: {
    // Logo
    logo: "/logo.svg",
    siteTitle: "Qiankun",

    // Navigation bar
    nav: [
      { text: "Home", link: "/" },
      { text: "About", link: "/about" },
      { text: "Projects", link: "/projects/" },
      { text: "Writing", link: "/blog/" },
      { text: "Contact", link: "/contact" },
    ],

    // Sidebar configuration
    sidebar: {
      "/projects/": [
        {
          text: "Projects",
          items: [
            { text: "Overview", link: "/projects/" },
            {
              text: "LNG SPA Valuation",
              link: "/projects/lng-spa-valuation",
            },
            {
              text: "Global Equity Portfolio",
              link: "/projects/global-equity-portfolio",
            },
            {
              text: "WQ Alpha Research",
              link: "/projects/wq-alpha-research",
            },
            {
              text: "Board Diversity & ESG",
              link: "/projects/board-diversity-esg",
            },
            {
              text: "Cisco Equity Valuation",
              link: "/projects/cisco-equity-valuation",
            },
            {
              text: "UK Finance Pay",
              link: "/projects/uk-finance-pay",
            },
          ],
        },
      ],
      "/blog/": [
        {
          text: "Writing",
          items: [{ text: "ETRM Systems", link: "/blog/etrm-systems" }],
        },
      ],
    },

    // Social links
    socialLinks: [
      { icon: "github", link: "https://github.com/KennyZhu" },
      { icon: "linkedin", link: "https://linkedin.com/in/KennyZhu" },
      // { icon: 'twitter', link: 'https://twitter.com/KennyZhu' }
    ],

    // Footer
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Qiankun`,
    },

    // Search
    search: {
      provider: "local",
    },

    // Edit link - update with your GitHub username
    editLink: {
      pattern:
        "https://github.com/KennyZhu/qiankun-website/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    // Last updated
    lastUpdated: true,
    lastUpdatedText: "Last updated",
  },
});
