import { Client } from '@notionhq/client';
import { NotionNextJSConfig, NotionNextJSRuntimeConfig } from '../types';
import { mergeConfig, validateConfig } from '../config';
import { simplifyPage, simplifyPages, SimplifiedPage } from '../utils/property-extractor';
import { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { CacheManager } from '../cache';
import { ImageHandler } from '../images';
import { ContentHandler } from '../content';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export class NotionNextJS {
	private client: Client;
	private config: NotionNextJSRuntimeConfig;
	private cache: CacheManager;
	private imageHandler: ImageHandler;
	private contentHandler: ContentHandler;
	private logger: Logger;

	constructor(auth: string, config: NotionNextJSConfig) {
		validateConfig(config);
		this.config = mergeConfig(config);
		this.client = new Client({ auth });
		this.logger = new Logger(this.config.verbose);
		this.cache = new CacheManager(this.config, this.logger);
		this.imageHandler = new ImageHandler(this.config, this.logger);
		this.contentHandler = new ContentHandler(this.client, this.config, this.logger);
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

	// Get content handler
	getContentHandler(): ContentHandler {
		return this.contentHandler;
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
			includeContent?: boolean;
		}
	): Promise<T[]> {
		const databaseId = this.getDatabaseId(databaseName);
		const {
			filter,
			sorts,
			simplify = true,
			useCache = true,
			processImages = true,
			includeContent = true,
		} = options || {};

		let pages: PageObjectResponse[] = [];

		// Try to use cache if in local mode
		if (this.config.dataSource === 'local' && useCache) {
			const cachedPages = await this.cache.getCachedPages(databaseName);
			if (cachedPages) {
				this.logger.log(`📦 Using cached data for database "${databaseName}"`);
				pages = cachedPages;
			} else {
				this.logger.log(`⚠️  No cached data found for database "${databaseName}", falling back to live API`);
			}
		}

		// Fetch from live API if not cached
		if (pages.length === 0) {
			this.logger.log(`🌐 Fetching live data for database "${databaseName}"`);
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

			if (includeContent) {
				await this.contentHandler.init();
				for (const page of simplifiedPages) {
					const content = await this.contentHandler.getPageContent(page.id, options?.useCache);
					if (content) {
						(page as any).content = content;
					}
				}
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
			includeContent?: boolean;
		}
	): Promise<T> {
		const { simplify = true, useCache = true, processImages = true, includeContent = true } = options || {};

		let page: PageObjectResponse | null = null;

		// Try to find in cache if in local mode
		if (this.config.dataSource === 'local' && useCache) {
			// Search through all cached databases for this page
			for (const [dbName] of Object.entries(this.config.databases)) {
				const cachedPages = await this.cache.getCachedPages(dbName);
				if (cachedPages) {
					const foundPage = cachedPages.find((p) => p.id === pageId);
					if (foundPage) {
						this.logger.log(`📦 Found page in cache (database: ${dbName})`);
						page = foundPage;
						break;
					}
				}
			}
			if (!page) {
				this.logger.log(`⚠️  Page ${pageId} not found in cache, falling back to live API`);
			}
		}

		// Fetch from live API if not cached
		if (!page) {
			this.logger.log(`🌐 Fetching page ${pageId} from live API`);
			page = (await this.client.pages.retrieve({ page_id: pageId })) as PageObjectResponse;
		}

		if (simplify) {
			let simplifiedPage = simplifyPage<T>(page, this.config.propertyNaming);

			// Process images if enabled
			if (processImages && this.config.images.enabled) {
				simplifiedPage = (await this.imageHandler.processPageImages(simplifiedPage)) as T;
			}

			if (includeContent) {
				await this.contentHandler.init();
				const content = await this.contentHandler.getPageContent(pageId, options?.useCache);
				if (content) {
					(simplifiedPage as any).content = content;
				}
			}

			return simplifiedPage;
		}

		return page as T;
	}

	/**
	 * Sync all databases and their pages to local cache
	 */
	async syncToCache(): Promise<void> {
		this.logger.log('🔄 Starting sync to local cache...\n');

		// Initialize cache directory and content handler
		await this.cache.init();
		await this.contentHandler.init();

		const metadata = {
			version: '1.0.0',
			lastSync: new Date().toISOString(),
			databases: {} as Record<string, any>,
		};

		// Sync each database
		for (const [name, databaseId] of Object.entries(this.config.databases)) {
			try {
				this.logger.log(`📊 Syncing database "${name}"...`);

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

				this.logger.log(`📝 Caching content for ${pages.length} pages...`);
				for (const page of pages) {
					const content = await this.contentHandler.getPageContent(page.id, false);
					if (content) {
						await this.contentHandler.cachePageContent(page.id, content);
					}
				}

				this.logger.log(`✅ Synced ${pages.length} pages from "${name}"`);

				// Process images if enabled
				if (this.config.images.enabled) {
					const simplifiedPages = simplifyPages(pages, this.config.propertyNaming);
					await this.imageHandler.processPages(simplifiedPages);
				}
			} catch (error: any) {
				this.logger.error(`❌ Failed to sync "${name}": ${error.message}`);
			}
		}

		// Save metadata
		await this.cache.setMetadata(metadata);
		this.logger.log('\n✨ Sync complete! Cache saved to:', this.config.outputDir);

		// Save image map
		if (this.config.images.enabled) {
			const imageMapPath = path.join(this.config.outputDir, 'image-map.json');
			await fs.promises.writeFile(imageMapPath, JSON.stringify(this.imageHandler.getImageMap(), null, 2));
			this.logger.log(`📸 Image map saved to: ${imageMapPath}`);
		}
	}
}
