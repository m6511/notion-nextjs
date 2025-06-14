import { redirect } from 'next/navigation';

export default async function DocsPage() {
	// TODO: Redirect to first article without layout shift
	redirect(`/docs/installation`);

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
