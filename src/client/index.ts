import { Client } from '@notionhq/client';
import { NotionNextJSConfig, NotionNextJSRuntimeConfig } from '../types';
import { mergeConfig, validateConfig } from '../config';
import { simplifyPage, simplifyPages, SimplifiedPage } from '../utils/property-extractor';
import { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { CacheManager } from '../cache';
import { ImageHandler } from '../images';
import * as fs from 'fs';
import * as path from 'path';

export class NotionNextJS {
	private client: Client;
	private config: NotionNextJSRuntimeConfig;
	private cache: CacheManager;
	private imageHandler: ImageHandler;

	constructor(auth: string, config: NotionNextJSConfig) {
		validateConfig(config);
		this.config = mergeConfig(config);
		this.client = new Client({ auth });
		this.cache = new CacheManager(this.config);
		this.imageHandler = new ImageHandler(this.config);
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

	// Get image handler
	getImageHandler(): ImageHandler {
		return this.imageHandler;
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
			processImages?: boolean;
		}
	): Promise<T[]> {
		const databaseId = this.getDatabaseId(databaseName);
		const { filter, sorts, simplify = true, useCache = true, processImages = true } = options || {};

		let pages: PageObjectResponse[] = [];

		// Try to use cache if in local mode
		if (this.config.dataSource === 'local' && useCache) {
			const cachedPages = await this.cache.getCachedPages(databaseName);
			if (cachedPages) {
				console.log(`📦 Using cached data for database "${databaseName}"`);
				pages = cachedPages;
			} else {
				console.log(`⚠️  No cached data found for database "${databaseName}", falling back to live API`);
			}
		}

		// Fetch from live API if not cached
		if (pages.length === 0) {
			console.log(`🌐 Fetching live data for database "${databaseName}"`);
			const response = await this.client.databases.query({
				database_id: databaseId,
				filter,
				sorts,
			});
			pages = response.results as PageObjectResponse[];
		}

		if (simplify) {
			let simplifiedPages = simplifyPages<T>(pages, this.config.propertyNaming);

			// Process images if enabled
			if (processImages && this.config.images.enabled) {
				simplifiedPages = (await this.imageHandler.processPages(simplifiedPages)) as T[];
			}

			return simplifiedPages;
		}

		return pages as T[];
	}

	// Get a single page by ID with simplified properties
	async getPage<T extends SimplifiedPage = SimplifiedPage>(
		pageId: string,
		options?: {
			simplify?: boolean;
			useCache?: boolean;
			processImages?: boolean;
		}
	): Promise<T> {
		const { simplify = true, useCache = true, processImages = true } = options || {};

		let page: PageObjectResponse | null = null;

		// Try to find in cache if in local mode
		if (this.config.dataSource === 'local' && useCache) {
			// Search through all cached databases for this page
			for (const [dbName] of Object.entries(this.config.databases)) {
				const cachedPages = await this.cache.getCachedPages(dbName);
				if (cachedPages) {
					const foundPage = cachedPages.find((p) => p.id === pageId);
					if (foundPage) {
						console.log(`📦 Found page in cache (database: ${dbName})`);
						page = foundPage;
						break;
					}
				}
			}
			if (!page) {
				console.log(`⚠️  Page ${pageId} not found in cache, falling back to live API`);
			}
		}

		// Fetch from live API if not cached
		if (!page) {
			console.log(`🌐 Fetching page ${pageId} from live API`);
			page = (await this.client.pages.retrieve({ page_id: pageId })) as PageObjectResponse;
		}

		if (simplify) {
			let simplifiedPage = simplifyPage<T>(page, this.config.propertyNaming);

			// Process images if enabled
			if (processImages && this.config.images.enabled) {
				simplifiedPage = (await this.imageHandler.processPageImages(simplifiedPage)) as T;
			}

			return simplifiedPage;
		}

		return page as T;
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

				// Process images if enabled
				if (this.config.images.enabled) {
					const simplifiedPages = simplifyPages(pages, this.config.propertyNaming);
					await this.imageHandler.processPages(simplifiedPages);
				}
			} catch (error: any) {
				console.error(`❌ Failed to sync "${name}": ${error.message}`);
			}
		}

		// Save metadata
		await this.cache.setMetadata(metadata);
		console.log('\n✨ Sync complete! Cache saved to:', this.config.outputDir);

		// Save image map
		if (this.config.images.enabled) {
			const imageMapPath = path.join(this.config.outputDir, 'image-map.json');
			await fs.promises.writeFile(imageMapPath, JSON.stringify(this.imageHandler.getImageMap(), null, 2));
			console.log(`📸 Image map saved to: ${imageMapPath}`);
		}
	}
}
