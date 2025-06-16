import { NotionNextJS } from 'notion-nextjs';
import config from '../../../../notion.config.js';
import type { BlogPage } from '@/types/notion';

// Test configurations
const verboseConfig = { ...config, verbose: true };
const silentConfig = { ...config, verbose: false };

export default async function VerboseTestPage() {
	const verboseNotion = new NotionNextJS(
		process.env.NOTION_API_KEY!,
		verboseConfig
	);
	const silentNotion = new NotionNextJS(
		process.env.NOTION_API_KEY!,
		silentConfig
	);

	// This should log messages
	console.log('🔴 Testing with verbose=true (should see logs):');
	const verbosePosts = await verboseNotion.getAllPages<BlogPage>('blog', {
		useCache: true,
	});
	console.log(`Retrieved ${verbosePosts.length} posts with verbose logging`);

	// This should NOT log messages
	console.log('🔇 Testing with verbose=false (should not see logs):');
	const silentPosts = await silentNotion.getAllPages<BlogPage>('blog', {
		useCache: true,
	});
	console.log(`Retrieved ${silentPosts.length} posts with silent logging`);

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='mb-6 text-3xl font-bold'>Verbose Logging Test</h1>
			<div className='space-y-6'>
				<div>
					<h2 className='mb-3 text-xl font-semibold'>
						With Verbose Logging (verbose: true)
					</h2>
					<p className='mb-4 text-gray-600'>
						Check the server console - you should see detailed logging messages
						for this request.
					</p>
					<p>Retrieved {verbosePosts.length} posts</p>
				</div>

				<div>
					<h2 className='mb-3 text-xl font-semibold'>
						With Silent Logging (verbose: false)
					</h2>
					<p className='mb-4 text-gray-600'>
						Check the server console - you should NOT see logging messages for
						this request.
					</p>
					<p>Retrieved {silentPosts.length} posts</p>
				</div>

				<div className='bg-muted mt-8 rounded-lg p-4'>
					<h3 className='mb-2 font-semibold'>How to test:</h3>
					<ol className='list-inside list-decimal space-y-1 text-sm'>
						<li>Check your server console/terminal where Next.js is running</li>
						<li>Look for logging messages with emojis (📦, 🌐, etc.)</li>
						<li>The first request should show logs, the second should not</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
