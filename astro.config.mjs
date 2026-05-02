// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeSlug from 'rehype-slug';

// https://astro.build/config
export default defineConfig({
	site: 'https://ivanpleshkov.dev',
	output: 'static',
	markdown: {
		rehypePlugins: [rehypeSlug],
	},
	integrations: [mdx({ rehypePlugins: [rehypeSlug] }), sitemap()],
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'ru'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	fonts: [
		// Display: Lora — italic-display serif with real Latin AND Cyrillic italic glyphs.
		// (Newsreader was used here originally but has no Cyrillic at all, so RU headings
		// would silently fall back to a different font and lose italic shapes.)
		{
			provider: fontProviders.google(),
			name: 'Lora',
			cssVariable: '--font-display',
			fallbacks: ['Georgia', 'serif'],
			weights: [400, 500, 600],
			styles: ['normal', 'italic'],
			subsets: ['latin', 'latin-ext', 'cyrillic'],
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-sans',
			fallbacks: ['system-ui', 'sans-serif'],
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext', 'cyrillic'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext', 'cyrillic'],
		},
	],
});
