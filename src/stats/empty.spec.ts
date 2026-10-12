import { emptyScraperStats } from './empty';

describe('emptyScraperStats', () => {
  it('returns zeroed counters', () => {
    const s = emptyScraperStats();
    expect(s.totalMovies).toBe(0);
    expect(s.movies).toEqual([]);
  });
});
