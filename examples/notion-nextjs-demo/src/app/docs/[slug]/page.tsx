import { notFound } from 'next/navigation';
import { getAllDocPages, getDocsPageBySlug } from '@/lib/notion';
import { MarkdownArticle } from '@/components/markdown-article';

interface Props {
	params: { slug: string };
}

export async function generateStaticParams() {
	const pages = await getAllDocPages();

	return pages.map((post) => ({
		slug: post.slug,
	}));
}

export default async function DocsPage({ params }: Props) {
	const page = await getDocsPageBySlug(params.slug);

	console.log(page);

	if (!page) {
		notFound();
	}

	return (
		<article className='container mx-auto'>
			{page.coverUrl && <img src={page.coverUrl} alt={page.title || ''} />}
			<h1 className='text-3xl font-bold'>{page.title}</h1>
			<p>Published: {page.simplifiedProperties.section}</p>
			<MarkdownArticle markdown={page.content || ''} />
		</article>
	);
}
