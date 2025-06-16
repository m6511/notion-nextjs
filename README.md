# notion-nextjs

A lightweight, type-safe Notion API wrapper for Next.js applications with automatic type generation, local caching, and image optimization.

## ⚠ Pre-release

This project is currently in pre-release, you can use it but some features are lacking and core components are still able to change.

Do not hesitate to open an issue to provide your feedback, report bugs and to propose new features.

## 🤖 Disclaimer

This is a test project to evaluate Claude Code's capabilities. Significant portions of the codebase, documentation, and demo implementation have been generated or improved with AI assistance from Claude Code.

## Features

- **Simple Setup:** Interactive CLI to get started quickly
- **Type Safety:** Auto-generates TypeScript types from your Notion databases
- **Local Caching:** Cache Notion data locally for faster development
- **Image Optimization:** Download and optimize images from Notion
- **Simplified API:** Cleaner data structure than raw Notion API
- **Next.js Optimized:** Built for Next.js 13+ App Router

## Quick Start

### 1. Install and setup

```bash
npm install notion-nextjs
npx notion-nextjs setup
```

### 2. Configure environment

Add your Notion integration token to `.env.local`:

```env
NOTION_API_KEY=secret_your_integration_token_here
```

### 3. Generate types and sync data

```bash
npx notion-nextjs sync
```

### 4. Use in your app

```typescript
// app/blog/page.tsx
import { NotionNextJS } from 'notion-nextjs';
import config from '@/notion.config.js';
import type { BlogPage } from '@/types/notion';

const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

export default async function BlogPage() {
	const posts = await notion.getAllPages<BlogPage>('blog');

	return (
		<div>
			<h1>Blog Posts</h1>
			{posts.map((post) => (
				<article key={post.id}>
					{post.coverUrl && <img src={post.coverUrl} alt={post.title || ''} />}
					<h2>{post.title}</h2>
					<p>Status: {post.simplifiedProperties.status}</p>
				</article>
			))}
		</div>
	);
}
```

[ → Read the docs](https://notion-nextjs-demo.vercel.app/docs/installation) for complete documentation, examples, and API reference.

## To Do

- [x] Next.js example
- [x] Add property transformer
- [x] Support custom types location
- [x] Create docs
- [x] Markdown content support
- [ ] Add tests
- [ ] Simplify public API
- [ ] Next.js ISR support
- [ ] Static import support for next/image
- [x] Webp image optimization
- [ ] Option to disable icon downloading
- [x] Option to disable the console logs
