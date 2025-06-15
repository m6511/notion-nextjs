interface CodeBlockProps {
	code: string;
	filename?: string;
	language?: string;
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
	return (
		<div className='bg-card border-border h-96 overflow-hidden rounded-lg border'>
			{filename && (
				<div className='border-border bg-muted/20 border-b px-6 py-3'>
					<div className='text-muted-foreground flex items-center gap-2 text-sm'>
						<div className='h-3 w-3 rounded-full bg-red-500'></div>
						<div className='h-3 w-3 rounded-full bg-yellow-500'></div>
						<div className='h-3 w-3 rounded-full bg-green-500'></div>
						<span className='ml-2'>{filename}</span>
					</div>
				</div>
			)}
			<div className='p-6'>
				<pre className='overflow-x-auto text-sm'>
					<code className='text-foreground whitespace-pre-wrap'>{code}</code>
				</pre>
			</div>
		</div>
	);
}
