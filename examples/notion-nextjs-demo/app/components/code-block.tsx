interface CodeBlockProps {
	code: string;
	filename?: string;
	language?: string;
}

export function CodeBlock({ code, filename, language = 'typescript' }: CodeBlockProps) {
	return (
		<div className='bg-card border border-border rounded-lg overflow-hidden h-96'>
			{filename && (
				<div className='px-6 py-3 border-b border-border bg-muted/20'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<div className='w-3 h-3 rounded-full bg-red-500'></div>
						<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
						<div className='w-3 h-3 rounded-full bg-green-500'></div>
						<span className='ml-2'>{filename}</span>
					</div>
				</div>
			)}
			<div className='p-6'>
				<pre className='text-sm overflow-x-auto'>
					<code className='text-foreground whitespace-pre-wrap'>{code}</code>
				</pre>
			</div>
		</div>
	);
}
