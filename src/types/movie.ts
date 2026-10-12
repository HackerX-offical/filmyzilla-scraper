export interface DownloadLink {
  quality: string;
  format: string;
  size: string;
  serverUrl: string;
  downloadUrl: string;
}

export interface Movie {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
  year: string;
  description: string;
  links: DownloadLink[];
}
