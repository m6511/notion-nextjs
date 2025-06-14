import Image from 'next/image';
import { NotionNextJS } from 'notion-nextjs';
import config from '../../../../notion.config.js';
import type { BlogPage } from '@/types/notion';

const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

export default async function BlogPage() {
	const posts = await notion.getAllPages<BlogPage>('blog');
	const publishedPosts = posts.filter(
		(post) => post.simplifiedProperties.status === 'Published'
	);
	const sortedPosts = publishedPosts
		.filter((post) => post.simplifiedProperties.publishDate)
		.sort(
			(a, b) =>
				new Date(b.simplifiedProperties.publishDate || '').getTime() -
				new Date(a.simplifiedProperties.publishDate || '').getTime()
		);

	return (
		<main className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
			<header className='mb-12 text-center'>
				<h1 className='text-foreground mb-4 text-4xl font-bold'>
					Blog Examples
				</h1>
				<p className='text-muted-foreground text-lg'>
					Posts powered by Notion as a CMS
				</p>
			</header>

			<div className='grid gap-8'>
				{sortedPosts.map((post) => (
					<article
						key={post.id}
						className='bg-card border-border hover:border-primary/20 overflow-hidden rounded-lg border transition-all hover:shadow-md'
					>
						{post.coverUrl && (
							<div className='relative h-48 w-full'>
								<Image
									src={post.coverUrl}
									alt={post.title || 'Blog post cover image'}
									fill
									className='object-cover'
								/>
							</div>
						)}
						<div className='p-6'>
							<p className='text-muted-foreground mb-2 text-sm'>
								{post.simplifiedProperties.publishDate
									? new Date(
											post.simplifiedProperties.publishDate
										).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})
									: ''}
							</p>
							<h2 className='text-foreground mb-2 text-2xl font-semibold'>
								{post.title}
							</h2>
						</div>
					</article>
				))}

				{sortedPosts.length === 0 && (
					<div className='py-12 text-center'>
						<p className='text-muted-foreground'>No published posts found.</p>
					</div>
				)}
			</div>
		</main>
	);
}
