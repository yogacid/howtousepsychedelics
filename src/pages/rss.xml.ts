import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'How to Use Psychedelics — Articles',
    description:
      'Practical guides, harm reduction insights, and grounded perspectives on psychedelic preparation, safety, and integration.',
    site: context.site ?? 'https://howtousepsychedelics.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: '<language>en</language>',
  });
}
