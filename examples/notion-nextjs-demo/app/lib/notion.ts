// lib/notion.ts
import { NotionNextJS } from 'notion-nextjs';
import config from '../../notion.config.js';
import { DocsPage } from '../../types/notion.js';

// Create singleton instance
const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

// Helper function to generate slug from title
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// MARK- Docs Section
export interface DocsPageWithSlug extends DocsPage {
	slug: string;
}

export async function getAllDocPages(): Promise<DocsPageWithSlug[]> {
	const pages = await notion.getAllPages('docs', {
		filter: {
			property: 'Status',
			select: { equals: 'Published' },
		},
		sorts: [
			{
				property: 'Published Date',
				direction: 'descending',
			},
		],
	});

	return pages.map((page) => ({
		...page,
		slug: generateSlug(page.title || `page-${page.id}`),
	})) as DocsPageWithSlug[];
}

export async function getDocsPageBySlug(slug: string): Promise<DocsPageWithSlug | null> {
	const pages = await getAllDocPages();
	return pages.find((page) => page.slug === slug) || null;
}

export async function getDocsPageById(pageId: string): Promise<DocsPageWithSlug> {
	const page = await notion.getPage(pageId);
	return {
		...page,
		slug: generateSlug(page.title || `post-${page.id}`),
	} as DocsPageWithSlug;
}

export { notion };
