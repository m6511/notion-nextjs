#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { NotionNextJSConfig } from '../types';
import { NotionNextJS } from '../client';
import { generateTypesFile } from '../types/type-generator';
import { PropertyNamingConvention } from '../utils/property-transformer';
import { Logger } from '../utils/logger';

const CONFIG_FILENAME = 'notion.config.js';

function promptUser(question: string): Promise<string> {
	return new Promise((resolve) => {
		process.stdout.write(question + ' ');
		process.stdin.setEncoding('utf8');
		process.stdin.once('data', (data) => {
			resolve(data.toString().trim());
		});
	});
}

async function loadConfig(): Promise<NotionNextJSConfig> {
	const configPath = path.resolve(process.cwd(), CONFIG_FILENAME);

	if (!fs.existsSync(configPath)) {
		throw new Error(`Configuration file not found. Run "npx notion-nextjs setup" first.`);
	}

	// Clear require cache to ensure fresh config
	delete require.cache[configPath];
	return require(configPath);
}

async function sync(options?: { typesPath?: string }) {
	console.log('\n🔄 Syncing Notion databases...\n');

	// Load configuration
	const userConfig = await loadConfig();

	// Check for API key
	const apiKey = process.env.NOTION_API_KEY;
	if (!apiKey) {
		throw new Error('NOTION_API_KEY environment variable not found. Add it to your .env.local file.');
	}

	const notion = new NotionNextJS(apiKey, userConfig);
	const client = notion.getNotionClient();

	// Get the merged config from the client
	const mergedConfig = notion.getConfig();
	const logger = new Logger(mergedConfig.verbose);

	// Fetch all database schemas for type generation
	const databases = new Map();

	for (const [name, databaseId] of Object.entries(mergedConfig.databases)) {
		try {
			logger.log(`📊 Fetching schema for "${name}"...`);
			const database = await client.databases.retrieve({ database_id: databaseId });
			databases.set(name, database);
			logger.log(`✅ Fetched schema for "${name}"`);
		} catch (error: any) {
			logger.error(`❌ Failed to fetch "${name}": ${error.message}`);
		}
	}

	if (databases.size === 0) {
		throw new Error('No databases could be fetched. Check your configuration and API key.');
	}

	// Generate types file
	logger.log('\n📝 Generating TypeScript types...');
	const typesContent = generateTypesFile(databases, mergedConfig.propertyNaming);

	// Write types file
	// Determine types path (CLI option > config > default)
	const typesPath = options?.typesPath || mergedConfig.typesPath || 'types/notion.ts';
	const resolvedTypesPath = path.resolve(process.cwd(), typesPath);
	const typesDir = path.dirname(resolvedTypesPath);

	if (!fs.existsSync(typesDir)) {
		fs.mkdirSync(typesDir, { recursive: true });
	}

	fs.writeFileSync(typesPath, typesContent);
	logger.log(`✅ Generated types at ${typesPath}`);

	// Cache data if configured for local data source
	if (mergedConfig.dataSource === 'local') {
		logger.log('🔄 Syncing to cache because dataSource is local...');
		await notion.syncToCache();
	} else {
		logger.log('⏭️  Skipping cache sync because dataSource is not local');
	}

	logger.log('\n✨ Sync complete!\n');
}

async function setup() {
	console.log('\n🚀 Welcome to notion-nextjs setup!\n');

	// Check if config already exists
	if (fs.existsSync(CONFIG_FILENAME)) {
		const overwrite = await promptUser('Config file already exists. Overwrite? (y/N):');
		if (overwrite.toLowerCase() !== 'y') {
			console.log('Setup cancelled.');
			process.exit(0);
		}
	}

	// Collect database information
	const databases: Record<string, string> = {};
	console.log('Enter your Notion database information:\n');

	let isFirstDatabase = true;
	while (true) {
		const prompt = isFirstDatabase ? 'Database name (e.g., "blog"):' : 'Database name (or press Enter to finish):';

		const name = await promptUser(prompt);
		if (!name) break;

		const id = await promptUser('Database ID:');
		if (!id) {
			console.log('Database ID is required. Skipping this database.\n');
			continue;
		}

		databases[name] = id;
		console.log(`✅ Added database "${name}"\n`);
		isFirstDatabase = false;
	}

	if (Object.keys(databases).length === 0) {
		console.log('No databases configured. Setup cancelled.');
		process.exit(1);
	}

	// Ask about additional options
	const enableImages = await promptUser('Enable image optimization? (Y/n):');
	const useLocalCache = await promptUser('Enable local caching? (Y/n):');
	const verboseMode = await promptUser('Enable verbose logging? (Y/n):');
	const propertyNaming = await promptUser(
		'Property naming convention (camelCase/snake_case/PascalCase/none) [camelCase]:'
	);
	const typesPathInput = await promptUser('TypeScript types output path [types/notion.ts]:');

	// Create configuration with local as default
	const config: NotionNextJSConfig = {
		databases,
		dataSource: useLocalCache.toLowerCase() === 'n' ? 'live' : 'local',
		propertyNaming: (propertyNaming || 'camelCase') as PropertyNamingConvention,
		typesPath: typesPathInput || 'types/notion.ts',
		verbose: verboseMode.toLowerCase() !== 'n',
	};

	if (enableImages.toLowerCase() !== 'n') {
		config.images = {
			enabled: true,
			outputDir: '/public/images/notion',
			format: 'webp',
			quality: 85,
		};
	}

	if (config.dataSource === 'local') {
		config.outputDir = '.notion-cache';
	}

	// Generate config file content
	const configContent = `// notion.config.js
	// Generated by notion-nextjs
	
	/** @type {import('notion-nextjs').NotionNextJSConfig} */
	module.exports = {
	  databases: ${JSON.stringify(databases, null, 4).replace(/\n/g, '\n  ')},
	  dataSource: '${config.dataSource}',
	  propertyNaming: '${config.propertyNaming}',
	  typesPath: '${config.typesPath}',
	  verbose: ${config.verbose},
	${config.outputDir ? `  outputDir: '${config.outputDir}',\n` : ''}${
		config.images
			? `  images: {
		enabled: ${config.images.enabled},
		outputDir: '${config.images.outputDir}',
		format: '${config.images.format}',
		quality: ${config.images.quality},
	  },\n`
			: ''
	}};
	`;

	// Write config file
	fs.writeFileSync(CONFIG_FILENAME, configContent);
	console.log(`\n✅ Created ${CONFIG_FILENAME}`);

	// Create .env.local template if it doesn't exist
	const envPath = '.env.local';
	if (!fs.existsSync(envPath)) {
		const envContent = `# Notion API Configuration
NOTION_API_KEY=your-notion-integration-token-here
`;
		fs.writeFileSync(envPath, envContent);
		console.log(`✅ Created ${envPath} template`);
	}

	// Show next steps
	console.log('\n📝 Next steps:');
	console.log('1. Add your Notion API key to .env.local');
	console.log('2. Run "npx notion-nextjs sync" to generate types');
	console.log('3. Import and use notion-nextjs in your project:');
	console.log('\n   ```typescript');
	console.log('   import { NotionNextJS } from "notion-nextjs";');
	console.log('   import config from "./notion.config.js";');
	console.log(`   import type { BlogPage } from "./${config.typesPath?.replace('.ts', '')}";`);
	console.log('');
	console.log('   const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);');
	console.log('   const pages = await notion.getAllPages<BlogPage>("blog");');
	console.log('   ```\n');

	process.exit(0);
}

async function main() {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case 'setup':
			await setup();
			break;
		case 'sync':
			const typesPathIndex = args.findIndex((arg) => arg === '--types-path' || arg === '-t');
			const typesPath = typesPathIndex !== -1 ? args[typesPathIndex + 1] : undefined;

			await sync({ typesPath });
			break;
		default:
			console.log('notion-nextjs CLI\n');
			console.log('Commands:');
			console.log('  setup                    - Initialize notion-nextjs configuration');
			console.log('  sync [options]           - Sync data and generate types');
			console.log('');
			console.log('Sync options:');
			console.log('  --types-path, -t <path>  - Override types output path');
			console.log('');
			console.log('Examples:');
			console.log('  npx notion-nextjs setup');
			console.log('  npx notion-nextjs sync');
			console.log('  npx notion-nextjs sync --types-path src/types/notion-types.ts');
			break;
	}
}

// Handle errors
process.on('uncaughtException', (error) => {
	console.error('\n❌ Error:', error.message);
	process.exit(1);
});

main();
