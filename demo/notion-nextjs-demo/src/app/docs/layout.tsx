import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from '@/components/ui/sidebar';
import DocsSidebar from '@/components/docs-sidebar';
import { getAllDocPages } from '@/lib/notion';

import React from 'react';

const DocsLayout = async ({ children }: { children: React.ReactNode }) => {
	const docPages = await getAllDocPages();

	return (
		<SidebarProvider
			style={{ '--navbar-height': '4rem' } as React.CSSProperties}
		>
			<DocsSidebar docPages={docPages} />
			<SidebarInset className='mt-16'>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<h1 className='text-lg font-semibold'>Documentation</h1>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DocsLayout;
