import DocsSidebar from '@/components/docs-sidebar';
import { getAllDocPages } from '@/lib/notion';

import React from 'react';

const DocsLayout = async ({ children }: { children: React.ReactNode }) => {
	const docPages = await getAllDocPages();

	return (
		<div className='min-h-screen'>
			{/* Fixed Sidebar - Hidden on mobile, stops before footer */}
			<aside className='bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-16 left-0 z-30 hidden h-[calc(100vh-10rem)] w-64 overflow-y-auto backdrop-blur lg:block'>
				<div className='p-6'>
					<DocsSidebar docPages={docPages} />
				</div>
			</aside>

			{/* Main Content Area */}
			<div className='lg:pl-64'>
				<main className='mx-auto max-w-4xl px-6 py-6 lg:py-8'>{children}</main>
			</div>
		</div>
	);
};

export default DocsLayout;
