/**
 * Property naming conventions
 */
export type PropertyNamingConvention = 'camelCase' | 'snake_case' | 'PascalCase' | 'none';

/**
 * Transform a property name according to the specified convention
 */
export function transformPropertyName(name: string, convention: PropertyNamingConvention = 'camelCase'): string {
	if (convention === 'none') {
		return name;
	}

	// Clean the name first
	let cleaned = name
		.trim()
		.replace(/[^\w\s]/g, '')
		.replace(/\s+/g, ' ');

	// Handle empty result
	if (!cleaned) {
		return '_property';
	}

	// Transform based on convention
	switch (convention) {
		case 'camelCase':
			return toCamelCase(cleaned);
		case 'snake_case':
			return toSnakeCase(cleaned);
		case 'PascalCase':
			return toPascalCase(cleaned);
		default:
			return cleaned;
	}
}

/**
 * Convert to camelCase
 */
function toCamelCase(str: string): string {
	const words = str.split(' ').filter(Boolean);
	if (words.length === 0) return '';

	return words
		.map((word, index) => {
			word = word.toLowerCase();
			if (index === 0) {
				return word;
			}
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join('');
}

/**
 * Convert to snake_case
 */
function toSnakeCase(str: string): string {
	return str
		.split(' ')
		.filter(Boolean)
		.map((word) => word.toLowerCase())
		.join('_');
}

/**
 * Convert to PascalCase
 */
function toPascalCase(str: string): string {
	return str
		.split(' ')
		.filter(Boolean)
		.map((word) => {
			word = word.toLowerCase();
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join('');
}

/**
 * Ensure the property name is a valid JavaScript identifier
 */
export function ensureValidIdentifier(name: string): string {
	// If it starts with a number, prefix with underscore
	if (/^\d/.test(name)) {
		name = '_' + name;
	}

	// Check if it's a reserved word
	const reserved = [
		'break',
		'case',
		'catch',
		'class',
		'const',
		'continue',
		'debugger',
		'default',
		'delete',
		'do',
		'else',
		'export',
		'extends',
		'finally',
		'for',
		'function',
		'if',
		'import',
		'in',
		'instanceof',
		'new',
		'return',
		'super',
		'switch',
		'this',
		'throw',
		'try',
		'typeof',
		'var',
		'void',
		'while',
		'with',
		'yield',
		'let',
		'static',
		'enum',
		'await',
		'implements',
		'interface',
		'package',
		'private',
		'protected',
		'public',
		'null',
		'true',
		'false',
	];

	if (reserved.includes(name)) {
		return '_' + name;
	}

	return name;
}

/**
 * Create a mapping of original to transformed property names
 */
export function createPropertyMapping(
	properties: string[],
	convention: PropertyNamingConvention
): Record<string, string> {
	const mapping: Record<string, string> = {};
	const usedNames = new Set<string>();

	for (const original of properties) {
		let transformed = transformPropertyName(original, convention);
		transformed = ensureValidIdentifier(transformed);

		// Handle duplicates by appending numbers
		let finalName = transformed;
		let counter = 2;
		while (usedNames.has(finalName)) {
			finalName = `${transformed}${counter}`;
			counter++;
		}

		usedNames.add(finalName);
		mapping[original] = finalName;
	}

	return mapping;
}
