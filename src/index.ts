import { FilmyzillaScraper } from "./scraper";

const [maxCategories, maxMovies] = process.argv.slice(2).map(Number);

const scraper = new FilmyzillaScraper();
scraper.run(maxCategories, maxMovies).catch(console.error);
