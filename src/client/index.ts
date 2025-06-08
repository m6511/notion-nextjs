import { Client } from '@notionhq/client';
import { NotionNextJSConfig, NotionNextJSRuntimeConfig } from '../types';
import { mergeConfig, validateConfig } from '../config';
import { SimplifiedPage, simplifyPage, simplifyPages } from '../utils/property-extractor';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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

	// Get all pages from a database with simplified properties
	async getAllPages<T extends SimplifiedPage = any>(
		databaseName: string,
		options?: {
			filter?: any;
			sorts?: any;
			simplify?: boolean;
		}
	) {
		const databaseId = this.getDatabaseId(databaseName);
		const { filter, sorts, simplify = true } = options || {};

		if (this.config.dataSource === 'local') {
			// TODO: Implement local cache reading
			console.log('Local data source not yet implemented, falling back to live');
		}

		// For now, always use live data
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
	async getPage<T extends SimplifiedPage = any>(pageId: string, options?: { simplify?: boolean }) {
		const { simplify = true } = options || {};

		if (this.config.dataSource === 'local') {
			// TODO: Implement local cache reading
			console.log('Local data source not yet implemented, falling back to live');
		}

		const response = (await this.client.pages.retrieve({ page_id: pageId })) as PageObjectResponse;

		if (simplify) {
			return simplifyPage<T>(response);
		}

		return response as T;
	}
}
