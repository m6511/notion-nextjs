import { NotionNextJS } from 'notion-nextjs';
import config from '../../../../notion.config.js';
import type { BlogPage } from '@/types/notion';

const notion = new NotionNextJS(process.env.NOTION_API_KEY!, config);

// Test configuration with icon downloads disabled
const configWithDisabledIcons = {
  ...config,
  images: {
    ...config.images,
    disableIconDownload: true,
  },
};

const notionWithDisabledIcons = new NotionNextJS(process.env.NOTION_API_KEY!, configWithDisabledIcons);

export default async function DisableIconDownloadPage() {
  // Get pages with default config (icons enabled)
  const pagesWithIcons = await notion.getAllPages<BlogPage>('blog');
  
  // Get pages with icons disabled
  const pagesWithoutIcons = await notionWithDisabledIcons.getAllPages<BlogPage>('blog');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Disable Icon Download Example</h1>
        <p className="text-gray-600 mb-4">
          This example demonstrates the <code>disableIconDownload</code> configuration option.
          When enabled, page icons are not downloaded and processed locally.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Configuration</h3>
          <pre className="text-sm text-blue-700 overflow-x-auto">
{`images: {
  enabled: true,
  disableIconDownload: true, // Skip icon downloads
  format: 'webp',
  quality: 85
}`}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* With Icons (Default) */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            ✅ Icons Enabled (Default)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Icons are downloaded and processed locally
          </p>
          <div className="space-y-4">
            {pagesWithIcons.slice(0, 3).map((page) => (
              <div key={page.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  {page.iconUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={page.iconUrl} 
                        alt="Page icon" 
                        className="w-8 h-8 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {page.title || 'Untitled'}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Icon URL: {page.iconUrl ? '✅ Downloaded locally' : '❌ No icon'}</div>
                      <div>Cover: {page.coverUrl ? '✅ Available' : '❌ No cover'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Without Icons */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">
            🚫 Icons Disabled
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Icons are skipped during processing (original URLs preserved)
          </p>
          <div className="space-y-4">
            {pagesWithoutIcons.slice(0, 3).map((page) => (
              <div key={page.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  {page.iconUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={page.iconUrl} 
                        alt="Page icon" 
                        className="w-8 h-8 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {page.title || 'Untitled'}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Icon URL: {page.iconUrl ? '🌐 Original Notion URL' : '❌ No icon'}</div>
                      <div>Cover: {page.coverUrl ? '✅ Available' : '❌ No cover'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Benefits</h3>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
          <li><strong>Faster sync times:</strong> Skip downloading small icon files</li>
          <li><strong>Reduced bandwidth:</strong> Only download essential images (covers, content)</li>
          <li><strong>Less storage:</strong> Fewer files in your images directory</li>
          <li><strong>Flexibility:</strong> Use original Notion icons when needed</li>
        </ul>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Note</h3>
        <p className="text-sm text-yellow-700">
          When icon downloads are disabled, the <code>iconUrl</code> property will contain the original Notion URL.
          This means icons will load directly from Notion's servers and may be subject to their rate limiting and availability.
        </p>
      </div>
    </div>
  );
}