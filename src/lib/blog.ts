import { getCollection } from 'astro:content';

/**
 * Drafts are visible to authors:
 *   - during local `pnpm dev` (so we can preview while writing);
 *   - on Cloudflare preview deployments — any branch other than `main`
 *     (so we can review on the real edge before publishing).
 *
 * They stay hidden on the production build (branch=main → ivanpleshkov.dev),
 * so the live site never accidentally exposes a work-in-progress post.
 */
const isDev = import.meta.env.DEV;
const ciBranch =
	typeof process !== 'undefined' && process.env
		? process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH
		: undefined;
const isPreviewBranch = ciBranch !== undefined && ciBranch !== 'main';
const showDrafts = isDev || isPreviewBranch;

export async function getBlogPosts() {
	return getCollection('blog', ({ data }) => showDrafts || !data.draft);
}
