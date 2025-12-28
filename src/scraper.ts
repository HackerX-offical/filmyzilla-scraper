import * as cheerio from "cheerio";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";

interface DownloadLink {
  quality: string;
  format: string;
  size: string;
  serverUrl: string;
  downloadUrl: string;
}

interface Movie {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
  year: string;
  description: string;
  links: DownloadLink[];
}

interface ScraperStats {
  totalMovies: number;
  totalCategories: number;
  totalLinks: number;
  categories: string[];
  movies: Movie[];
}

export class FilmyzillaScraper {
  private baseUrl = "https://www.filmyzilla28.com";
  private processedUrls = new Set<string>();
  private movies: Movie[] = [];

  private async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetch(url: string, referer?: string) {
    const headers: Record<string, string> = {
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    };

    if (referer) headers["referer"] = referer;

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }

  private async getCategories() {
    const html = await this.fetch(this.baseUrl);
    const $ = cheerio.load(html);
    const categories: string[] = [];

    $('a[href*="/category/"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href && !categories.includes(href)) {
        categories.push(href.startsWith("http") ? href : this.baseUrl + href);
      }
    });

    return categories;
  }

  private async getMovieLinks(categoryUrl: string) {
    const html = await this.fetch(categoryUrl);
    const $ = cheerio.load(html);
    const links: string[] = [];

    $('a[href*="/movie/"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        const url = href.startsWith("http") ? href : this.baseUrl + href;
        if (!links.includes(url)) links.push(url);
      }
    });

    return links;
  }

  private async getDownloadUrl(serverUrl: string, referer: string) {
    try {
      const html = await this.fetch(serverUrl, referer);
      const $ = cheerio.load(html);

      const link = $('a[href*="/downloads/"]').first().attr("href");
      if (link) return link.startsWith("http") ? link : this.baseUrl + link;

      return "NOT_FOUND";
    } catch {
      return "ERROR";
    }
  }

  private async scrapeMovie(url: string, category: string) {
    if (this.processedUrls.has(url)) return null;
    this.processedUrls.add(url);

    try {
      const html = await this.fetch(url);
      const $ = cheerio.load(html);

      let title = $('a[href*="/movie/"]').last().text().trim();
      if (!title || title === "FilmyZilla.Com") {
        const serverLink = $('a[href*="/server/"]').first().text();
        const match = serverLink.match(/^(.+?)\s+\d+p/i);
        if (match) title = match[1].trim();
      }

      const id = url.match(/\/movie\/(\d+)\//)?.[1] || "";
      const year = title.match(/(\d{4})/)?.[1] || "";
      const thumbnail = $('img[src*="poster"]').first().attr("src") || "";
      const description = $('meta[name="description"]').attr("content") || "";

      const links: DownloadLink[] = [];
      const serverLinks = $('a[href*="/server/"]');

      for (let i = 0; i < serverLinks.length; i++) {
        const link = serverLinks.eq(i);
        const serverUrl = link.attr("href");
        if (!serverUrl) continue;

        const fullUrl = serverUrl.startsWith("http")
          ? serverUrl
          : this.baseUrl + serverUrl;
        const text = link.text();
        const sizeText = link.parent().find("small, span").text();

        const quality = text.match(/(\d+p|HEVC|HD|HDTC)/i)?.[1] || "Unknown";
        const format =
          text.match(/\.(mkv|mp4|avi)/i)?.[1]?.toLowerCase() || "mkv";
        const size =
          sizeText.match(/(\d+(?:\.\d+)?)\s*(GB|MB)/i)?.[0] || "Unknown";

        const downloadUrl = await this.getDownloadUrl(fullUrl, url);

        links.push({ quality, format, size, serverUrl: fullUrl, downloadUrl });
        await this.wait(1000);
      }

      return { id, title, url, thumbnail, category, year, description, links };
    } catch (err) {
      console.error(`Failed to scrape ${url}:`, err);
      return null;
    }
  }

  async run(maxCategories?: number, maxMovies?: number) {
    console.log("Starting scraper...\n");

    await mkdir("./output", { recursive: true });

    try {
      const progress = await readFile("./output/progress.json", "utf-8");
      const data = JSON.parse(progress);
      this.movies = data.movies;
      data.movies.forEach((m: Movie) => this.processedUrls.add(m.url));
      console.log(`Resumed: ${this.movies.length} movies already scraped\n`);
    } catch {
      console.log("Starting fresh scrape\n");
    }

    const categories = await this.getCategories();
    console.log(`Found ${categories.length} categories\n`);

    const selectedCategories = maxCategories
      ? categories.slice(0, maxCategories)
      : categories;

    for (let i = 0; i < selectedCategories.length; i++) {
      const categoryUrl = selectedCategories[i];
      const categoryName = categoryUrl.split("/").pop() || "unknown";

      console.log(`[${i + 1}/${selectedCategories.length}] ${categoryName}`);

      const movieLinks = await this.getMovieLinks(categoryUrl);
      const selected = maxMovies ? movieLinks.slice(0, maxMovies) : movieLinks;

      for (let j = 0; j < selected.length; j++) {
        console.log(`  [${j + 1}/${selected.length}] Scraping...`);

        const movie = await this.scrapeMovie(selected[j], categoryName);
        if (movie) {
          this.movies.push(movie);
          console.log(`    ${movie.title} (${movie.links.length} links)`);

          if (this.movies.length % 5 === 0) {
            await this.save("progress.json");
          }
        }

        await this.wait(2000);
      }

      await this.wait(3000);
    }

    await this.save("filmyzilla_data.json");

    console.log(`\nDone! Scraped ${this.movies.length} movies`);
    console.log(`Output: ./output/filmyzilla_data.json`);
  }

  private async save(filename: string) {
    const categories = [...new Set(this.movies.map((m) => m.category))];
    const totalLinks = this.movies.reduce((sum, m) => sum + m.links.length, 0);

    const data: ScraperStats = {
      totalMovies: this.movies.length,
      totalCategories: categories.length,
      totalLinks,
      categories,
      movies: this.movies,
    };

    await writeFile(join("./output", filename), JSON.stringify(data, null, 2));
  }
}
