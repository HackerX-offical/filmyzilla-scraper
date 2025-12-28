# Filmyzilla Scraper

Web scraper for Filmyzilla that extracts movie data and download links.

## Installation

```bash
npm install
```

## Usage

```bash
# Scrape all categories and movies
npm start

# Scrape specific number of categories and movies
npm start 5 20

# Test with 1 category, 2 movies
npm run test
```

## Output

Data is saved to `output/filmyzilla_data.json`:

```json
{
  "totalMovies": 100,
  "totalCategories": 10,
  "totalLinks": 400,
  "categories": ["bollywood", "hollywood", "..."],
  "movies": [
    {
      "id": "21017",
      "title": "Movie Name (2025)",
      "url": "https://...",
      "thumbnail": "https://...",
      "category": "bollywood",
      "year": "2025",
      "description": "...",
      "links": [
        {
          "quality": "1080p",
          "format": "mkv",
          "size": "2.38 GB",
          "serverUrl": "https://...",
          "downloadUrl": "https://..."
        }
      ]
    }
  ]
}
```

## Features

- Automatic category discovery
- Progress saving and resume capability
- Two-step download URL extraction
- Error handling and retry logic
- Rate limiting
