import { parseCategoryLinks } from './category-links';

describe('parseCategoryLinks', () => {
  it('collects absolute category URLs', () => {
    const html = '<a href="/category/action/">Action</a>';
    const links = parseCategoryLinks(html, 'https://example.com');
    expect(links).toEqual(['https://example.com/category/action/']);
  });
});
