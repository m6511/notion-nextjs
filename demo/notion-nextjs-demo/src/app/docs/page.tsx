import { MarkdownArticle } from '@/components/markdown-article';
import { getAllDocPages } from '@/lib/notion';

export default async function DocsPage() {
	const posts = await getAllDocPages();
	const kitchenSink = posts.find((post) => post.slug === 'kitchen-sink');

	return (
		<div className='container mx-auto'>
			<h1>Docs</h1>
			{posts.map((post) => (
				<ul key={post.id}>
					<a href={`/docs/${post.slug}`}>
						<li>{post.title}</li>
					</a>
				</ul>
			))}
			<MarkdownArticle markdown={kitchenSink?.content || ''} />
		</div>
	);
}
