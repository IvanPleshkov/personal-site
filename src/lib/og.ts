import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const FONT_CACHE = join(process.cwd(), 'node_modules', '.cache', 'og-fonts');
// Older Android UA convinces googleapis to send TTF instead of WOFF2 — satori needs TTF/OTF.
const TTF_UA =
	'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';

async function fetchGoogleFontTTF(family: string, weight: number, italic = false): Promise<Buffer> {
	const fileName = `${family.replace(/\s+/g, '-')}-${weight}${italic ? '-italic' : ''}.ttf`;
	const cachePath = join(FONT_CACHE, fileName);
	try {
		return await readFile(cachePath);
	} catch {
		// fall through to fetch
	}
	const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${italic ? 1 : 0},${weight}&display=swap`;
	const css = await fetch(cssUrl, { headers: { 'User-Agent': TTF_UA } }).then((r) => r.text());
	const ttfUrl = css.match(/url\(([^)]+\.ttf)\)/)?.[1];
	if (!ttfUrl) {
		throw new Error(
			`Could not extract TTF URL from Google Fonts CSS for ${family} ${weight}${italic ? ' italic' : ''}. Got: ${css.slice(0, 200)}`,
		);
	}
	const ttf = Buffer.from(await fetch(ttfUrl).then((r) => r.arrayBuffer()));
	await mkdir(FONT_CACHE, { recursive: true });
	await writeFile(cachePath, ttf);
	return ttf;
}

let cachedFonts: Awaited<ReturnType<typeof loadFonts>> | null = null;
async function loadFonts() {
	if (cachedFonts) return cachedFonts;
	const [serifItalic, monoMedium] = await Promise.all([
		fetchGoogleFontTTF('Newsreader', 400, true),
		fetchGoogleFontTTF('JetBrains Mono', 500, false),
	]);
	cachedFonts = [
		{ name: 'Newsreader', data: serifItalic, weight: 400 as const, style: 'italic' as const },
		{ name: 'JetBrains Mono', data: monoMedium, weight: 500 as const, style: 'normal' as const },
	];
	return cachedFonts;
}

export interface OGOptions {
	eyebrow: string;
	title: string;
	footer?: string;
}

const COLORS = {
	bg: '#e8ecee',
	rule: '#c5ccd1',
	text: '#16202a',
	muted: '#5b6772',
	subtle: '#9aa3ac',
	accent: '#8e5a3e',
	accentSoft: '#e3d4ca',
};

function buildTree({ eyebrow, title, footer }: OGOptions): Parameters<typeof satori>[0] {
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				padding: 80,
				backgroundColor: COLORS.bg,
				fontFamily: 'JetBrains Mono',
				color: COLORS.text,
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							fontSize: 22,
							color: COLORS.muted,
							letterSpacing: '0.04em',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										width: 28,
										height: 28,
										borderRadius: 999,
										backgroundColor: COLORS.accentSoft,
										alignItems: 'center',
										justifyContent: 'center',
									},
									children: {
										type: 'div',
										props: {
											style: {
												width: 12,
												height: 12,
												borderRadius: 999,
												backgroundColor: COLORS.accent,
											},
										},
									},
								},
							},
							{ type: 'div', props: { children: eyebrow } },
						],
					},
				},
				{ type: 'div', props: { style: { display: 'flex', flex: 1 } } },
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontFamily: 'Newsreader',
							fontStyle: 'italic',
							fontSize: 110,
							lineHeight: 1.05,
							color: COLORS.text,
							letterSpacing: '-0.02em',
							maxWidth: 1040,
						},
						children: title,
					},
				},
				{ type: 'div', props: { style: { display: 'flex', flex: 1 } } },
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							paddingTop: 24,
							borderTop: `1px solid ${COLORS.rule}`,
							fontSize: 24,
							color: COLORS.muted,
						},
						children: [
							{ type: 'div', props: { children: 'ivanpleshkov.dev' } },
							...(footer
								? [
										{
											type: 'div',
											props: { style: { color: COLORS.subtle }, children: '·' },
										},
										{ type: 'div', props: { children: footer } },
									]
								: []),
						],
					},
				},
			],
		},
	};
}

export async function renderOG(opts: OGOptions): Promise<Buffer> {
	const fonts = await loadFonts();
	const svg = await satori(buildTree(opts), {
		width: 1200,
		height: 630,
		fonts,
	});
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
	return png;
}
