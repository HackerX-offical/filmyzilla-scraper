import { parseMovieLinks } from './movie-links';

describe('parseMovieLinks', () => {
  it('deduplicates movie pages', () => {
    const html = `
      <a href="/movie/one/">One</a>
      <a href="/movie/one/">Dup</a>
    `;
    expect(parseMovieLinks(html, 'https://x.com')).toHaveLength(1);
  });
});
