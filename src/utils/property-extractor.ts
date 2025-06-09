import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { PropertyNamingConvention, createPropertyMapping } from './property-transformer';

export interface SimplifiedPage extends PageObjectResponse {
	// Convenience properties
	title: string | null;
	coverUrl: string | null;
	iconUrl: string | null;
	simplifiedProperties: Record<string, any>;
}

/**
 * Extract simple value from any Notion property
 */
export function extractPropertyValue(property: any): any {
	if (!property) return null;

	switch (property.type) {
		case 'title':
			return property.title.map((text: any) => text.plain_text).join('');

		case 'rich_text':
			return property.rich_text.map((text: any) => text.plain_text).join('');

		case 'number':
			return property.number;

		case 'select':
			return property.select?.name || null;

		case 'multi_select':
			return property.multi_select.map((item: any) => item.name);

		case 'date':
			return property.date?.start || null;

		case 'checkbox':
			return property.checkbox;

		case 'url':
			return property.url;

		case 'email':
			return property.email;

		case 'phone_number':
			return property.phone_number;

		case 'files':
			return property.files.map((file: any) => ({
				name: file.name,
				url: file.file?.url || file.external?.url,
				type: file.type,
			}));

		case 'formula':
			return extractFormulaValue(property.formula);

		case 'rollup':
			return extractRollupValue(property.rollup);

		case 'people':
			return property.people.map((person: any) => ({
				id: person.id,
				name: person.name,
				avatarUrl: person.avatar_url,
				email: person.person?.email,
			}));

		case 'relation':
			return property.relation.map((rel: any) => rel.id);

		case 'created_time':
			return property.created_time;

		case 'created_by':
			return {
				id: property.created_by.id,
				name: property.created_by.name,
				avatarUrl: property.created_by.avatar_url,
			};

		case 'last_edited_time':
			return property.last_edited_time;

		case 'last_edited_by':
			return {
				id: property.last_edited_by.id,
				name: property.last_edited_by.name,
				avatarUrl: property.last_edited_by.avatar_url,
			};

		case 'status':
			return property.status?.name || null;

		case 'unique_id':
			return property.unique_id.number;

		case 'button':
			return null; // Buttons don't have values

		case 'verification':
			return property.verification;

		default:
			return null;
	}
}

function extractFormulaValue(formula: any): any {
	if (!formula) return null;

	switch (formula.type) {
		case 'string':
			return formula.string;
		case 'number':
			return formula.number;
		case 'boolean':
			return formula.boolean;
		case 'date':
			return formula.date?.start || null;
		default:
			return null;
	}
}

function extractRollupValue(rollup: any): any {
	if (!rollup) return null;

	switch (rollup.type) {
		case 'number':
			return rollup.number;
		case 'date':
			return rollup.date?.start || null;
		case 'array':
			return rollup.array.map((item: any) => extractPropertyValue(item));
		default:
			return null;
	}
}

/**
 * Extract cover URL from Notion cover object
 */
function extractCoverUrl(cover: any): string | null {
	if (!cover) return null;

	if (cover.type === 'external') {
		return cover.external?.url || null;
	} else if (cover.type === 'file') {
		return cover.file?.url || null;
	}

	return null;
}

/**
 * Extract icon URL or emoji from Notion icon object
 */
function extractIconUrl(icon: any): string | null {
	if (!icon) return null;

	switch (icon.type) {
		case 'emoji':
			return icon.emoji;
		case 'external':
			return icon.external?.url || null;
		case 'file':
			return icon.file?.url || null;
		case 'custom_emoji':
			return icon.custom_emoji?.url || null;
		default:
			return null;
	}
}

/**
 * Find and extract title from page properties
 */
function findTitle(properties: Record<string, any>): string | null {
	for (const [, prop] of Object.entries(properties)) {
		if (prop.type === 'title' && prop.title?.length > 0) {
			return prop.title.map((text: any) => text.plain_text).join('');
		}
	}

	return null;
}

/**
 * Add convenience properties to a Notion page
 */
export function simplifyPage<T extends SimplifiedPage = SimplifiedPage>(
	page: PageObjectResponse,
	propertyNaming: PropertyNamingConvention = 'camelCase'
): T {
	const simplifiedProperties: Record<string, any> = {};

	// Create property name mapping
	const originalNames = Object.keys(page.properties);
	const nameMapping = createPropertyMapping(originalNames, propertyNaming);

	// Extract all properties to simplified form with transformed names
	for (const [key, value] of Object.entries(page.properties)) {
		const transformedKey = nameMapping[key];
		simplifiedProperties[transformedKey] = extractPropertyValue(value);
	}

	// Create the extended page object
	const simplified = {
		...page, // Keep all original properties
		// Add convenience properties
		title: findTitle(page.properties),
		coverUrl: extractCoverUrl(page.cover),
		iconUrl: extractIconUrl(page.icon),
		simplifiedProperties,
	} as T;

	return simplified;
}

/**
 * Simplify multiple pages
 */
export function simplifyPages<T extends SimplifiedPage = SimplifiedPage>(
	pages: PageObjectResponse[],
	propertyNaming: PropertyNamingConvention = 'camelCase'
): T[] {
	return pages.map((page) => simplifyPage<T>(page, propertyNaming));
}
