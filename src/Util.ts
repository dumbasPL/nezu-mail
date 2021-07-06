import {URL} from 'url';

export function getUrl(path: string): string {
  const base = process.env.BASE_URL ?? ( 'http://localhost:' + (process.env.HTTP_PORT ?? 3000) );
  return new URL(path, base).href;
}
