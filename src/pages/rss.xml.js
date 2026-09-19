import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

function toSlug(pubDate, title) {
	const year = pubDate.getFullYear();
	const month = String(pubDate.getMonth() + 1).padStart(2, '0');
	const day = String(pubDate.getDate()).padStart(2, '0');
	const safeTitle = title.replace(/[?#%]/g, (ch) => encodeURIComponent(ch));
	return `/${year}/${month}/${day}/${safeTitle}/`;
}

export async function GET(context) {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: toSlug(post.data.pubDate, post.data.title),
		})),
	});
}
