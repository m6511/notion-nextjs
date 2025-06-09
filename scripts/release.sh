#!/bin/bash
# scripts/release.sh

set -e

echo "🚀 Starting release process..."

# Check if we're on the main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ You must be on the main branch to release"
  exit 1
fi

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
  echo "❌ Working directory is not clean. Please commit your changes first."
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Ask for new version
echo "What type of release is this?"
echo "1) patch (0.1.0 -> 0.1.1)"
echo "2) minor (0.1.0 -> 0.2.0)"
echo "3) major (0.1.0 -> 1.0.0)"
echo "4) custom"

read -p "Enter choice (1-4): " choice

case $choice in
  1)
    NEW_VERSION=$(npm version patch --no-git-tag-version)
    ;;
  2)
    NEW_VERSION=$(npm version minor --no-git-tag-version)
    ;;
  3)
    NEW_VERSION=$(npm version major --no-git-tag-version)
    ;;
  4)
    read -p "Enter custom version: " CUSTOM_VERSION
    npm version $CUSTOM_VERSION --no-git-tag-version
    NEW_VERSION="v$CUSTOM_VERSION"
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

NEW_VERSION=${NEW_VERSION#v}  # Remove 'v' prefix if present
echo "🔄 New version: $NEW_VERSION"

# Build the project
echo "🔨 Building project..."
pnpm build

# Run tests
echo "🧪 Running tests..."
pnpm test

# Update CHANGELOG.md
echo "📝 Please update CHANGELOG.md with the new version changes."
echo "Press any key when ready to continue..."
read -n 1

# Commit version bump
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

# Create tag
git tag "v$NEW_VERSION"

# Push changes
echo "📤 Pushing to GitHub..."
git push origin main
git push origin "v$NEW_VERSION"

echo "✅ Release $NEW_VERSION complete!"
echo "🔗 Check the GitHub Actions workflow for npm publishing status"