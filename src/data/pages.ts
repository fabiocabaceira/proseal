import head from './head.json';

export type PageKey = 'index' | 'works' | 'how' | 'quote' | 'careers';

export interface HeadTag {
  tag: string;
  attrs: Record<string, string>;
}

export interface PageHead {
  bodyClass: string;
  title: string;
  head: HeadTag[];
}

/* the first four pages keep the file names of the first site, so every link already shared still works */
export const PAGE_FILES: Record<PageKey, string> = {
  index: 'index.html',
  works: 'works.html',
  how: 'how.html',
  quote: 'quote.html',
  careers: 'careers.html',
};

export const PAGE_HEAD = head as unknown as Record<PageKey, PageHead>;

export function pageFromPath(pathname: string): PageKey {
  const name = (pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  return name in PAGE_FILES ? (name as PageKey) : 'index';
}
