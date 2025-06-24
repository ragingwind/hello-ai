# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 application showcasing AI-powered web content summarization. Built with the Vercel AI SDK (@ai-sdk/openai) and features web scraping capabilities using Puppeteer and Mozilla Readability.

## Development Commands

- **Development**: `pnpm dev` - Start Next.js development server
- **Build**: `pnpm build` - Build for production (configured for AWS Lambda deployment)
- **Lint**: `pnpm lint` - Run Biome linter and formatter
- **Test**: `pnpm test` - Run Vitest tests (10s timeout)
- **Test Watch**: `pnpm test:watch` - Run tests in watch mode

## Architecture

### Core Structure
- **Next.js App Router** with TypeScript and Tailwind CSS
- **API Layer**: `/app/api/scrape/route.ts` - Web scraping endpoint using Puppeteer
- **Browser Abstraction**: `/app/lib/browser.ts` - Wrapper around Puppeteer with cross-platform Chrome support
- **AI Models**: `/app/lib/ai-models.ts` - Multi-provider AI model factory supporting OpenAI, Anthropic, Google, Mistral, DeepSeek, Grok, Alibaba, and custom providers

### Web Summarization Feature
Located in `/app/examples/web-summarization/`:
- **page.tsx**: Main UI with URL input and model selection
- **model-selector.tsx**: Provider/model configuration component  
- **summary-result.tsx**: Results display component

### Browser Configuration
- **Local Development**: Uses system Chrome installation
- **Vercel Deployment**: Uses @sparticuz/chromium-min for serverless compatibility
- **Cross-platform**: Supports Windows, Linux, macOS with appropriate Chrome paths

### Styling & Components
- **Shadcn/ui components** in `/components/ui/`
- **Biome formatter** with 2-space indentation, 100 character line width
- **Tailwind CSS** for styling

## Key Dependencies

- **@ai-sdk/openai**: Core AI functionality with multi-provider support
- **puppeteer-core + @sparticuz/chromium-min**: Web scraping and rendering
- **@mozilla/readability**: Content extraction from web pages
- **turndown**: HTML to Markdown conversion
- **react-markdown**: Markdown rendering in UI

## Environment Setup

- **Node.js**: Version 22 required
- **Package Manager**: pnpm (version 10.6.5+)
- **API Keys**: Configured through environment variables for each AI provider