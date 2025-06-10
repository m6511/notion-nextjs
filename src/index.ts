// Main exports
export * from './types';
export { NotionNextJS } from './client';
export { DEFAULT_CONFIG } from './config';
export { CacheManager } from './cache';
export { ImageHandler } from './images';
export { ContentHandler } from './content';
export { simplifyPage, simplifyPages, type SimplifiedPage } from './utils/property-extractor';
export { generateTypeFromDatabase, generateTypesFile } from './types/type-generator';
export { transformPropertyName, type PropertyNamingConvention } from './utils/property-transformer';

// Version info
import { version } from '../package.json';
export const VERSION = version;
