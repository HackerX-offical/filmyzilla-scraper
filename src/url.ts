export function resolveSiteUrl(href: string, baseUrl: string): string {
  if (href.startsWith('http')) return href;
  return baseUrl + href;
}

export function extractYearFromTitle(title: string): string {
  const match = title.match(/\((\d{4})\)/);
  return match ? match[1] : '';
}
