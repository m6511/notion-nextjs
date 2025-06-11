import Image from 'next/image';
import { NotionNextJS } from 'notion-nextjs';
import config from '../../../../notion.config.js';
import type { BlogPage } from '@/types/notion';

const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

export default async function BlogPage() {
	const posts = await notion.getAllPages<BlogPage>('blog');
	const publishedPosts = posts.filter((post) => post.simplifiedProperties.status === 'Published');
	const sortedPosts = publishedPosts
		.filter((post) => post.simplifiedProperties.publishDate)
		.sort(
			(a, b) =>
				new Date(b.simplifiedProperties.publishDate || '').getTime() -
				new Date(a.simplifiedProperties.publishDate || '').getTime()
		);

	return (
		<main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
			<header className='text-center mb-12'>
				<h1 className='text-4xl font-bold text-foreground mb-4'>Blog Examples</h1>
				<p className='text-lg text-muted-foreground'>Posts powered by Notion as a CMS</p>
			</header>

			<div className='grid gap-8'>
				{sortedPosts.map((post) => (
					<article
						key={post.id}
						className='bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-md hover:border-primary/20'
					>
						{post.coverUrl && (
							<div className='relative w-full h-48'>
								<Image src={post.coverUrl} alt={post.title || 'Blog post cover image'} fill className='object-cover' />
							</div>
						)}
						<div className='p-6'>
							<p className='text-sm text-muted-foreground mb-2'>
								{post.simplifiedProperties.publishDate
									? new Date(post.simplifiedProperties.publishDate).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
									  })
									: ''}
							</p>
							<h2 className='text-2xl font-semibold text-foreground mb-2'>{post.title}</h2>
						</div>
					</article>
				))}

				{sortedPosts.length === 0 && (
					<div className='text-center py-12'>
						<p className='text-muted-foreground'>No published posts found.</p>
					</div>
				)}
			</div>
		</main>
	);
}
