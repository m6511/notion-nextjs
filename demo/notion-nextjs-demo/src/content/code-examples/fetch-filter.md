```typescript
// Fetch and filter with full type safety
const posts = await notion.getAllPages<BlogPost>('blog');

// Filter published posts
const published = posts.filter(
	(post) => post.simplifiedProperties.status === 'Published'
);

// Sort by publish date
const sorted = published.sort(
	(a, b) =>
		new Date(b.simplifiedProperties.publishDate).getTime() -
		new Date(a.simplifiedProperties.publishDate).getTime()
);

// Get posts by tag
const devPosts = posts.filter((post) =>
	post.simplifiedProperties.tags.includes('Development')
);
```
