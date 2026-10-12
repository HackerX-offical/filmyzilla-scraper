import { extractYearFromTitle, resolveSiteUrl } from './url';

describe('url helpers', () => {
  it('resolves relative hrefs', () => {
    expect(resolveSiteUrl('/movie/1', 'https://example.com')).toBe('https://example.com/movie/1');
  });

  it('parses year from title', () => {
    expect(extractYearFromTitle('Film (2025)')).toBe('2025');
    expect(extractYearFromTitle('No year')).toBe('');
  });
});
