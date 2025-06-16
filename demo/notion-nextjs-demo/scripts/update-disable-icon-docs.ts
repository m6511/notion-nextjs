import { NotionDocsUpdaterImpl } from '../src/utils/notion-docs-updater';

const apiKey = process.env.NOTION_API_KEY || '';
const updater = new NotionDocsUpdaterImpl(apiKey);

const disableIconDownloadDocs = {
  title: 'Disable Icon Download',
  description: 'Configure the library to skip downloading page icons for improved performance and reduced bandwidth usage.',
  type: 'configuration' as const,
  content: {
    overview: 'The disableIconDownload option allows you to skip downloading and processing page icons while still downloading covers and content images. This can significantly speed up sync times and reduce bandwidth usage when icons are not critical to your application.',
    benefits: [
      'Faster sync times by skipping small icon files',
      'Reduced bandwidth usage and storage requirements',
      'Fewer files in your local images directory',
      'Original Notion icons remain available via their URLs'
    ],
    configuration: {
      options: [
        {
          name: 'images.disableIconDownload',
          type: 'boolean',
          description: 'Skip downloading page icons while still processing covers and content images',
          defaultValue: 'false',
          required: false,
          possibleValues: ['true', 'false']
        }
      ],
      example: `images: {
  enabled: true,
  disableIconDownload: true, // Skip icon downloads
  format: 'webp',
  quality: 85
}`,
      language: 'javascript'
    },
    usage: {
      description: 'Configure in your notion.config.js file',
      code: `export default {
  databases: {
    blog: 'your-database-id'
  },
  images: {
    enabled: true,
    disableIconDownload: true,
    outputDir: '/public/images/notion',
    format: 'webp',
    quality: 85
  }
};`
    },
    examples: [
      {
        title: 'Basic Configuration',
        description: 'Enable image processing but disable icon downloads',
        code: `const config = {
  databases: { blog: 'database-id' },
  images: {
    enabled: true,
    disableIconDownload: true
  }
};

const notion = new NotionNextJS(apiKey, config);
const pages = await notion.getAllPages('blog');

// Icons will contain original Notion URLs
pages.forEach(page => {
  console.log('Icon URL:', page.iconUrl); // Original Notion URL
  console.log('Cover URL:', page.coverUrl); // Local optimized path
});`
      },
      {
        title: 'Comparison Example',
        description: 'Compare behavior with icons enabled vs disabled',
        code: `// With icons enabled (default)
const configWithIcons = {
  images: { disableIconDownload: false }
};

// With icons disabled
const configWithoutIcons = {
  images: { disableIconDownload: true }
};

const pagesWithIcons = await notion1.getAllPages('blog');
const pagesWithoutIcons = await notion2.getAllPages('blog');

// Icons with different URLs
console.log('With icons:', pagesWithIcons[0].iconUrl); // /images/notion/page-icon.webp
console.log('Without icons:', pagesWithoutIcons[0].iconUrl); // https://notion.so/image/...`
      }
    ],
    notes: [
      'When disabled, iconUrl properties will contain the original Notion URLs',
      'Cover images and content images are still processed normally',
      'Original Notion icon URLs may be subject to rate limiting',
      'Consider using CSS fallbacks for missing or slow-loading icons',
      'This setting only affects new syncs - existing downloaded icons are not removed'
    ],
    relatedPages: [
      'image-optimization',
      'webp-optimization',
      'configuration-options'
    ]
  }
};

async function main() {
  try {
    console.log('🚀 Updating Notion documentation for disable icon download feature...');
    
    await updater.updatePage('image-optimization', [disableIconDownloadDocs]);
    
    console.log('✅ Successfully updated documentation!');
    console.log('📋 Next steps:');
    console.log('1. Run: cd demo/notion-nextjs-demo && npx notion-nextjs sync');
    console.log('2. Check the updated documentation in your Notion');
  } catch (error) {
    console.error('❌ Error updating documentation:', error);
    process.exit(1);
  }
}

main();