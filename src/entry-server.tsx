import { renderToString } from 'react-dom/server';
import App from './App';
import type { PageKey } from './data/pages';

export { PAGE_FILES, PAGE_HEAD } from './data/pages';

/* Runs in Node at build time, once per page (tools/prerender.mjs). */
export function render(page: PageKey): string {
  return renderToString(<App page={page} />);
}
