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
				{/* Mobile Navigation */}
				<div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-16 z-20 border-b p-4 backdrop-blur lg:hidden'>
					<details className='group'>
						<summary className='text-foreground flex cursor-pointer items-center justify-between py-2 text-sm font-medium'>
							Documentation Menu
							<svg
								className='h-4 w-4 transition-transform group-open:rotate-180'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</summary>
						<div className='pt-4'>
							<DocsSidebar docPages={docPages} />
						</div>
					</details>
				</div>

				{/* Content */}
				<main className='mx-auto max-w-4xl px-6 py-6 lg:py-8'>{children}</main>
			</div>
		</div>
	);
};

export default DocsLayout;
