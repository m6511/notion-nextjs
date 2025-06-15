'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
	oneLight,
	oneDark,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';
import { generateSlug } from '../lib/slug';

import { JSX, useState, useEffect } from 'react';
import { Link } from 'lucide-react';

interface Props {
	markdown: string;
	className?: string;
}

interface HeadingProps {
	level: number;
	children?: React.ReactNode;
	[key: string]: unknown;
}

const HeadingWithAnchor = ({ level, children, ...props }: HeadingProps) => {
	const Tag = `h${level}` as keyof JSX.IntrinsicElements;
	const text = String(children);
	const slug = generateSlug(text);

	return (
		<Tag id={slug} className='group relative' {...props}>
			{children}
			<a
				href={`#${slug}`}
				className='absolute top-2 -left-6 opacity-0 transition-opacity group-hover:opacity-100'
				aria-label={`Link to ${text}`}
			>
				<Link
					size={14}
					className='text-muted-foreground hover:text-foreground'
				/>
			</a>
		</Tag>
	);
};

export function MarkdownArticle({ markdown, className = '' }: Props) {
	const [mounted, setMounted] = useState(false);
	const { theme, systemTheme } = useTheme();
	const currentTheme = theme === 'system' ? systemTheme : theme;
	const isDark = currentTheme === 'dark';

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div
			className={`prose prose-neutral dark:prose-invert prose-code:!outline-0 prose-pre:!bg-transparent prose-pre:!p-0 prose-pre:!m-0 max-w-none ${className}`}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: (props) => <HeadingWithAnchor level={1} {...props} />,
					h2: (props) => <HeadingWithAnchor level={2} {...props} />,
					h3: (props) => <HeadingWithAnchor level={3} {...props} />,
					code({ className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '');
						return match ? (
							<SyntaxHighlighter
								// @ts-expect-error SyntaxHighlighter has incorrect type definitions
								style={mounted && isDark ? oneDark : oneLight}
								language={match[1]}
								PreTag='div'
								customStyle={{
									margin: 0,
									borderRadius: '0.5rem',
									border: '1px solid var(--border)',
								}}
								{...props}
							>
								{String(children).replace(/\n$/, '')}
							</SyntaxHighlighter>
						) : (
							<code
								className={`${className} bg-muted rounded px-1.5 py-0.5 font-mono text-sm`}
								{...props}
							>
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
