```typescript
// Generated from your database schema
export interface BlogPage extends SimplifiedPage {
	simplifiedProperties: {
		title: string;
		status: string | null;
		publishedDate: string | null;
		categories: string[];
		featured: boolean;
	};
}
```
