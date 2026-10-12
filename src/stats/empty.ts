import { Movie } from '../types/movie';

export function emptyScraperStats(): {
  totalMovies: number;
  totalCategories: number;
  totalLinks: number;
  categories: string[];
  movies: Movie[];
} {
  return {
    totalMovies: 0,
    totalCategories: 0,
    totalLinks: 0,
    categories: [],
    movies: [],
  };
}
