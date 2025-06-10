import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { generateSlug } from '../lib/notion';

import { JSX } from 'react';
import { Link } from 'lucide-react';

interface Props {
	markdown: string;
	className?: string;
}

const HeadingWithAnchor = ({ level, children, ...props }: any) => {
	const Tag = `h${level}` as keyof JSX.IntrinsicElements;
	const text = String(children);
	const slug = generateSlug(text);

	return (
		<Tag id={slug} className='group relative' {...props}>
			{children}
			<a
				href={`#${slug}`}
				className='absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity'
				aria-label={`Link to ${text}`}
			>
				<Link size={16} className='text-gray-400 hover:text-gray-600' />
			</a>
		</Tag>
	);
};

export function MarkdownArticle({ markdown, className = '' }: Props) {
	return (
		<div
			className={`prose max-w-none prose-code:!outline-0 prose-pre:!bg-transparent prose-pre:!p-0 prose-pre:!m-0 [&_pre>div]:rounded-lg ${className}`}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: (props) => <HeadingWithAnchor level={1} {...props} />,
					h2: (props) => <HeadingWithAnchor level={2} {...props} />,
					h3: (props) => <HeadingWithAnchor level={3} {...props} />,
					code({ node, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '');
						return match ? (
							//@ts-expect-error
							<SyntaxHighlighter style={tomorrow} language={match[1]} PreTag='div' {...props}>
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
