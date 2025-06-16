# Claude Code Instructions for notion-nextjs

## Documentation Management Protocol

When working on this project, you should maintain the Notion-based documentation using the automated workflow described below.

### ✅ For Every Codebase Change:

1. **Create feature branch** - Always work on separate branches: `git checkout -b feature/your-feature-name`
2. **Review existing documentation** - Before implementing, sync and review current Notion docs to understand what exists
3. **Consider documentation impact** - For each change, assess if it needs documentation updates
4. **Update via API when needed** - Use the documentation updater tool to maintain consistency
5. **Commit frequently** - Make small, focused commits with concise messages
6. **Update docs and code together** - Always commit both feature code and documentation updates in the same branch
7. **Keep documentation short and concise** - Avoid unnecessary verbosity and keep in line with the existing structure. Consider to add a new page if the content is too long or complex.

### 🔧 Git Workflow

**Always work on feature branches:**
```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Make changes, commit frequently
git add .
git commit -m "feat: add basic implementation"
git commit -m "docs: update configuration page"
git commit -m "test: add feature validation"

# When complete, push branch
git push origin feature/your-feature-name
```

**Commit Message Guidelines:**
- Keep messages short and concise (under 50 characters)
- Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Focus on what was done, not how
- Examples: `feat: add webp optimization`, `docs: update image config`, `fix: handle conversion errors`

### 🔧 Documentation Update Workflow

**Location:** All documentation utilities are in `/demo/notion-nextjs-demo/`

**Key Files:**

- `src/utils/notion-docs-updater.ts` - Multi-purpose documentation updater
- `scripts/update-docs.ts` - Example script for updating docs
- `.env.local` - Contains NOTION_API_KEY with write access

### 🔄 Complete Feature Development Workflow

**Step-by-step process for adding any new feature:**

1. **Create branch**: `git checkout -b feature/your-feature-name`
2. **Implement feature**: Write the code in main library
3. **Update docs**: Use documentation updater to add/update Notion pages
4. **Verify changes**: 
   ```bash
   cd demo/notion-nextjs-demo
   npx notion-nextjs sync  # Pull doc changes back
   pnpm build              # Verify everything works
   ```
5. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: implement your feature"
   git commit -m "docs: add feature documentation"
   ```
6. **Push branch**: `git push origin feature/your-feature-name`

### 📝 Commit Best Practices

- **Keep messages under 50 characters**
- **Use conventional commits**: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- **Focus on what, not how**: `feat: add webp support` not `feat: implement image conversion using sharp library`
- **Commit frequently**: Small, focused commits are better than large ones
- **Always commit docs with features**: Keep code and documentation in sync

This workflow ensures clean git history and up-to-date documentation!
