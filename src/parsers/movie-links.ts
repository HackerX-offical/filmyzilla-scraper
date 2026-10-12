import * as cheerio from 'cheerio';
import { resolveSiteUrl } from '../url';

export function parseMovieLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links: string[] = [];
  $('a[href*="/movie/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const url = resolveSiteUrl(href, baseUrl);
    if (!links.includes(url)) links.push(url);
  });
  return links;
}
