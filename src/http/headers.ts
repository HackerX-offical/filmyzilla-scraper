export function defaultScraperHeaders(referer?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'user-agent':
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  };
  if (referer) headers.referer = referer;
  return headers;
}
