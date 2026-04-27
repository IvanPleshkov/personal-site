import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOG } from '../../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { title: post.data.title, description: post.data.description },
	}));
};

export const GET: APIRoute = async ({ props }) => {
	const { title } = props as { title: string; description: string };
	const png = await renderOG({
		eyebrow: '§ 02 blog',
		title,
		footer: 'ivanpleshkov.dev/blog',
	});
	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
