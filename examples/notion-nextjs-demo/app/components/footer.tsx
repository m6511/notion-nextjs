import Link from 'next/link';

export function Footer() {
	// TODO: Consistent height
	// TODO: Footer at the bottom of the page (body screen height-footer)

	return (
		<footer className='bg-slate-950 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-800'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				<div className='flex flex-col sm:flex-row justify-between items-center gap-4 text-sm'>
					{/* Left side - Navigation Links */}
					<div className='flex items-center gap-6 text-slate-400'>
						<Link href='/docs' className='hover:text-slate-200 transition-colors'>
							Docs
						</Link>
						<Link href='/examples/blog' className='hover:text-slate-200 transition-colors'>
							Examples
						</Link>
					</div>

					{/* Right side - GitHub and Version */}
					<div className='flex items-center gap-6 text-slate-400'>
						<Link
							href='https://github.com/m6511/notion-nextjs'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-slate-200 transition-colors'
						>
							GitHub
						</Link>

						<Link
							href='https://www.npmjs.com/package/notion-nextjs'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-slate-200 text-slate-500 transition-colors'
						>
							v0.4.0
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
