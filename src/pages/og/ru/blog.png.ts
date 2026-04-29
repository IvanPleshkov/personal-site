import type { APIRoute } from 'astro';
import { renderOG } from '../../../lib/og';

export const GET: APIRoute = async () => {
	const png = await renderOG({
		eyebrow: '02 · блог',
		title: 'Заметки',
		footer: 'rust · gpu · векторный поиск · графика',
	});
	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
