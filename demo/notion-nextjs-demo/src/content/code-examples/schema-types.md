```typescript
// Auto-generated from your Notion schema
interface BlogPost {
  id: string
  title: string
  publishDate: Date
  status: 'Published' | 'Draft' | 'Archived'
  tags: string[]
  excerpt?: string
  author: {
    name: string
    email: string
  }
  coverImage?: string
}
```