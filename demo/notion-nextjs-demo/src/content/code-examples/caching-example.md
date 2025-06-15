```typescript
// Cached requests
const posts = await notion.getAllPages('blog');
// Automatically cached ⚡

// Manual cache control
await notion.clearCache();
await notion.syncContent();
```
