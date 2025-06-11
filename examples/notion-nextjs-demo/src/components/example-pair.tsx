import { CodeBlock } from './code-block';

interface ExamplePairProps {
	leftTitle: string;
	leftDescription: string;
	rightTitle: string;
	rightDescription: string;
	notionUrl?: string;
	code: string;
	filename: string;
	language?: string;
	reverse?: boolean;
}
// TODO: support dark mode for examples
// TODO: disable scroll in iframe
// TODO: consistent height if one of the two paragraph wraps
// TODO: group examples better in mobile view

export function ExamplePair({
	leftTitle,
	leftDescription,
	rightTitle,
	rightDescription,
	notionUrl = 'https://www.notion.so/embed/20d58a3245d480bab442d338a821bebc',
	code,
	filename,
	language = 'typescript',
	reverse = false,
}: ExamplePairProps) {
	const leftContent = (
		<div className=''>
			<h3 className='text-xl font-semibold text-foreground mb-4'>{leftTitle}</h3>
			<p className='text-muted-foreground mb-6'>{leftDescription}</p>
			<div className='bg-card border border-border rounded-lg overflow-hidden h-96'>
				<iframe
					src='https://young-cemetery-459.notion.site/ebd/20f58a3245d480a59437c1504085e3fa?v=20f58a3245d480a88946000c350040b5'
					allowFullScreen
					className='w-full h-full pointer-events-none'
					title={leftTitle}
				/>
			</div>
		</div>
	);

	const rightContent = (
		<div>
			<h3 className='text-xl font-semibold text-foreground mb-4'>{rightTitle}</h3>
			<p className='text-muted-foreground mb-6'>{rightDescription}</p>
			<CodeBlock code={code} filename={filename} language={language} />
		</div>
	);

	return (
		<div className='grid lg:grid-cols-2 gap-8 items-start'>
			{reverse ? (
				<>
					{rightContent}
					{leftContent}
				</>
			) : (
				<>
					{leftContent}
					{rightContent}
				</>
			)}
		</div>
	);
}
