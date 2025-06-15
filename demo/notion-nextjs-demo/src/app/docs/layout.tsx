import DocsSidebarWrapper from '@/components/docs-sidebar-wrapper';
import { getAllDocPages } from '@/lib/notion';

import React from 'react';

const DocsLayout = async ({ children }: { children: React.ReactNode }) => {
	const docPages = await getAllDocPages();

	return (
		<div className='min-h-screen'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='flex gap-8'>
					{/* Fixed Sidebar - Hidden on mobile, stops before footer */}
					<aside className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-20 z-30 hidden w-64 shrink-0 self-start overflow-y-auto rounded-lg backdrop-blur lg:block'>
						<div className='max-h-[calc(100vh-6rem)] overflow-y-auto p-6'>
							<DocsSidebarWrapper docPages={docPages} />
						</div>
					</aside>

					{/* Main Content Area */}
					<main className='min-w-0 flex-1 py-6 lg:py-8'>{children}</main>
				</div>
			</div>
		</div>
	);
};

export default DocsLayout;
