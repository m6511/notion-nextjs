// Helper function to generate slug from title
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
