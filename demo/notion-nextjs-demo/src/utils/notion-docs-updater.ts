import { Client } from '@notionhq/client';

// Simple logger implementation for the demo app
class Logger {
	private verbose: boolean;

	constructor(verbose: boolean = true) {
		this.verbose = verbose;
	}

	log(...args: any[]): void {
		if (this.verbose) {
			console.log(...args);
		}
	}

	warn(...args: any[]): void {
		if (this.verbose) {
			console.warn(...args);
		}
	}

	error(...args: any[]): void {
		console.error(...args);
	}
}

/**
 * Multi-purpose Notion documentation updater
 * Supports flexible content updates for any documentation page
 */
export interface NotionDocsUpdater {
	// Core methods for any documentation update
	addSection(pageId: string, section: NotionSection): Promise<void>;
	addSectionToPage(pageKey: string, section: NotionSection): Promise<void>;
	updatePage(pageKey: string, updates: DocumentationUpdate[]): Promise<void>;
	
	// Utility methods
	getPageId(pageKey: string): string | undefined;
	listAvailablePages(): string[];
}

/**
 * Generic documentation update structure
 * Can be used for any type of feature documentation
 */
export interface DocumentationUpdate {
	title: string;
	description: string;
	type: 'feature' | 'configuration' | 'api' | 'guide' | 'example';
	content: {
		overview?: string;
		benefits?: string[];
		usage?: DocumentationUsage;
		configuration?: DocumentationConfig;
		examples?: DocumentationExample[];
		notes?: string[];
		relatedPages?: string[];
	};
}

export interface DocumentationUsage {
	description: string;
	steps?: string[];
	codeExample?: string;
	language?: string;
}

export interface DocumentationConfig {
	options: ConfigurationOption[];
	example: string;
	language?: string;
}

export interface ConfigurationOption {
	name: string;
	type: string;
	description: string;
	defaultValue?: string;
	required?: boolean;
	possibleValues?: string[];
}

export interface DocumentationExample {
	title: string;
	description?: string;
	code: string;
	language?: string;
}

export interface NotionSection {
	title: string;
	content: NotionBlock[];
}

export interface NotionBlock {
	type: 'paragraph' | 'heading_2' | 'heading_3' | 'code' | 'bulleted_list_item' | 'numbered_list_item' | 'callout';
	content: string;
	language?: string; // for code blocks
	emoji?: string; // for callouts
}

export class NotionDocsUpdaterImpl implements NotionDocsUpdater {
	private client: Client;
	private logger: Logger;

	// Comprehensive page mapping with logical keys
	private readonly pageIds = {
		// Getting Started Section
		'installation': '20d58a32-45d4-8067-853b-d8934aacf73e',
		'notion-setup': '20e58a32-45d4-8097-807b-d4065ca5e0f8',
		'quick-start': '20d58a32-45d4-800e-a77e-dd5269ea7109',
		'configuration': '20d58a32-45d4-80fe-aabc-d6790471e10b',
		'examples': '20d58a32-45d4-800d-8d56-da3d87f3aff8',
		'markdown-kitchen-sink': '20e58a32-45d4-800a-9e0e-e6f50c8e9322',

		// Core Concepts Section
		'property-naming': '20e58a32-45d4-80a1-9f0b-ceae830ab88b',
		'simplified-vs-raw': '20e58a32-45d4-80a3-8c1c-cea9497765dc',
		'type-generation': '20d58a32-45d4-8045-bdf6-e9da222ed473',
		'local-caching': '20d58a32-45d4-8051-b69a-ce2281bdceb6',
		'auto-sync': '20d58a32-45d4-80c3-9a19-f283ff9e6c2f',
		'image-optimization': '20d58a32-45d4-8046-b29d-e3fe2ec3388f',
		'data-source-modes': '20e58a32-45d4-8094-b6e2-d02b3107bb2d',

		// API Reference Section
		'notion-nextjs-class': '20d58a32-45d4-8082-b250-ff58fe040259',
		'utility-functions': '20e58a32-45d4-80d5-bbf4-f69fb21d6634',
		'cli-commands': '20d58a32-45d4-8097-a028-ece7c0f40a44',
		'configuration-options': '20d58a32-45d4-80bb-8514-f052d0845179',
		'typescript-types': '20d58a32-45d4-8086-b305-ebac1e240605',
	};

	constructor(apiKey: string, verbose: boolean = true) {
		this.client = new Client({ auth: apiKey });
		this.logger = new Logger(verbose);
	}

	async updatePage(pageKey: string, updates: DocumentationUpdate[]): Promise<void> {
		const pageId = this.getPageId(pageKey);
		if (!pageId) {
			throw new Error(`Page key "${pageKey}" not found. Available pages: ${this.listAvailablePages().join(', ')}`);
		}

		this.logger.log(`📝 Updating page "${pageKey}" with ${updates.length} update(s)...`);

		for (const update of updates) {
			const section = this.convertUpdateToSection(update);
			await this.addSection(pageId, section);
		}
	}

	async addSectionToPage(pageKey: string, section: NotionSection): Promise<void> {
		const pageId = this.getPageId(pageKey);
		if (!pageId) {
			throw new Error(`Page key "${pageKey}" not found. Available pages: ${this.listAvailablePages().join(', ')}`);
		}

		await this.addSection(pageId, section);
	}

	getPageId(pageKey: string): string | undefined {
		return this.pageIds[pageKey as keyof typeof this.pageIds];
	}

	listAvailablePages(): string[] {
		return Object.keys(this.pageIds);
	}

	/**
	 * Convert a generic DocumentationUpdate to a NotionSection
	 */
	private convertUpdateToSection(update: DocumentationUpdate): NotionSection {
		const content: NotionBlock[] = [];

		// Add main description
		if (update.description) {
			content.push({
				type: 'paragraph',
				content: update.description
			});
		}

		// Add overview if provided
		if (update.content.overview) {
			content.push({
				type: 'heading_3',
				content: 'Overview'
			});
			content.push({
				type: 'paragraph',
				content: update.content.overview
			});
		}

		// Add benefits
		if (update.content.benefits && update.content.benefits.length > 0) {
			content.push({
				type: 'heading_3',
				content: 'Benefits'
			});
			update.content.benefits.forEach(benefit => {
				content.push({
					type: 'bulleted_list_item',
					content: benefit
				});
			});
		}

		// Add usage section
		if (update.content.usage) {
			content.push({
				type: 'heading_3',
				content: 'Usage'
			});
			content.push({
				type: 'paragraph',
				content: update.content.usage.description
			});

			if (update.content.usage.steps) {
				update.content.usage.steps.forEach((step, index) => {
					content.push({
						type: 'numbered_list_item',
						content: step
					});
				});
			}

			if (update.content.usage.codeExample) {
				content.push({
					type: 'code',
					content: update.content.usage.codeExample,
					language: update.content.usage.language || 'javascript'
				});
			}
		}

		// Add configuration section
		if (update.content.configuration) {
			content.push({
				type: 'heading_3',
				content: 'Configuration'
			});

			// Add configuration options
			if (update.content.configuration.options.length > 0) {
				update.content.configuration.options.forEach(option => {
					content.push({
						type: 'paragraph',
						content: `**\`${option.name}\`** (${option.type})${option.required ? ' *required*' : ''}`
					});
					content.push({
						type: 'paragraph',
						content: option.description
					});
					if (option.defaultValue) {
						content.push({
							type: 'paragraph',
							content: `*Default:* \`${option.defaultValue}\``
						});
					}
					if (option.possibleValues) {
						content.push({
							type: 'paragraph',
							content: `*Possible values:* ${option.possibleValues.map(v => `\`${v}\``).join(', ')}`
						});
					}
				});
			}

			// Add configuration example
			content.push({
				type: 'code',
				content: update.content.configuration.example,
				language: update.content.configuration.language || 'javascript'
			});
		}

		// Add examples
		if (update.content.examples && update.content.examples.length > 0) {
			content.push({
				type: 'heading_3',
				content: 'Examples'
			});

			update.content.examples.forEach(example => {
				if (example.title) {
					content.push({
						type: 'paragraph',
						content: `**${example.title}**`
					});
				}
				if (example.description) {
					content.push({
						type: 'paragraph',
						content: example.description
					});
				}
				content.push({
					type: 'code',
					content: example.code,
					language: example.language || 'javascript'
				});
			});
		}

		// Add notes
		if (update.content.notes && update.content.notes.length > 0) {
			content.push({
				type: 'callout',
				content: update.content.notes.join('\n\n'),
				emoji: '💡'
			});
		}

		// Add related pages
		if (update.content.relatedPages && update.content.relatedPages.length > 0) {
			content.push({
				type: 'heading_3',
				content: 'Related Pages'
			});
			update.content.relatedPages.forEach(page => {
				content.push({
					type: 'bulleted_list_item',
					content: page
				});
			});
		}

		return {
			title: update.title,
			content
		};
	}

	async addSection(pageId: string, section: NotionSection): Promise<void> {
		try {
			// Add section heading
			const blocks = [
				{
					object: 'block' as const,
					type: 'heading_2' as const,
					heading_2: {
						rich_text: [{
							type: 'text' as const,
							text: { content: section.title }
						}]
					}
				}
			];

			// Convert section content to Notion blocks
			for (const block of section.content) {
				blocks.push(this.convertToNotionBlock(block));
			}

			// Append blocks to the page
			await this.client.blocks.children.append({
				block_id: pageId,
				children: blocks
			});

			this.logger.log(`✅ Added section "${section.title}" to page ${pageId}`);
		} catch (error) {
			this.logger.error(`❌ Failed to add section "${section.title}": ${error}`);
			throw error;
		}
	}

	async updateSection(pageId: string, sectionTitle: string, newContent: NotionBlock[]): Promise<void> {
		// This would require finding and replacing existing content - more complex implementation
		// For now, we'll use addSection for new content
		this.logger.warn(`⚠️  updateSection not yet implemented, using addSection instead`);
		await this.addSection(pageId, { title: sectionTitle, content: newContent });
	}

	private convertToNotionBlock(block: NotionBlock): any {
		switch (block.type) {
			case 'paragraph':
				return {
					object: 'block',
					type: 'paragraph',
					paragraph: {
						rich_text: this.parseRichText(block.content)
					}
				};

			case 'heading_2':
				return {
					object: 'block',
					type: 'heading_2',
					heading_2: {
						rich_text: [{
							type: 'text',
							text: { content: block.content }
						}]
					}
				};

			case 'heading_3':
				return {
					object: 'block',
					type: 'heading_3',
					heading_3: {
						rich_text: [{
							type: 'text',
							text: { content: block.content }
						}]
					}
				};

			case 'code':
				return {
					object: 'block',
					type: 'code',
					code: {
						language: block.language || 'plain text',
						rich_text: [{
							type: 'text',
							text: { content: block.content }
						}]
					}
				};

			case 'bulleted_list_item':
				return {
					object: 'block',
					type: 'bulleted_list_item',
					bulleted_list_item: {
						rich_text: this.parseRichText(block.content)
					}
				};

			case 'numbered_list_item':
				return {
					object: 'block',
					type: 'numbered_list_item',
					numbered_list_item: {
						rich_text: this.parseRichText(block.content)
					}
				};

			case 'callout':
				return {
					object: 'block',
					type: 'callout',
					callout: {
						icon: block.emoji ? { type: 'emoji', emoji: block.emoji } : undefined,
						rich_text: this.parseRichText(block.content)
					}
				};

			default:
				throw new Error(`Unsupported block type: ${block.type}`);
		}
	}

	private parseRichText(text: string): any[] {
		// Simple rich text parser for **bold** and `code` formatting
		const richText: any[] = [];
		const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);

		for (const part of parts) {
			if (part.startsWith('**') && part.endsWith('**')) {
				// Bold text
				richText.push({
					type: 'text',
					text: { content: part.slice(2, -2) },
					annotations: { bold: true }
				});
			} else if (part.startsWith('`') && part.endsWith('`')) {
				// Code text
				richText.push({
					type: 'text',
					text: { content: part.slice(1, -1) },
					annotations: { code: true }
				});
			} else if (part.trim()) {
				// Regular text
				richText.push({
					type: 'text',
					text: { content: part }
				});
			}
		}

		return richText.length > 0 ? richText : [{
			type: 'text',
			text: { content: text }
		}];
	}
}