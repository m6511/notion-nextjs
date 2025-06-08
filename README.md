# notion-nextjs

A lightweight, type-safe Notion API wrapper designed specifically for Next.js applications. Features automatic type generation, local caching, and image optimization.

## Features

- 🚀 **Simple Setup** - Interactive CLI to get started quickly
- 📘 **Type Safety** - Automatically generates TypeScript types from your Notion databases
- 💾 **Local Caching** - Cache your Notion data locally for faster builds
- 🖼️ **Image Optimization** - Download and optimize images from Notion
- 🎯 **Simplified API** - Cleaner data structure than raw Notion API
- ⚡ **Next.js Optimized** - Built specifically for Next.js 13+ App Router

## Installation

```bash
npm install notion-nextjs
# or
pnpm add notion-nextjs
# or
yarn add notion-nextjs
```

## Quick Start

### 1. Set up your Notion integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the "Internal Integration Token"
4. Share your database with the integration

### 2. Initialize your project

```bash
npx notion-nextjs setup
```

This interactive CLI will:

- Create a `notion.config.js` file with your databases
- Create a `.env.local` template for your Notion API key
- Set up the configuration for your project

### 3. Add your Notion API key

Add your integration token to `.env.local`:

```env
NOTION_API_KEY=secret_your_integration_token_here
```

### 4. Generate types and sync data

```bash
npx notion-nextjs sync
```

This will:

- Generate TypeScript types for all your databases
- Cache data locally (if configured)
- Download images (if enabled)

## Usage

### Basic Example

```typescript
import { NotionNextJS } from 'notion-nextjs';
import config from './notion.config.js';
import type { BlogPage } from './types/notion';

// Initialize the client
const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

// Fetch all pages from a database
const posts = await notion.getAllPages<BlogPage>('blog');

// Access properties directly!
posts.forEach((post) => {
	console.log(post.title);
	console.log(post.coverUrl); // Simplified cover access
	console.log(post.simplifiedProperties.customProperty);
});

// Get a single page
const page = await notion.getPage<BlogPage>('page-id-here');
```

### Next.js App Router Example

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

## Configuration

Your `notion.config.js` file supports the following options:

```javascript
module.exports = {
	// Required: Database configuration
	databases: {
		blog: 'your-database-id',
		products: 'another-database-id',
	},

	// Optional: Data source (default: 'local')
	dataSource: 'local', // 'local' | 'live'

	// Optional: Cache directory (default: '.notion-cache')
	outputDir: '.notion-cache',

	// Optional: Image configuration
	images: {
		enabled: true,
		outputDir: '/public/images/notion',
		format: 'webp', // 'webp' | 'original'
		quality: 85,
	},
};
```

## API Reference

### NotionNextJS

The main client class.

```typescript
const notion = new NotionNextJS(apiKey: string, config: NotionNextJSConfig);
```

#### Methods

##### getAllPages<T>(databaseName, options?)

Fetch all pages from a database.

```typescript
const pages = await notion.getAllPages<BlogPage>('blog', {
	filter: {
		/* Notion filter */
	},
	sorts: [
		{
			/* Notion sort */
		},
	],
	simplify: true, // Simplify properties (default: true)
	useCache: true, // Use local cache if available (default: true)
	processImages: true, // Process images to local paths (default: true)
});
```

##### getPage<T>(pageId, options?)

Fetch a single page by ID.

```typescript
const page = await notion.getPage<BlogPage>('page-id', {
	simplify: true,
	useCache: true,
	processImages: true,
});
```

##### syncToCache()

Manually sync all data to local cache.

```typescript
await notion.syncToCache();
```

### Simplified Data Structure

notion-nextjs simplifies Notion's complex data structure:

```typescript
// Original Notion API
page.properties.Title.title[0].plain_text;
page.cover.file.url;

// With notion-nextjs
page.title;
page.coverUrl;
page.simplifiedProperties.Title;
```

## Type Generation

After running `npx notion-nextjs sync`, you'll get generated types:

```typescript
// types/notion.ts
export interface BlogPage extends SimplifiedPage {
	simplifiedProperties: {
		Title: string;
		Status: string | null;
		PublishDate: string | null;
		Tags: string[];
		// ... other properties
	};
}
```

# TO DO

- [ ] Deploy to npm
- [ ] Add tests
- [ ] Add next js example page with dynamic and static pages
- [ ] Webp image optimization
- [ ] Support static imports (useful for next/image blurs)
- [ ] Serve page content as markdown
