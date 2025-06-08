// Main exports
export { NotionNextJS } from './client';
export * from './types';
export { DEFAULT_CONFIG } from './config';
export { simplifyPage, simplifyPages, type SimplifiedPage } from './utils/property-extractor';
export { generateTypeFromDatabase, generateTypesFile } from './types/type-generator';
export { CacheManager } from './cache';
export { ImageHandler } from './images';

// Version info
export const VERSION = '0.1.0';
