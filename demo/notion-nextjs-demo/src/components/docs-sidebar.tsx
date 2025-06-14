'use client';

import { ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
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
		<Sidebar className='top-16 h-[calc(100vh-4rem)]'>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Documentation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{Object.entries(groupedPages).map(([section, pages]) => (
								<Collapsible
									key={section}
									defaultOpen
									className='group/collapsible'
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className='w-full justify-between'>
												<span>{section}</span>
												<ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{pages.map((page) => (
													<SidebarMenuSubItem key={page.id}>
														<SidebarMenuSubButton
															asChild
															isActive={currentSlug === page.slug}
														>
															<Link href={`/docs/${page.slug}`}>
																<FileText className='mr-2 h-4 w-4' />
																{page.simplifiedProperties.title}
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
