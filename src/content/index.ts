import { NotionToMarkdown } from 'notion-to-md';
import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';
import { NotionNextJSRuntimeConfig } from '../types';
import { Logger } from '../utils/logger';

export class ContentHandler {
	private n2m: NotionToMarkdown;
	private config: NotionNextJSRuntimeConfig;
	private contentDir: string;
	private logger: Logger;

	constructor(client: Client, config: NotionNextJSRuntimeConfig, logger: Logger) {
		this.n2m = new NotionToMarkdown({ notionClient: client });
		this.config = config;
		this.logger = logger;
		this.contentDir = path.join(process.cwd(), config.outputDir, 'content');
	}

	async init(): Promise<void> {
		await fs.promises.mkdir(this.contentDir, { recursive: true });
	}

	async getPageContent(pageId: string, useCache = true): Promise<string | null> {
		const cacheFile = path.join(this.contentDir, `${pageId}.md`);

		// Try cache first if local mode
		if (this.config.dataSource === 'local' && useCache && fs.existsSync(cacheFile)) {
			return fs.promises.readFile(cacheFile, 'utf-8');
		}

		try {
			// Fetch from Notion API
			const mdblocks = await this.n2m.pageToMarkdown(pageId);
			const markdown = this.n2m.toMarkdownString(mdblocks);
			return markdown.parent;
		} catch (error) {
			this.logger.error(`Failed to get content for page ${pageId}:`, error);
			return null;
		}
	}

	async cachePageContent(pageId: string, content: string): Promise<void> {
		const cacheFile = path.join(this.contentDir, `${pageId}.md`);
		await fs.promises.writeFile(cacheFile, content);
	}
}
