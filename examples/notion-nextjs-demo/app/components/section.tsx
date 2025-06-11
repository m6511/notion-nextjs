interface SectionProps {
	children: React.ReactNode;
	className?: string;
	withBorder?: boolean;
}

export function Section({ children, className = '', withBorder = true }: SectionProps) {
	return (
		<section className={`py-20 ${withBorder ? 'border-t border-border' : ''} ${className}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
		</section>
	);
}
