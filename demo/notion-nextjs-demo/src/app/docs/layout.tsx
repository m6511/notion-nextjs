import DocsSidebar from '@/components/docs-sidebar';
import { getAllDocPages } from '@/lib/notion';

import React from 'react';

const DocsLayout = async ({ children }: { children: React.ReactNode }) => {
	const docPages = await getAllDocPages();

	return (
		<div className='min-h-screen'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='flex gap-8'>
					{/* Fixed Sidebar - Hidden on mobile, stops before footer */}
					<aside className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-20 z-30 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto rounded-lg backdrop-blur lg:block'>
						<div className='p-6'>
							<DocsSidebar docPages={docPages} />
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
