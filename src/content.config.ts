import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum([
      'Preparation',
      'Safety',
      'Microdosing',
      'Integration',
      'Science',
      'Navigation',
      'Community',
    ]),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    author: z.string().default('HTUP'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
