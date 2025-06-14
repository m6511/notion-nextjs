import Link from 'next/link';

export function Footer() {
	// TODO: Consistent height
	// TODO: Footer at the bottom of the page (body screen height-footer)

	return (
		<footer className='border-t border-slate-800 bg-slate-950 dark:border-slate-800 dark:bg-slate-950'>
			<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
				<div className='flex flex-col items-center justify-between gap-4 text-sm sm:flex-row'>
					{/* Left side - Navigation Links */}
					<div className='flex items-center gap-6 text-slate-400'>
						<Link
							href='/docs'
							className='transition-colors hover:text-slate-200'
						>
							Docs
						</Link>
						<Link
							href='/examples/blog'
							className='transition-colors hover:text-slate-200'
						>
							Examples
						</Link>
					</div>

					{/* Right side - GitHub and Version */}
					<div className='flex items-center gap-6 text-slate-400'>
						<Link
							href='https://github.com/m6511/notion-nextjs'
							target='_blank'
							rel='noopener noreferrer'
							className='transition-colors hover:text-slate-200'
						>
							GitHub
						</Link>

						<Link
							href='https://www.npmjs.com/package/notion-nextjs'
							target='_blank'
							rel='noopener noreferrer'
							className='text-slate-500 transition-colors hover:text-slate-200'
						>
							v0.4.0
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
