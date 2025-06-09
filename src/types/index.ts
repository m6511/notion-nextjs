// Configuration types
export interface NotionNextJSConfig {
	databases: Record<string, string>;
	dataSource?: 'local' | 'live';
	outputDir?: string;
	images?: {
		enabled?: boolean;
		outputDir?: string;
		format?: 'webp' | 'original';
		quality?: number;
	};
}

// Runtime configuration with defaults applied
export interface NotionNextJSRuntimeConfig extends Required<NotionNextJSConfig> {
	dataSource: 'local' | 'live';
	outputDir: string;
	images: {
		enabled: boolean;
		outputDir: string;
		format: 'webp' | 'original';
		quality: number;
	};
}

// Extended client options
export interface NotionNextJSClientOptions {
	auth: string;
	config: NotionNextJSConfig;
}
