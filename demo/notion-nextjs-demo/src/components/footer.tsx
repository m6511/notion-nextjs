import Link from 'next/link';

export function Footer() {
	return (
		<footer className='border-border bg-background z-50 border-t'>
			<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
				<div className='flex flex-col items-center justify-between gap-4 text-sm sm:flex-row'>
					{/* Left side - Navigation Links */}
					<div className='text-muted-foreground flex items-center gap-6'>
						<Link
							href='/docs'
							className='hover:text-foreground transition-colors'
						>
							Docs
						</Link>
						<Link
							href='/examples/blog'
							className='hover:text-foreground transition-colors'
						>
							Examples
						</Link>
					</div>

					{/* Right side - GitHub and Version */}
					<div className='text-muted-foreground flex items-center gap-6'>
						<Link
							href='https://github.com/m6511/notion-nextjs'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-foreground transition-colors'
						>
							GitHub
						</Link>

						<Link
							href='https://www.npmjs.com/package/notion-nextjs'
							target='_blank'
							rel='noopener noreferrer'
							className='text-muted-foreground/75 hover:text-foreground transition-colors'
						>
							v0.4.0
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
