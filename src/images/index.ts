import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import sharp from 'sharp';
import { NotionNextJSRuntimeConfig } from '../types';
import { SimplifiedPage } from '../utils/property-extractor';
import { Logger } from '../utils/logger';

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
	private logger: Logger;

	constructor(config: NotionNextJSRuntimeConfig, logger: Logger) {
		this.config = config;
		this.logger = logger;
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

		// Handle extension based on format setting
		if (this.config.images.format === 'webp') {
			// Remove existing extension and add .webp
			const nameWithoutExt = path.parse(filename).name;
			filename = `${nameWithoutExt}.webp`;
		} else {
			// Ensure proper extension for original format
			const ext = path.extname(filename);
			if (!ext) {
				filename += '.jpg'; // Default extension
			}
		}

		return filename;
	}

	/**
	 * Convert image to webp format
	 */
	private async convertToWebp(inputPath: string, outputPath: string): Promise<void> {
		try {
			await sharp(inputPath)
				.webp({ quality: this.config.images.quality })
				.toFile(outputPath);
			
			// Remove the original file after successful conversion
			await fs.promises.unlink(inputPath);
		} catch (error) {
			this.logger.error(`Failed to convert image to webp: ${error}`);
			// If conversion fails, keep the original file
			throw error;
		}
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
			let filename = this.generateFilename(url, pageId);
			let localPath = path.join(this.imageDir, filename);
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
				if (this.config.images.format === 'webp') {
					// For webp conversion, download to temporary file first
					const tempPath = localPath.replace('.webp', '.tmp');
					this.logger.log(`📥 Downloading image for webp conversion: ${filename}`);
					await this.downloadImage(url, tempPath);
					
					try {
						this.logger.log(`🔄 Converting to webp: ${filename}`);
						await this.convertToWebp(tempPath, localPath);
						this.logger.log(`✅ Converted to webp: ${filename}`);
					} catch (conversionError) {
						// If webp conversion fails, keep original image with original extension
						this.logger.warn(`⚠️  Webp conversion failed for ${filename}, keeping original format`);
						const originalFilename = filename.replace('.webp', path.extname(new URL(url).pathname) || '.jpg');
						const originalPath = path.join(this.imageDir, originalFilename);
						
						// Move temp file to original format path
						await fs.promises.rename(tempPath, originalPath);
						
						// Update paths to reflect original format
						localPath = originalPath;
						publicPath = this.config.images.outputDir + '/' + originalFilename;
						if (!publicPath.startsWith('/')) {
							publicPath = '/' + publicPath;
						}
						if (publicPath.startsWith('/public/')) {
							publicPath = publicPath.replace(/^\/public/, '');
						}
						filename = originalFilename;
					}
				} else {
					// Original format - download directly
					this.logger.log(`📥 Downloading image: ${filename}`);
					await this.downloadImage(url, localPath);
					this.logger.log(`✅ Downloaded: ${filename}`);
				}
			} else {
				this.logger.log(`⏭️  Image already exists: ${filename}`);
			}

			const imageInfo: ImageInfo = {
				originalUrl: url,
				localPath,
				publicPath,
				format: path.extname(filename).substring(1) || 'jpg',
			};

			this.processedImages.set(url, imageInfo);
			return imageInfo;
		} catch (error) {
			this.logger.error(`❌ Failed to process image ${url}:`, error);
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

		// Process icon if it's a URL and icon downloading is enabled
		if (page.iconUrl && page.iconUrl.startsWith('http') && !this.config.images.disableIconDownload) {
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

		this.logger.log(`\n🖼️  Processing images for ${pages.length} pages...`);
		await this.init();

		const processedPages = [];
		for (const page of pages) {
			const processed = await this.processPageImages(page);
			processedPages.push(processed);
		}

		this.logger.log(`✅ Processed ${this.processedImages.size} unique images`);
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
