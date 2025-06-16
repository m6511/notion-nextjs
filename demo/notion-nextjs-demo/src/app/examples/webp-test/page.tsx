import { NotionNextJS } from 'notion-nextjs';
import config from '../../../../notion.config.js';
import type { BlogPage } from '@/types/notion';

// Test configurations
const webpConfig = { ...config, images: { ...config.images, format: 'webp' as const } };
const originalConfig = { ...config, images: { ...config.images, format: 'original' as const } };

export default async function WebpTestPage() {
	const webpNotion = new NotionNextJS(process.env.NOTION_API_KEY!, webpConfig);
	const originalNotion = new NotionNextJS(process.env.NOTION_API_KEY!, originalConfig);

	// Get posts with webp images
	console.log('🔄 Testing webp image optimization:');
	const webpPosts = await webpNotion.getAllPages<BlogPage>('blog', { useCache: false, processImages: true });
	const postsWithImages = webpPosts.filter(post => post.coverUrl);

	// Get posts with original images for comparison
	console.log('📷 Testing original image format:');
	const originalPosts = await originalNotion.getAllPages<BlogPage>('blog', { useCache: false, processImages: true });
	const originalPostsWithImages = originalPosts.filter(post => post.coverUrl);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">WebP Image Optimization Test</h1>
			
			<div className="mb-8 p-4 bg-blue-50 rounded-lg">
				<h2 className="text-xl font-semibold mb-3">Test Results</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-semibold text-green-700">WebP Format (Optimized)</h3>
						<p className="text-sm text-gray-600">Quality: {webpConfig.images.quality}%</p>
						<p className="text-sm">Posts with images: {postsWithImages.length}</p>
					</div>
					<div>
						<h3 className="font-semibold text-blue-700">Original Format</h3>
						<p className="text-sm text-gray-600">No conversion applied</p>
						<p className="text-sm">Posts with images: {originalPostsWithImages.length}</p>
					</div>
				</div>
			</div>

			<div className="space-y-8">
				<div>
					<h2 className="text-2xl font-semibold mb-4">WebP Optimized Images</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{postsWithImages.slice(0, 6).map((post) => (
							<div key={post.id} className="border rounded-lg overflow-hidden">
								{post.coverUrl && (
									<img 
										src={post.coverUrl} 
										alt={post.title || 'Post image'}
										className="w-full h-48 object-cover"
									/>
								)}
								<div className="p-3">
									<h3 className="font-semibold text-sm mb-1">{post.title}</h3>
									<p className="text-xs text-gray-500">
										Format: {post.coverUrl?.endsWith('.webp') ? 'WebP' : 'Original'}
									</p>
									<p className="text-xs text-gray-400 mt-1 break-all">
										{post.coverUrl}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-4">Original Format Images</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{originalPostsWithImages.slice(0, 6).map((post) => (
							<div key={post.id} className="border rounded-lg overflow-hidden">
								{post.coverUrl && (
									<img 
										src={post.coverUrl} 
										alt={post.title || 'Post image'}
										className="w-full h-48 object-cover"
									/>
								)}
								<div className="p-3">
									<h3 className="font-semibold text-sm mb-1">{post.title}</h3>
									<p className="text-xs text-gray-500">
										Format: {post.coverUrl?.endsWith('.webp') ? 'WebP' : 'Original'}
									</p>
									<p className="text-xs text-gray-400 mt-1 break-all">
										{post.coverUrl}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-8 p-4 bg-yellow-50 rounded-lg">
				<h3 className="font-semibold mb-2">How to verify WebP conversion:</h3>
				<ol className="list-decimal list-inside space-y-1 text-sm">
					<li>Check the server console for conversion logs (🔄 Converting to webp messages)</li>
					<li>Look at the image URLs - WebP images should end with .webp</li>
					<li>Check the file system in public/images/notion/ - converted images should be .webp files</li>
					<li>Inspect browser dev tools Network tab to see smaller WebP file sizes</li>
				</ol>
			</div>
		</div>
	);
}