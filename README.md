# Nuxt AI Chatbot Template

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com/pro)
[![Deploy to NuxtHub](https://img.shields.io/badge/Deploy%20to-NuxtHub-00DC82?logo=nuxt&labelColor=020420)](https://hub.nuxt.com/new?repo=nuxt-ui-pro/chat)

Full-featured AI Chatbot Nuxt application with authentication, chat history, multiple pages, collapsible sidebar, keyboard shortcuts, light & dark mode, command palette and more. Built with [Nuxt UI Pro](https://ui.nuxt.com/getting-started/installation/pro/nuxt) components and integrated with [Workers AI](https://ai.cloudflare.com) for a complete chat experience.

- [Live demo](https://chat-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/pro/getting-started)

<a href="https://chat-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL2NoYXQtdGVtcGxhdGUubnV4dC5kZXYiLCJpYXQiOjE3NDI4NDY2ODB9.n4YCsoNz8xatox7UMoYZFNo7iS1mC_DT0h0A9cKRoTw.jpg?theme=dark">
    <source media="(prefers-color-scheme: light)" srcset="https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL2NoYXQtdGVtcGxhdGUubnV4dC5kZXYiLCJpYXQiOjE3NDI4NDY2ODB9.n4YCsoNz8xatox7UMoYZFNo7iS1mC_DT0h0A9cKRoTw.jpg?theme=light">
    <img alt="Nuxt AI Chatbot Template" src="https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL2NoYXQtdGVtcGxhdGUubnV4dC5kZXYiLCJpYXQiOjE3NDI4NDY2ODB9.n4YCsoNz8xatox7UMoYZFNo7iS1mC_DT0h0A9cKRoTw.jpg">
  </picture>
</a>

## Features

- Streaming of AI messages with the [AI SDK](https://sdk.vercel.ai)
- Choose between a list of models available from [Workers AI](https://ai.cloudflare.com)
- Authentication with  with [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
- Save chat threads into [NuxtHub database](https://hub.nuxt.com/docs/features/database) using [Drizzle ORM](https://orm.drizzle.team)
- Deploy for free & zero config on [NuxtHub](https://hub.nuxt.com)

## Quick Start

```bash [Terminal]
npx nuxi@latest init -t github:nuxt-ui-pro/chat
```

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
