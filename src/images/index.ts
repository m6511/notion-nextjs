import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { NotionNextJSRuntimeConfig } from '../types';
import { SimplifiedPage } from '../utils/property-extractor';

export interface ImageInfo {
	originalUrl: string;
	localPath: string;
	publicPath: string;
	format: string;
}

export class ImageHandler {
	private config: NotionNextJSRuntimeConfig;
	private imageDir: string;
	private processedImages: Map<string, ImageInfo> = new Map();

	constructor(config: NotionNextJSRuntimeConfig) {
		this.config = config;
		this.imageDir = path.join(process.cwd(), config.images.outputDir);
	}

	/**
	 * Initialize image directory
	 */
	async init(): Promise<void> {
		if (!this.config.images.enabled) return;

		await fs.promises.mkdir(this.imageDir, { recursive: true });
	}

	/**
	 * Download an image from URL
	 */
	private async downloadImage(url: string, outputPath: string): Promise<void> {
		const file = fs.createWriteStream(outputPath);

		return new Promise((resolve, reject) => {
			const protocol = url.startsWith('https') ? https : http;

			protocol
				.get(url, (response) => {
					if (response.statusCode !== 200) {
						reject(new Error(`Failed to download image: ${response.statusCode}`));
						return;
					}

					response.pipe(file);

					file.on('finish', () => {
						file.close();
						resolve();
					});
				})
				.on('error', (err) => {
					fs.unlink(outputPath, () => {}); // Delete partial file
					reject(err);
				});
		});
	}

	/**
	 * Generate a filename from URL
	 */
	private generateFilename(url: string, pageId?: string): string {
		// Extract original filename or generate one
		const urlParts = new URL(url);
		const pathParts = urlParts.pathname.split('/');
		let filename = pathParts[pathParts.length - 1];

		// If no good filename, create one
		if (!filename || filename.length < 3) {
			const hash = Buffer.from(url).toString('base64').substring(0, 8);
			filename = `image-${hash}`;
		}

		// Add page ID prefix if provided
		if (pageId) {
			filename = `${pageId}-${filename}`;
		}

		// Ensure proper extension
		const ext = path.extname(filename);
		if (!ext) {
			filename += '.jpg'; // Default extension
		}

		return filename;
	}

	/**
	 * Process a single image
	 */
	async processImage(
		url: string,
		options?: {
			pageId?: string;
			type?: 'cover' | 'icon' | 'content';
		}
	): Promise<ImageInfo | null> {
		if (!this.config.images.enabled || !url) return null;

		// Check if already processed
		if (this.processedImages.has(url)) {
			return this.processedImages.get(url)!;
		}

		try {
			const { pageId } = options || {};

			// Generate filename
			const filename = this.generateFilename(url, pageId);
			const localPath = path.join(this.imageDir, filename);
			let publicPath = this.config.images.outputDir + '/' + filename;

			// Ensure publicPath always starts with '/'
			if (!publicPath.startsWith('/')) {
				publicPath = '/' + publicPath;
			}

			// If the path starts with '/public', strip it
			if (publicPath.startsWith('/public/')) {
				publicPath = publicPath.replace(/^\/public/, '');
			}

			// Skip if already exists
			if (!fs.existsSync(localPath)) {
				console.log(`📥 Downloading image: ${filename}`);
				await this.downloadImage(url, localPath);

				// TODO: Add webp conversion here if format is 'webp'
				// For now, we'll just copy the original

				console.log(`✅ Downloaded: ${filename}`);
			} else {
				console.log(`⏭️  Image already exists: ${filename}`);
			}

			const imageInfo: ImageInfo = {
				originalUrl: url,
				localPath,
				publicPath,
				format: path.extname(filename).substring(1),
			};

			this.processedImages.set(url, imageInfo);
			return imageInfo;
		} catch (error) {
			console.error(`❌ Failed to process image ${url}:`, error);
			return null;
		}
	}

	/**
	 * Process all images in a page
	 */
	async processPageImages(page: SimplifiedPage): Promise<SimplifiedPage> {
		if (!this.config.images.enabled) return page;

		const processedPage = { ...page };

		// Process cover image
		if (page.coverUrl) {
			const imageInfo = await this.processImage(page.coverUrl, {
				pageId: page.id,
				type: 'cover',
			});
			if (imageInfo) {
				processedPage.coverUrl = imageInfo.publicPath;
			}
		}

		// Process icon if it's a URL
		if (page.iconUrl && page.iconUrl.startsWith('http')) {
			const imageInfo = await this.processImage(page.iconUrl, {
				pageId: page.id,
				type: 'icon',
			});
			if (imageInfo) {
				processedPage.iconUrl = imageInfo.publicPath;
			}
		}

		// Process images in file properties
		for (const [, propValue] of Object.entries(processedPage.simplifiedProperties)) {
			if (Array.isArray(propValue)) {
				for (let i = 0; i < propValue.length; i++) {
					const item = propValue[i];
					if (item && typeof item === 'object' && 'url' in item && item.url) {
						const imageInfo = await this.processImage(item.url, {
							pageId: page.id,
							type: 'content',
						});
						if (imageInfo) {
							propValue[i] = { ...item, url: imageInfo.publicPath };
						}
					}
				}
			}
		}

		return processedPage;
	}

	/**
	 * Process all images in multiple pages
	 */
	async processPages(pages: SimplifiedPage[]): Promise<SimplifiedPage[]> {
		if (!this.config.images.enabled) return pages;

		console.log(`\n🖼️  Processing images for ${pages.length} pages...`);
		await this.init();

		const processedPages = [];
		for (const page of pages) {
			const processed = await this.processPageImages(page);
			processedPages.push(processed);
		}

		console.log(`✅ Processed ${this.processedImages.size} unique images`);
		return processedPages;
	}

	/**
	 * Get image mapping for saving
	 */
	getImageMap(): Record<string, ImageInfo> {
		const map: Record<string, ImageInfo> = {};
		for (const [url, info] of this.processedImages.entries()) {
			map[url] = info;
		}
		return map;
	}
}
