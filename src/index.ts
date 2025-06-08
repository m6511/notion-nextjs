// Main exports
export { NotionNextJS } from './client';
export * from './types';
export { DEFAULT_CONFIG } from './config';
export { simplifyPage, simplifyPages } from './utils/property-extractor';
export { generateTypeFromDatabase, generateTypesFile } from './types/type-generator';

// Version info
export const VERSION = '0.1.0';
