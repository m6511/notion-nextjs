'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DocsPageWithSlug } from '@/lib/notion';

interface DocsSidebarProps {
	docPages: DocsPageWithSlug[];
}

interface GroupedPages {
	[section: string]: DocsPageWithSlug[];
}

export default function DocsSidebar({ docPages }: DocsSidebarProps) {
	const pathname = usePathname();
	const currentSlug = pathname.split('/').pop();
	// Group pages by section
	const groupedPages = docPages.reduce<GroupedPages>((acc, page) => {
		const section = page.simplifiedProperties.section || 'Uncategorized';
		if (!acc[section]) {
			acc[section] = [];
		}
		acc[section].push(page);
		return acc;
	}, {});

	// Sort pages within each section by order
	Object.keys(groupedPages).forEach((section) => {
		groupedPages[section].sort((a, b) => {
			return (
				(a.simplifiedProperties.order || 0) -
				(b.simplifiedProperties.order || 0)
			);
		});
	});

	return (
		<nav className='space-y-1'>
			<div className='mb-6'>
				<h2 className='text-foreground mb-4 text-lg font-semibold'>
					Documentation
				</h2>
				<div className='space-y-2'>
					{Object.entries(groupedPages).map(([section, pages]) => {
						// Check if current page is in this section to keep it open
						const isCurrentSection = pages.some(
							(page) => page.slug === currentSlug
						);

						return (
							<Collapsible key={section} defaultOpen={isCurrentSection}>
								<CollapsibleTrigger className='hover:bg-muted flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium'>
									<span>{section}</span>
									<ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
								</CollapsibleTrigger>
								<CollapsibleContent className='pb-2'>
									<div className='ml-3 space-y-1 pl-3'>
										{pages.map((page) => (
											<Link
												key={page.id}
												href={`/docs/${page.slug}`}
												className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
													currentSlug === page.slug
														? 'bg-primary/10 text-primary'
														: 'text-muted-foreground hover:text-foreground hover:bg-muted'
												}`}
											>
												<span className='truncate'>
													{page.simplifiedProperties.title}
												</span>
											</Link>
										))}
									</div>
								</CollapsibleContent>
							</Collapsible>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
