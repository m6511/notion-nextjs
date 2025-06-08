import { Client } from '@notionhq/client';
import { NotionNextJSConfig, NotionNextJSRuntimeConfig } from '../types';
import { mergeConfig, validateConfig } from '../config';

export class NotionNextJS {
	private client: Client;
	private config: NotionNextJSRuntimeConfig;

	constructor(auth: string, config: NotionNextJSConfig) {
		validateConfig(config);
		this.config = mergeConfig(config);
		this.client = new Client({ auth });
	}

	// Get the underlying Notion client for direct access
	getNotionClient(): Client {
		return this.client;
	}

	// Get configuration
	getConfig(): NotionNextJSRuntimeConfig {
		return this.config;
	}

	// Get database ID by name
	getDatabaseId(name: string): string {
		const id = this.config.databases[name];
		if (!id) {
			throw new Error(`Database "${name}" not found in configuration`);
		}
		return id;
	}

	// Get all pages from a database
	async getAllPages<T = any>(databaseName: string) {
		const databaseId = this.getDatabaseId(databaseName);

		if (this.config.dataSource === 'local') {
			// TODO: Implement local cache reading
			console.log('Local data source not yet implemented, falling back to live');
		}

		// For now, always use live data
		const response = await this.client.databases.query({
			database_id: databaseId,
		});

		return response.results as T[];
	}

	// Get a single page by ID
	async getPage<T = any>(pageId: string) {
		if (this.config.dataSource === 'local') {
			// TODO: Implement local cache reading
			console.log('Local data source not yet implemented, falling back to live');
		}

		const response = await this.client.pages.retrieve({ page_id: pageId });
		return response as T;
	}
}
