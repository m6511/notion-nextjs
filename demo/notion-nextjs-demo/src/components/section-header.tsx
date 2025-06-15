interface SectionHeaderProps {
	title: string;
	description: string;
	centered?: boolean;
	className?: string;
}

export function SectionHeader({
	title,
	description,
	centered = true,
	className = '',
}: SectionHeaderProps) {
	return (
		<div className={`mb-16 ${centered ? 'text-center' : ''} ${className}`}>
			<h2 className='text-foreground mb-4 text-3xl font-bold'>{title}</h2>
			<p
				className={`text-muted-foreground text-lg ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
			>
				{description}
			</p>
		</div>
	);
}
