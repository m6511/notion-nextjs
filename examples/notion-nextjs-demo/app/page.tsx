// examples/next-app-example/app/page.tsx

import Image from 'next/image';
import { NotionNextJS } from 'notion-nextjs';
import config from '../notion.config.js';
import type { BlogPage } from '../types/notion';
import Link from 'next/link';

const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

export default async function Home() {
	const posts = await notion.getAllPages<BlogPage>('blog');
	const publishedPosts = posts.filter((post) => post.simplifiedProperties.Status === 'Published');

	return (
		<main className='flex min-h-screen flex-col items-center p-12 md:p-24 bg-gray-50'>
			<div className='w-full max-w-4xl'>
				<header className='text-center mb-12'>
					<h1 className='text-5xl font-bold text-gray-800'>My Notion Blog</h1>
					<Link href={`https://github.com/m6511/notion-nextjs`}>
						<div className='text-lg text-gray-600 mt-4'>
							Powered by{' '}
							<code className='bg-gray-200 p-1 rounded hover:underline hover:text-sky-700'>notion-nextjs</code>
						</div>
					</Link>
				</header>

				<div className='grid gap-8'>
					{publishedPosts.map((post) => (
						<article
							key={post.id}
							className='bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl'
						>
							{post.coverUrl && (
								<div className='relative w-full h-64'>
									<Image
										src={post.coverUrl}
										alt={post.title || 'Blog post cover image'}
										fill
										className='object-cover'
									/>
								</div>
							)}
							<div className='p-6'>
								<p className='text-sm text-gray-500 mb-2'>
									{post.simplifiedProperties.Date
										? new Date(post.simplifiedProperties.Date).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
										  })
										: ''}
								</p>
								<h2 className='text-3xl font-bold text-gray-900 mb-3'>{post.title}</h2>
								<p className='text-gray-700'>{post.simplifiedProperties.Subtitle}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</main>
	);
}
