import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/section';
import { SectionHeader } from '@/components/section-header';
import { ExamplePair } from '@/components/example-pair';
import { HeroSection } from '@/components/hero-section';
import { getCodeExample } from '@/lib/code-examples';

export default async function Home() {
	const heroCode = await getCodeExample('hero-code');
	const schemaTypesCode = await getCodeExample('schema-types');
	const fetchFilterCode = await getCodeExample('fetch-filter');
	const apiResponseCode = await getCodeExample('api-response');
	return (
		<main className='min-h-screen'>
			<HeroSection code={heroCode} />

			<Section>
				<SectionHeader
					title='From Notion database to type-safe code'
					description='See how notion-nextjs transforms your Notion databases into powerful, type-safe APIs with automatic code generation.'
				/>

				<div className='space-y-16'>
					<ExamplePair
						leftTitle='Your Notion Database'
						leftDescription='Design your content structure in Notion with properties like title, publish date, status, and tags.'
						rightTitle='Auto-Generated Types'
						rightDescription='notion-nextjs automatically generates TypeScript interfaces from your database schema.'
						code={schemaTypesCode}
						filename='types/blog.ts'
					/>

					<ExamplePair
						leftTitle='Rich Content Management'
						leftDescription='Manage your blog posts, filter by status, organize with tags, and set publish dates.'
						rightTitle='Type-Safe Queries'
						rightDescription='Fetch and filter your content with full TypeScript support and IntelliSense.'
						code={fetchFilterCode}
						filename='lib/blog.ts'
					/>

					<ExamplePair
						leftTitle='Complex Properties'
						leftDescription="Use Notion's rich property types: relations, formulas, rollups, and more."
						rightTitle='Simplified API Response'
						rightDescription='Get clean, predictable JSON responses with simplified property access.'
						code={apiResponseCode}
						filename='response.json'
						language='json'
					/>
				</div>
			</Section>

			<Section>
				<div className='text-center'>
					<h2 className='text-3xl font-bold text-foreground mb-4'>Ready to get started?</h2>
					<p className='text-lg text-muted-foreground mb-8'>
						Transform your Notion workspace into a powerful CMS in minutes.
					</p>
					<Button size='lg' asChild>
						<Link href='/docs' className='flex items-center gap-2'>
							Read the docs
							<ArrowRight className='w-4 h-4' />
						</Link>
					</Button>
				</div>
			</Section>
		</main>
	);
}
