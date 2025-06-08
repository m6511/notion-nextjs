import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type PropertyValue = any;
type ExtractedProperties = Record<string, PropertyValue>;

/**
 * Extract simple values from Notion's complex property structure
 */
export function extractPropertyValue(property: any): PropertyValue {
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

		default:
			return null;
	}
}

function extractFormulaValue(formula: any): PropertyValue {
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

function extractRollupValue(rollup: any): PropertyValue {
	if (!rollup) return null;

	switch (rollup.type) {
		case 'number':
			return rollup.number;
		case 'date':
			return rollup.date?.start || null;
		case 'array':
			return rollup.array;
		default:
			return null;
	}
}

/**
 * Simplify a Notion page object by extracting property values
 */
export function simplifyPage<T = any>(page: PageObjectResponse): T {
	const properties: ExtractedProperties = {};

	// Extract all properties
	for (const [key, value] of Object.entries(page.properties)) {
		properties[key] = extractPropertyValue(value);
	}

	// Return simplified page object
	return {
		id: page.id,
		created_time: page.created_time,
		last_edited_time: page.last_edited_time,
		created_by: page.created_by,
		last_edited_by: page.last_edited_by,
		cover: page.cover,
		icon: page.icon,
		parent: page.parent,
		archived: page.archived,
		url: page.url,
		public_url: page.public_url,
		properties,
	} as T;
}

/**
 * Simplify multiple pages
 */
export function simplifyPages<T = any>(pages: PageObjectResponse[]): T[] {
	return pages.map((page) => simplifyPage<T>(page));
}
