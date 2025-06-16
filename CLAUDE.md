# Claude Code Instructions for notion-nextjs

## Documentation Management Protocol

When working on this project, you should maintain the Notion-based documentation using the automated workflow described below.

### ✅ For Every Codebase Change:

1. **Review existing documentation** - Before implementing new features, use the demo app to sync and review the current Notion documentation to understand what exists
2. **Consider documentation impact** - For each change, assess if it needs documentation updates
3. **Update via API when needed** - Use the documentation updater tool to maintain consistency
4. **Keep documentation short and concise** - Avoid unnecessary verbosity and keep in line with the existing structure. Consider to add a new page if the content is too long or complex.

### 🔧 Documentation Update Workflow

**Location:** All documentation utilities are in `/demo/notion-nextjs-demo/`

**Key Files:**

- `src/utils/notion-docs-updater.ts` - Multi-purpose documentation updater
- `scripts/update-docs.ts` - Example script for updating docs
- `.env.local` - Contains NOTION_API_KEY with write access
