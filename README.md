# Qiankun Website

Personal website and blog at [qiankun.co.uk](https://qiankun.co.uk).

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

```bash
npm run deploy
```

Deploys to AWS Amplify automatically via GitHub push.

## Project Structure

```
docs/
├── .vitepress/
│   ├── config.js      # VitePress configuration
│   └── theme/
│       ├── custom.css # Custom styles
│       └── index.js   # Theme setup
├── blog/              # Blog posts
├── about.md           # About page
├── contact.md         # Contact page
└── index.md           # Homepage
```

## Plugins

- **vitepress-plugin-rss** - RSS feed generation
- **vitepress-plugin-mermaid** - Mermaid diagrams
- **vitepress-plugin-tabs** - Tabbed content
- **vitepress-plugin-group-icons** - Code block icons
- **vite-plugin-pwa** - Progressive Web App support
- **vite-plugin-imagemin** - Image optimization
- **unplugin-icons** - Iconify icons as components

## License

MIT
