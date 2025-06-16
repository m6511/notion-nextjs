import * as fs from 'fs';
import * as path from 'path';
import { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionNextJSRuntimeConfig } from '../types';
import { Logger } from '../utils/logger';

export interface CacheMetadata {
	version: string;
	lastSync: string;
	databases: Record<
		string,
		{
			id: string;
			name: string;
			lastSync: string;
		}
	>;
}

export class CacheManager {
	private cacheDir: string;
	private metadataPath: string;
	private logger: Logger;

	constructor(config: NotionNextJSRuntimeConfig, logger?: Logger) {
		this.cacheDir = path.resolve(process.cwd(), config.outputDir);
		this.metadataPath = path.join(this.cacheDir, 'metadata.json');
		this.logger = logger || new Logger(true);
	}

	/**
	 * Initialize cache directory structure
	 */
	async init(): Promise<void> {
		// Create cache directory if it doesn't exist
		await fs.promises.mkdir(this.cacheDir, { recursive: true });

		// Create subdirectories
		const subdirs = ['databases', 'pages'];
		for (const dir of subdirs) {
			await fs.promises.mkdir(path.join(this.cacheDir, dir), { recursive: true });
		}
	}

	/**
	 * Read cache metadata
	 */
	async getMetadata(): Promise<CacheMetadata | null> {
		try {
			const data = await fs.promises.readFile(this.metadataPath, 'utf-8');
			return JSON.parse(data);
		} catch {
			return null;
		}
	}

	/**
	 * Write cache metadata
	 */
	async setMetadata(metadata: CacheMetadata): Promise<void> {
		await fs.promises.writeFile(this.metadataPath, JSON.stringify(metadata, null, 2));
	}

	/**
	 * Cache database schema
	 */
	async cacheDatabase(name: string, database: DatabaseObjectResponse): Promise<void> {
		const dbPath = path.join(this.cacheDir, 'databases', `${name}.json`);
		await fs.promises.writeFile(dbPath, JSON.stringify(database, null, 2));
	}

	/**
	 * Get cached database schema
	 */
	async getCachedDatabase(name: string): Promise<DatabaseObjectResponse | null> {
		try {
			const dbPath = path.join(this.cacheDir, 'databases', `${name}.json`);
			const data = await fs.promises.readFile(dbPath, 'utf-8');
			return JSON.parse(data);
		} catch {
			return null;
		}
	}

	/**
	 * Cache pages for a database
	 */
	async cachePages(databaseName: string, pages: PageObjectResponse[]): Promise<void> {
		const pagesPath = path.join(this.cacheDir, 'pages', `${databaseName}.json`);
		await fs.promises.writeFile(pagesPath, JSON.stringify(pages, null, 2));
	}

	/**
	 * Get cached pages for a database
	 */
	async getCachedPages(databaseName: string): Promise<PageObjectResponse[] | null> {
		try {
			const pagesPath = path.join(this.cacheDir, 'pages', `${databaseName}.json`);
			const data = await fs.promises.readFile(pagesPath, 'utf-8');
			return JSON.parse(data);
		} catch {
			return null;
		}
	}

	/**
	 * Check if cache exists
	 */
	async exists(): Promise<boolean> {
		try {
			await fs.promises.access(this.metadataPath);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Clear all cache
	 */
	async clear(): Promise<void> {
		try {
			await fs.promises.rm(this.cacheDir, { recursive: true, force: true });
		} catch (error) {
			this.logger.error('Failed to clear cache:', error);
		}
	}

	/**
	 * Extract database title from Notion database object
	 */
	static extractDatabaseTitle(database: any): string {
		// The database title is in the title array, similar to rich text
		if (database.title && Array.isArray(database.title) && database.title.length > 0) {
			return database.title.map((text: any) => text.plain_text).join('');
		}
		return 'Untitled Database';
	}
}
