import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
	return (
		<nav className='border-border bg-background/80 sticky top-0 z-50 max-h-16 min-h-16 border-b backdrop-blur-sm'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					<Link href='/' className='flex items-center space-x-2'>
						<div className='text-foreground text-xl font-semibold'>
							notion-nextjs
						</div>
					</Link>

					<div className='flex items-center space-x-4'>
						<Link
							href='/docs'
							className='text-muted-foreground hover:text-foreground font-medium transition-colors'
						>
							Docs
						</Link>
						<Link
							href='/examples/blog'
							className='text-muted-foreground hover:text-foreground font-medium transition-colors'
						>
							Examples
						</Link>
						<Button variant='outline' size='sm' asChild>
							<Link
								href='https://github.com/m6511/notion-nextjs'
								target='_blank'
								rel='noopener noreferrer'
							>
								GitHub
							</Link>
						</Button>
						<ThemeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}
