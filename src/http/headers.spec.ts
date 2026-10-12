import { defaultScraperHeaders } from './headers';

describe('defaultScraperHeaders', () => {
  it('adds referer when provided', () => {
    expect(defaultScraperHeaders('https://ref').referer).toBe('https://ref');
  });
});
