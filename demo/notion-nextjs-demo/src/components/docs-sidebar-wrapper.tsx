'use client';

import DocsSidebar from '@/components/docs-sidebar';
import { DocsPageWithSlug } from '@/lib/notion';

interface DocsSidebarWrapperProps {
	docPages: DocsPageWithSlug[];
}

export default function DocsSidebarWrapper({ docPages }: DocsSidebarWrapperProps) {
	return <DocsSidebar docPages={docPages} />;
}