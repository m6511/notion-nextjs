import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star } from 'lucide-react';
import { CodeBlock } from './code-block';

interface HeroSectionProps {
	code: string;
}

export function HeroSection({ code }: HeroSectionProps) {
	return (
		<section className='mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8'>
			<div className='grid items-center gap-12 lg:grid-cols-2'>
				{/* Left Column - Content */}
				<div>
					<Badge variant='outline' className='mb-6'>
						Open Source
					</Badge>
					<h1 className='text-foreground mb-6 text-5xl leading-tight font-bold'>
						Notion as CMS for Next.js
					</h1>
					<p className='text-muted-foreground mb-8 text-xl leading-relaxed'>
						Transform your Notion pages into a powerful, type-safe content
						management system.
					</p>
					<div className='flex flex-col gap-4 sm:flex-row'>
						<Button size='lg' asChild>
							<Link href='/docs' className='flex items-center gap-2'>
								Get started
								<ArrowRight className='h-4 w-4' />
							</Link>
						</Button>
						<Button variant='outline' size='lg' asChild>
							<Link
								href='https://github.com/m6511/notion-nextjs'
								target='_blank'
								rel='noopener noreferrer'
							>
								View on GitHub
							</Link>
						</Button>
					</div>
					<div className='text-muted-foreground mt-8 flex items-center gap-4 text-sm'>
						<div className='flex items-center gap-1'>
							<Star className='text-primary h-4 w-4 fill-current' />
							<span>3.7k</span>
						</div>
						<span>•</span>
						<span>Used by 10k+ projects</span>
					</div>
				</div>

				{/* Right Column - Code Example */}
				<div className='lg:pl-8'>
					<CodeBlock code={code} filename='types/blog.ts' />
				</div>
			</div>
		</section>
	);
}
