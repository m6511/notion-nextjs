import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface Props {
	markdown: string;
	className?: string;
}

export function MarkdownArticle({ markdown, className = '' }: Props) {
	return (
		<div
			className={` prose max-w-none prose-pre:!bg-transparent prose-code:!rounded-sm prose-pre:!p-0 prose-pre:!m-0 [&_pre>div]:rounded-xl
				${className}`}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[
					rehypeSlug,
					[
						rehypeAutolinkHeadings,
						{
							behavior: 'wrap',
							properties: {
								className: ['color-inherit decoration-0 no-underline font-semibold'],
							},
						},
					],
				]}
				components={{
					code({ node, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '');
						return match ? (
							<SyntaxHighlighter
								//@ts-expect-error
								style={tomorrow}
								language={match[1]}
								PreTag='div'
								customStyle={{ padding: '2rem' }}
								{...props}
							>
								{String(children).replace(/\n$/, '')}
							</SyntaxHighlighter>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},
				}}
			>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
