import type { APIRoute } from 'astro';
import { renderOG } from '../../lib/og';

export const GET: APIRoute = async () => {
	const png = await renderOG({
		eyebrow: '03 · about',
		title: 'About Ivan Pleshkov',
		footer: 'software engineer · qdrant',
	});
	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
