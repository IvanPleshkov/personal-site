import { getCollection } from 'astro:content';

/**
 * Drafts (`draft: true` in frontmatter) are visible in `astro dev` so authors can
 * preview them, but excluded from production builds — no static page, no index
 * entry, no RSS item, no sitemap URL, no OG card.
 */
const showDrafts = import.meta.env.DEV;

export async function getBlogPosts() {
	return getCollection('blog', ({ data }) => showDrafts || !data.draft);
}
