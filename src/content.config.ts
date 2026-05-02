import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Posts live in `src/content/blog/<slug>/{en,ru}.{md,mdx}`. The locale is encoded in the
	// filename so post.id ends up like "polynomial-autoencoder/en". Routes filter by suffix.
	loader: glob({ base: './src/content/blog', pattern: '**/{en,ru}.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional(),
			// Drafts are visible in `pnpm dev`, hidden in production builds: no index entry,
			// no post page, no RSS, no sitemap, no OG card. Toggle off (or remove) to publish.
			draft: z.boolean().optional().default(false),
		}),
});

export const collections = { blog };
