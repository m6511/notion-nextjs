import { getAllDocPages } from '../lib/notion';

export default async function DocsPage() {
	const posts = await getAllDocPages();

	return (
		<div>
			<h1>Docs</h1>
			{posts.map((post) => (
				<article key={post.id}>
					<a href={`/docs/${post.slug}`}>
						<h2>{post.title}</h2>
					</a>
					<p>Section: {post.simplifiedProperties.section}</p>
				</article>
			))}
		</div>
	);
}
