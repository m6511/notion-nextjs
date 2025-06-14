import { notFound } from 'next/navigation';
import { getAllDocPages, getDocsPageBySlug } from '@/lib/notion';
import { MarkdownArticle } from '@/components/markdown-article';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const pages = await getAllDocPages();

	return pages.map((post) => ({
		slug: post.slug,
	}));
}

export default async function DocsPage({ params: paramsPromise }: Props) {
	const params = await paramsPromise;
	const page = await getDocsPageBySlug(params.slug);
	const allPages = await getAllDocPages();

	if (!page) {
		notFound();
	}

	// Find next page in same section
	const currentSection = page.simplifiedProperties.section;
	const sectionPages = allPages
		.filter((p) => p.simplifiedProperties.section === currentSection)
		.sort(
			(a, b) =>
				(a.simplifiedProperties.order || 0) -
				(b.simplifiedProperties.order || 0)
		);

	const currentIndex = sectionPages.findIndex((p) => p.slug === page.slug);
	const nextPage = sectionPages[currentIndex + 1];

	return (
		<>
			{/* Breadcrumbs */}
			<div className='mb-6'>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href='/docs'>Documentation</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{page.simplifiedProperties.section && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link href={`/docs/${page.simplifiedProperties.section}`}>
											{page.simplifiedProperties.section}
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className='text-muted-foreground'>
								{page.simplifiedProperties.title}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Article Content */}
			<article className='w-full'>
				{page.coverUrl && (
					<div className='mb-8 overflow-hidden rounded-lg'>
						<img
							src={page.coverUrl}
							alt={page.title || ''}
							className='h-64 w-full object-cover'
						/>
					</div>
				)}

				<header className='mb-8 space-y-4'>
					<h1 className='text-foreground text-4xl leading-tight font-bold'>
						{page.title}
					</h1>
				</header>

				{/* Article Body */}

				<div className='prose prose-neutral dark:prose-invert max-w-none'>
					<MarkdownArticle markdown={page.content || ''} />
				</div>

				{/* Next Page Navigation */}
				{nextPage && (
					<div className='mt-8 flex justify-end'>
						<Link
							href={`/docs/${nextPage.slug}`}
							className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors'
						>
							Next: {nextPage.simplifiedProperties.title}
							<svg
								className='h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						</Link>
					</div>
				)}
			</article>
		</>
	);
}
