import ReactMarkdown from 'react-markdown';

interface Props {
	markdown: string;
	className?: string;
}

export function MarkdownArticle({ markdown, className = '' }: Props) {
	return (
		<div className={`prose max-w-none ${className}`}>
			<ReactMarkdown>{markdown}</ReactMarkdown>
		</div>
	);
}
