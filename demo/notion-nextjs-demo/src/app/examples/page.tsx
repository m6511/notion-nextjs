import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExamplesPage() {
	const examples = [
		{
			title: 'Blog Example',
			href: '/examples/blog',
			description: 'Complete blog implementation showcasing how to fetch and display Notion blog posts with simplified properties and optimized images.',
			tags: ['Basic Usage', 'Blog', 'Content']
		},
		{
			title: 'Verbose Logging Test',
			href: '/examples/verbose-test',
			description: 'Demonstrates the verbose logging configuration option, showing the difference between verbose and silent modes.',
			tags: ['Configuration', 'Logging', 'Debug']
		},
		{
			title: 'WebP Image Optimization',
			href: '/examples/webp-test',
			description: 'Showcases automatic WebP image conversion and optimization, comparing file sizes and formats side by side.',
			tags: ['Images', 'Performance', 'WebP']
		}
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-4">notion-nextjs Examples</h1>
				<p className="text-xl text-muted-foreground max-w-3xl">
					Explore these examples to see notion-nextjs in action. Each example demonstrates different features 
					and capabilities of the library.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{examples.map((example) => (
					<Card key={example.href} className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-xl">
								<Link 
									href={example.href}
									className="hover:text-blue-600 transition-colors"
								>
									{example.title}
								</Link>
							</CardTitle>
							<CardDescription className="text-sm">
								{example.description}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-1">
								{example.tags.map((tag) => (
									<span 
										key={tag}
										className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
							<div className="mt-4">
								<Link 
									href={example.href}
									className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
								>
									View Example →
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="mt-12 p-6 bg-muted rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
				<div className="space-y-4">
					<p className="text-muted-foreground">
						These examples are built using the notion-nextjs library. To get started with your own project:
					</p>
					<ol className="list-decimal list-inside space-y-2 text-sm">
						<li>Install the package: <code className="bg-background px-2 py-1 rounded">npm install notion-nextjs</code></li>
						<li>Run the setup wizard: <code className="bg-background px-2 py-1 rounded">npx notion-nextjs setup</code></li>
						<li>Add your Notion API key to <code className="bg-background px-2 py-1 rounded">.env.local</code></li>
						<li>Sync your data: <code className="bg-background px-2 py-1 rounded">npx notion-nextjs sync</code></li>
						<li>Start building your application!</li>
					</ol>
				</div>
			</div>

			<div className="mt-8 text-center">
				<Link 
					href="/docs"
					className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					View Full Documentation
				</Link>
			</div>
		</div>
	);
}