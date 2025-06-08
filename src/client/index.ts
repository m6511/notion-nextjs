import { Client } from '@notionhq/client';
import { NotionNextJSConfig, NotionNextJSRuntimeConfig } from '../types';
import { mergeConfig, validateConfig } from '../config';
import { simplifyPage, simplifyPages, SimplifiedPage } from '../utils/property-extractor';
import { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { CacheManager } from '../cache';

export class NotionNextJS {
	private client: Client;
	private config: NotionNextJSRuntimeConfig;
	private cache: CacheManager;

	constructor(auth: string, config: NotionNextJSConfig) {
		validateConfig(config);
		this.config = mergeConfig(config);
		this.client = new Client({ auth });
		this.cache = new CacheManager(this.config);
	}

	// Get the underlying Notion client for direct access
	getNotionClient(): Client {
		return this.client;
	}

	// Get configuration
	getConfig(): NotionNextJSRuntimeConfig {
		return this.config;
	}

	// Get cache manager
	getCacheManager(): CacheManager {
		return this.cache;
	}

	// Get database ID by name
	getDatabaseId(name: string): string {
		const id = this.config.databases[name];
		if (!id) {
			throw new Error(`Database "${name}" not found in configuration`);
		}
		return id;
	}

	// Get all pages from a database with simplified properties
	async getAllPages<T extends SimplifiedPage = SimplifiedPage>(
		databaseName: string,
		options?: {
			filter?: any;
			sorts?: any;
			simplify?: boolean;
			useCache?: boolean;
		}
	): Promise<T[]> {
		const databaseId = this.getDatabaseId(databaseName);
		const { filter, sorts, simplify = true, useCache = true } = options || {};

		// Try to use cache if in local mode
		if (this.config.dataSource === 'local' && useCache) {
			const cachedPages = await this.cache.getCachedPages(databaseName);
			if (cachedPages) {
				console.log(`📦 Using cached data for database "${databaseName}"`);
				return simplify ? simplifyPages<T>(cachedPages) : (cachedPages as T[]);
			} else {
				console.log(`⚠️  No cached data found for database "${databaseName}", falling back to live API`);
			}
		}

		// Fetch from live API
		console.log(`🌐 Fetching live data for database "${databaseName}"`);
		const response = await this.client.databases.query({
			database_id: databaseId,
			filter,
			sorts,
		});

		const pages = response.results as PageObjectResponse[];

		if (simplify) {
			return simplifyPages<T>(pages);
		}

		return pages as T[];
	}

	// Get a single page by ID with simplified properties
	async getPage<T extends SimplifiedPage = SimplifiedPage>(
		pageId: string,
		options?: {
			simplify?: boolean;
			useCache?: boolean;
		}
	): Promise<T> {
		const { simplify = true, useCache = true } = options || {};

		// Try to find in cache if in local mode
		if (this.config.dataSource === 'local' && useCache) {
			// Search through all cached databases for this page
			for (const [dbName] of Object.entries(this.config.databases)) {
				const cachedPages = await this.cache.getCachedPages(dbName);
				if (cachedPages) {
					const page = cachedPages.find((p) => p.id === pageId);
					if (page) {
						console.log(`📦 Found page in cache (database: ${dbName})`);
						return simplify ? simplifyPage<T>(page) : (page as T);
					}
				}
			}
			console.log(`⚠️  Page ${pageId} not found in cache, falling back to live API`);
		}

		// Fetch from live API
		console.log(`🌐 Fetching page ${pageId} from live API`);
		const response = (await this.client.pages.retrieve({ page_id: pageId })) as PageObjectResponse;

		if (simplify) {
			return simplifyPage<T>(response);
		}

		return response as T;
	}

	/**
	 * Sync all databases and their pages to local cache
	 */
	async syncToCache(): Promise<void> {
		console.log('🔄 Starting sync to local cache...\n');

		// Initialize cache directory
		await this.cache.init();

		const metadata = {
			version: '1.0.0',
			lastSync: new Date().toISOString(),
			databases: {} as Record<string, any>,
		};

		// Sync each database
		for (const [name, databaseId] of Object.entries(this.config.databases)) {
			try {
				console.log(`📊 Syncing database "${name}"...`);

				// Fetch and cache database schema
				const database = (await this.client.databases.retrieve({ database_id: databaseId })) as DatabaseObjectResponse;
				await this.cache.cacheDatabase(name, database);

				// Fetch and cache all pages
				const response = await this.client.databases.query({ database_id: databaseId });
				const pages = response.results as PageObjectResponse[];
				await this.cache.cachePages(name, pages);

				metadata.databases[name] = {
					id: databaseId,
					name: CacheManager.extractDatabaseTitle(database),
					lastSync: new Date().toISOString(),
				};

				console.log(`✅ Synced ${pages.length} pages from "${name}"`);
			} catch (error: any) {
				console.error(`❌ Failed to sync "${name}": ${error.message}`);
			}
		}

		// Save metadata
		await this.cache.setMetadata(metadata);
		console.log('\n✨ Sync complete! Cache saved to:', this.config.outputDir);
	}
}
