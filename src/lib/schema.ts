import { SOCIAL_LINKS } from '../consts';

export const SITE_URL = 'https://ivanpleshkov.dev';
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
	return {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: 'Ivan Pleshkov',
		alternateName: 'Иван Плешков',
		givenName: 'Ivan',
		familyName: 'Pleshkov',
		url: SITE_URL,
		image: `${SITE_URL}/og.png`,
		jobTitle: 'Software Engineer',
		description:
			'Software engineer at Qdrant working on the open-source vector search engine. Built GPU-accelerated HNSW indexing in Rust. Background in graphics engines, virtual reality, and computer vision (Wargaming, Eagle Dynamics).',
		worksFor: {
			'@type': 'Organization',
			name: 'Qdrant',
			url: 'https://qdrant.tech',
		},
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Magdeburg',
			addressCountry: 'DE',
		},
		alumniOf: {
			'@type': 'CollegeOrUniversity',
			name: 'Belarusian State University',
			url: 'https://bsu.by',
		},
		knowsAbout: [
			'Rust programming language',
			'GPU computing',
			'Vector search',
			'Approximate nearest neighbor search',
			'HNSW algorithm',
			'Real-time graphics',
			'Graphics engines',
			'Computer vision',
			'WebAssembly',
			'C++',
		],
		sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.telegram],
		email: SOCIAL_LINKS.email,
		knowsLanguage: ['en', 'ru'],
	};
}

export function websiteSchema() {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: SITE_URL,
		name: 'Ivan Pleshkov',
		description:
			'Software engineer at Qdrant — bringing GPU tricks from graphics engines into vector search.',
		author: { '@id': PERSON_ID },
		publisher: { '@id': PERSON_ID },
		inLanguage: ['en', 'ru'],
	};
}

export function profilePageSchema(pageUrl: string) {
	return {
		'@type': 'ProfilePage',
		'@id': `${pageUrl}#profile`,
		url: pageUrl,
		mainEntity: { '@id': PERSON_ID },
		about: { '@id': PERSON_ID },
		isPartOf: { '@id': WEBSITE_ID },
	};
}

export interface BlogPostingInput {
	pageUrl: string;
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	imageUrl?: string;
	keywords?: string[];
}

export function blogPostingSchema(input: BlogPostingInput) {
	const { pageUrl, title, description, pubDate, updatedDate, imageUrl, keywords } = input;
	return {
		'@type': 'BlogPosting',
		'@id': `${pageUrl}#post`,
		url: pageUrl,
		mainEntityOfPage: pageUrl,
		headline: title,
		description,
		datePublished: pubDate.toISOString(),
		dateModified: (updatedDate ?? pubDate).toISOString(),
		author: { '@id': PERSON_ID },
		publisher: { '@id': PERSON_ID },
		isPartOf: { '@id': WEBSITE_ID },
		...(imageUrl ? { image: imageUrl } : {}),
		...(keywords?.length ? { keywords } : {}),
		inLanguage: 'en',
	};
}

export function buildGraph(...nodes: object[]) {
	return {
		'@context': 'https://schema.org',
		'@graph': [personSchema(), websiteSchema(), ...nodes],
	};
}
