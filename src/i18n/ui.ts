export const languages = {
	en: 'EN',
	ru: 'RU',
} as const;

export const defaultLang: Lang = 'en';

export type Lang = 'en' | 'ru';

export const ui = {
	en: {
		'nav.home': 'Home',
		'nav.blog': 'Blog',
		'nav.about': 'About',
		'theme.toggle': 'Toggle theme',
		'lang.switch': 'Switch language',
	},
	ru: {
		'nav.home': 'Главная',
		'nav.blog': 'Блог',
		'nav.about': 'Обо мне',
		'theme.toggle': 'Сменить тему',
		'lang.switch': 'Сменить язык',
	},
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function getLangFromUrl(url: URL): Lang {
	const [, prefix] = url.pathname.split('/');
	if (prefix === 'ru') return 'ru';
	return defaultLang;
}

export function useTranslations(lang: Lang) {
	return function t(key: UIKey): string {
		return ui[lang][key] ?? ui[defaultLang][key];
	};
}

export function getAlternateLocale(pathname: string): { lang: Lang; href: string } {
	const isRu = pathname === '/ru' || pathname === '/ru/' || pathname.startsWith('/ru/');
	if (isRu) {
		const stripped = pathname.replace(/^\/ru/, '');
		return { lang: 'en', href: stripped === '' ? '/' : stripped };
	}
	return { lang: 'ru', href: pathname === '/' ? '/ru/' : `/ru${pathname}` };
}
