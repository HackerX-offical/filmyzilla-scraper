# filmyzilla-scraper

Resumable TypeScript scraper for Filmyzilla category and movie listings.

## Why this exists

Media index sites change markup often; this scraper captures listing metadata to JSON for authorized
research and archival workflows.

## Features

- Cheerio-based HTML parsing with year/URL helpers
- Checkpoint-friendly JSON output
- Jest unit tests on URL utilities

## Install

```bash
git clone https://github.com/HackerX-offical/filmyzilla-scraper.git
cd filmyzilla-scraper
npm install
```

## Quick start

```bash
npm start
```

## Output

JSON files under the configured output directory with movie titles, links, and scrape metadata.

## Develop

```bash
npm test
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See [SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright, license
text, and [NOTICE](./NOTICE) attribution per the license terms.
