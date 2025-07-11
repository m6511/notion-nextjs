// notion.config.js
// Generated by notion-nextjs

/** @type {import('notion-nextjs').NotionNextJSConfig} */
module.exports = {
	databases: {
		blog: '20d58a3245d4804cb212e01b595be565',
		docs: '20d58a3245d480bab442d338a821bebc',
	},
	dataSource: 'local',
	propertyNaming: 'camelCase',
	typesPath: 'src/types/notion.ts',
	images: {
		enabled: true,
		outputDir: '/public/images/notion',
		format: 'webp',
		quality: 85,
	},
};
