import { redirect } from 'next/navigation';
import { getAllDocPages } from '@/lib/notion';

export default async function DocsPage() {
	const docPages = await getAllDocPages();

	// Find the first article - prioritize by section order, then by order within section
	const sortedPages = docPages.sort((a, b) => {
		// First sort by section priority (Getting Started first)
		const sectionA = a.simplifiedProperties.section || 'ZZZ';
		const sectionB = b.simplifiedProperties.section || 'ZZZ';

		if (sectionA === 'Getting Started' && sectionB !== 'Getting Started')
			return -1;
		if (sectionB === 'Getting Started' && sectionA !== 'Getting Started')
			return 1;

		// Then by section name
		if (sectionA !== sectionB) {
			return sectionA.localeCompare(sectionB);
		}

		// Finally by order within section
		return (
			(a.simplifiedProperties.order || 0) - (b.simplifiedProperties.order || 0)
		);
	});

	const firstArticle = sortedPages[0];

	if (firstArticle) {
		redirect(`/docs/${firstArticle.slug}`);
	}

	// Fallback if no articles found
	return (
		<div className='container mx-auto py-8'>
			<h1 className='text-2xl font-bold'>Documentation</h1>
			<p className='text-muted-foreground mt-2'>
				No documentation articles found.
			</p>
		</div>
	);
}
