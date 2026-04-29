import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOG } from '../../../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog');
	return posts
		.map((post) => {
			const match = post.id.match(/^(.+)\/(en|ru)$/);
			if (!match) return null;
			const [, slug, lang] = match;
			return {
				params: { lang, slug },
				props: { title: post.data.title, lang },
			};
		})
		.filter((p): p is NonNullable<typeof p> => p !== null);
};

export const GET: APIRoute = async ({ props }) => {
	const { title, lang } = props as { title: string; lang: 'en' | 'ru' };
	const eyebrow = lang === 'ru' ? '02 · блог' : '02 · blog';
	const footer = lang === 'ru' ? 'ivanpleshkov.dev/ru/blog' : 'ivanpleshkov.dev/blog';
	const png = await renderOG({
		eyebrow,
		title,
		footer,
	});
	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
