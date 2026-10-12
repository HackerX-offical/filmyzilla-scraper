import * as cheerio from 'cheerio';
import { resolveSiteUrl } from '../url';

export function parseCategoryLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const categories: string[] = [];
  $('a[href*="/category/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const url = resolveSiteUrl(href, baseUrl);
    if (!categories.includes(url)) categories.push(url);
  });
  return categories;
}
