import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getBlogPosts } from '../lib/blog';

export async function GET(context) {
	const all = await getBlogPosts();
	const posts = all
		.filter((post) => post.id.endsWith('/en'))
		.map((post) => ({ post, slug: post.id.replace(/\/en$/, '') }))
		.sort((a, b) => b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map(({ post, slug }) => ({
			...post.data,
			link: `/blog/${slug}/`,
		})),
	});
}
