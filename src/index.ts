// Main exports
export { NotionNextJS } from './client';
export * from './types';
export { DEFAULT_CONFIG } from './config';
export { simplifyPage, simplifyPages, type SimplifiedPage } from './utils/property-extractor';
export { generateTypeFromDatabase, generateTypesFile } from './types/type-generator';
export { CacheManager } from './cache';
export { ImageHandler } from './images';
export { transformPropertyName, type PropertyNamingConvention } from './utils/property-transformer';

// Version info
export const VERSION = '0.4.0';
