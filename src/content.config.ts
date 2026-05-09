import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    url: z.string().url(),
    tags: z.array(z.string()),
    category: z.string(),
    featured: z.boolean(),
    order: z.number(),
    heroMetric: z.string(),
    progress: z.number().min(0).max(100),
  }),
});

export const collections = { projects };
