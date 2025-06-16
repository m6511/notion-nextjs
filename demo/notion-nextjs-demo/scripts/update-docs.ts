import * as dotenv from 'dotenv';
import { NotionDocsUpdaterImpl, DocumentationUpdate } from '../src/utils/notion-docs-updater';

// Load environment variables
dotenv.config({ path: './.env.local' });

async function updateDocumentation() {
	const apiKey = process.env.NOTION_API_KEY;
	if (!apiKey) {
		console.error('❌ NOTION_API_KEY not found in environment variables');
		process.exit(1);
	}

	const updater = new NotionDocsUpdaterImpl(apiKey, true);

	try {
		console.log('🚀 Starting documentation updates...\n');
		console.log(`📋 Available pages: ${updater.listAvailablePages().join(', ')}\n`);

		// Update verbose logging in configuration page
		const verboseLoggingUpdate: DocumentationUpdate = {
			title: 'Verbose Logging',
			description: 'Control the visibility of console messages during operations.',
			type: 'configuration',
			content: {
				overview: 'The verbose option allows you to control whether detailed console messages are displayed during data fetching and syncing operations.',
				configuration: {
					options: [
						{
							name: 'verbose',
							type: 'boolean',
							description: 'Controls whether detailed console messages are displayed during operations. When set to false, only error messages will be shown.',
							defaultValue: 'true',
							required: false,
							possibleValues: ['true', 'false']
						}
					],
					example: `// notion.config.js
module.exports = {
  databases: {
    blog: 'your-database-id'
  },
  verbose: false, // Disable detailed logging
  // ... other options
};`,
					language: 'javascript'
				},
				benefits: [
					'Cleaner console output in production environments',
					'Reduced noise during automated builds',
					'Error messages are always preserved for debugging'
				],
				notes: [
					'Error messages are always displayed regardless of the verbose setting for debugging purposes.',
					'This setting affects both CLI operations and runtime API usage.'
				]
			}
		};

		// Update WebP optimization in image optimization page
		const webpOptimizationUpdate: DocumentationUpdate = {
			title: 'WebP Image Optimization',
			description: 'Automatically convert images to WebP format for better performance and smaller file sizes.',
			type: 'feature',
			content: {
				overview: 'WebP optimization uses Sharp image processing to automatically convert downloaded images to the WebP format, providing significant file size reductions while maintaining image quality.',
				benefits: [
					'**Smaller file sizes:** WebP images are typically 20-30% smaller than JPEG/PNG',
					'**Automatic conversion:** Original images are downloaded and converted seamlessly',
					'**Fallback handling:** If conversion fails, original format is preserved',
					'**Quality control:** Adjustable compression quality (1-100)',
					'**Performance boost:** Faster page loads with optimized images'
				],
				configuration: {
					options: [
						{
							name: 'images.format',
							type: 'string',
							description: 'Image output format. Use "webp" for optimization or "original" to keep source format.',
							defaultValue: 'webp',
							required: false,
							possibleValues: ['webp', 'original']
						},
						{
							name: 'images.quality',
							type: 'number',
							description: 'WebP compression quality from 1-100. Higher values mean better quality but larger file sizes.',
							defaultValue: '85',
							required: false
						}
					],
					example: `// Enable WebP optimization
module.exports = {
  databases: {
    blog: 'your-database-id'
  },
  images: {
    enabled: true,
    format: 'webp',     // Convert to WebP
    quality: 80,        // Compression quality
    outputDir: '/public/images/notion'
  }
};

// Disable optimization (keep original format)
module.exports = {
  images: {
    enabled: true,
    format: 'original'  // No conversion
  }
};`,
					language: 'javascript'
				},
				examples: [
					{
						title: 'High Quality WebP',
						description: 'For cases where image quality is more important than file size',
						code: `images: {
  enabled: true,
  format: 'webp',
  quality: 95
}`,
						language: 'javascript'
					},
					{
						title: 'Balanced Optimization',
						description: 'Good balance between quality and file size for most use cases',
						code: `images: {
  enabled: true,
  format: 'webp',
  quality: 80
}`,
						language: 'javascript'
					}
				],
				notes: [
					'This feature requires the Sharp library which is automatically installed as a dependency.',
					'WebP conversion adds processing time during sync operations but significantly improves runtime performance.',
					'If WebP conversion fails for any image, the original format is preserved as a fallback.'
				],
				relatedPages: [
					'Configuration Options',
					'Local Caching',
					'Data Source Modes'
				]
			}
		};

		// Apply updates
		console.log('📝 Adding verbose logging documentation to configuration page...');
		await updater.updatePage('configuration', [verboseLoggingUpdate]);

		console.log('🖼️  Adding WebP optimization documentation to image optimization page...');
		await updater.updatePage('image-optimization', [webpOptimizationUpdate]);

		console.log('\n✅ Documentation updates completed successfully!');
		console.log('\n📋 Next steps:');
		console.log('1. Run sync command to verify updates: npx notion-nextjs sync');
		console.log('2. Check the documentation pages in your Notion workspace');
		console.log('3. Verify the new content appears in your Next.js app');

	} catch (error) {
		console.error('❌ Failed to update documentation:', error);
		console.error('Error details:', error);
		process.exit(1);
	}
}

// Run the update
updateDocumentation();