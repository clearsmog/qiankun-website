# Qiankun Website

Personal portfolio site at [qiankun.co.uk](https://qiankun.co.uk) — quantitative finance case studies.

Built with [VitePress](https://vitepress.dev/).

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Deploy

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`),
which builds the site and deploys `docs/.vitepress/dist/` to **Cloudflare Pages** at
qiankun.co.uk. Redirect rules live in `docs/public/_redirects` (Cloudflare Pages syntax).

`deploy.sh` / `amplify.yml` are a legacy AWS Amplify pipeline pending removal — do not use.

## Project Structure

```
docs/
├── .vitepress/
│   ├── config.js          # VitePress configuration (nav, sidebar, SEO, plugins)
│   ├── data/              # Content loaders (blog posts)
│   └── theme/
│       ├── custom.css     # Design tokens + site styles
│       ├── index.js       # Theme setup, global component registration
│       └── components/
│           └── viz/       # ECharts chart components (EBar, ELine, …) + layout (VizPanel, HeroMetrics)
├── projects/              # Case studies (the core content)
├── blog/                  # Writing
├── public/                # Static assets (fonts, og-image, _redirects)
├── about.md               # About page
├── contact.md             # Contact page
└── index.md               # Homepage
```

## Plugins

- **vitepress-plugin-rss** - RSS feed generation
- **vitepress-plugin-tabs** - Tabbed content
- **vitepress-plugin-group-icons** - Code block icons
- **vite-plugin-pwa** - Progressive Web App support
- **vite-plugin-imagemin** - Image optimization
- **unplugin-icons** - Iconify icons as components

## License

MIT
