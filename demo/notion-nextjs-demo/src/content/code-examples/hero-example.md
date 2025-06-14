```typescript
// Import notion-nextjs
import { NotionNextJS } from 'notion-nextjs';

// Initialize with config
const notion = new NotionNextJS(apiKey, config);

// Get pages with type safety
const posts = await notion.getAllPages<BlogPage>('blog');
```
