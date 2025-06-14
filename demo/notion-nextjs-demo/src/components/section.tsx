interface SectionProps {
	children: React.ReactNode;
	className?: string;
	withBorder?: boolean;
}

export function Section({
	children,
	className = '',
	withBorder = true,
}: SectionProps) {
	return (
		<section
			className={`py-20 ${withBorder ? 'border-border border-t' : ''} ${className}`}
		>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>{children}</div>
		</section>
	);
}
