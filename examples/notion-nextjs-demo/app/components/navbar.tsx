import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
	return (
		<nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="flex items-center space-x-2">
						<div className="font-semibold text-xl text-foreground">notion-nextjs</div>
					</Link>
					
					<div className="flex items-center space-x-4">
						<Link 
							href="/docs" 
							className="text-muted-foreground hover:text-foreground transition-colors font-medium"
						>
							Docs
						</Link>
						<Link 
							href="/examples/blog" 
							className="text-muted-foreground hover:text-foreground transition-colors font-medium"
						>
							Examples
						</Link>
						<Button variant="outline" size="sm" asChild>
							<Link 
								href="https://github.com/m6511/notion-nextjs" 
								target="_blank"
								rel="noopener noreferrer"
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