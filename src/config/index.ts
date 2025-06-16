import { NotionNextJSConfig, NotionNextJSRuntimeConfig } from '../types';

// Default configuration
export const DEFAULT_CONFIG: NotionNextJSRuntimeConfig = {
	databases: {},
	dataSource: 'local',
	outputDir: '.notion-cache',
	propertyNaming: 'camelCase',
	typesPath: 'types/notion.ts',
	verbose: true,
	images: {
		enabled: true,
		outputDir: '/public/images/notion',
		format: 'webp',
		quality: 85,
	},
};

// Merge user config with defaults
export function mergeConfig(userConfig: NotionNextJSConfig): NotionNextJSRuntimeConfig {
	return {
		...DEFAULT_CONFIG,
		...userConfig,
		images: {
			...DEFAULT_CONFIG.images,
			...userConfig.images,
		},
	};
}

// Validate configuration
export function validateConfig(config: NotionNextJSConfig): void {
	if (!config.databases || Object.keys(config.databases).length === 0) {
		throw new Error('At least one database must be configured');
	}

	if (config.images?.quality && (config.images.quality < 1 || config.images.quality > 100)) {
		throw new Error('Image quality must be between 1 and 100');
	}
}
