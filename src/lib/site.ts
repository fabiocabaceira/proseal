/* Small helpers shared by every page. Behaviour lives in the components; this is only what several of them need. */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const root = () => document.documentElement;

export const clamp = (v: number) => Math.min(1, Math.max(0, v));

/* the reduce-motion switch left the footer on 19/11, so html.calm is only set by prefers-reduced-motion now */
export const isCalm = () => typeof document !== 'undefined' && (root().classList.contains('calm') || matchMedia('(prefers-reduced-motion: reduce)').matches);

/* save-data or a slow network: the inline script in index.html sets html.lite before anything paints */
export const isLite = () => root().classList.contains('lite');

export const isWide = () => matchMedia('(min-width:900px), (orientation: landscape)').matches;

export function track(event: string, data: Record<string, unknown> = {}) {
  (window.dataLayer ??= []).push({ event, ...data });
}

const store = (box: () => Storage) => ({
  get(key: string): string | null {
    try { return box().getItem(key); } catch { return null; }
  },
  set(key: string, value: string) {
    try { box().setItem(key, value); } catch { /* private mode or storage blocked */ }
  },
});
export const local = store(() => localStorage);
export const session = store(() => sessionStorage);

/* the opening is over: the title shows and the contact capsule comes up. The home page calls it after the weld;
   every other page calls it at once. */
export function finishOpening() {
  root().classList.remove('opening');
  root().classList.add('titled');
  document.getElementById('dock')?.classList.add('show');
}

/* runs cb when the title appears (html.titled), or at once if it already has; returns a cleanup */
export function onTitled(cb: () => void): () => void {
  if (root().classList.contains('titled')) { cb(); return () => {}; }
  const mo = new MutationObserver(() => {
    if (root().classList.contains('titled')) { mo.disconnect(); cb(); }
  });
  mo.observe(root(), { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
}

/* films: the right size for the screen, and none at all on save-data (the poster stays). False when the film stays off. */
export function armFilm(v: HTMLVideoElement): boolean {
  const wide = isWide();
  if (wide && v.dataset.posterWide) v.poster = v.dataset.posterWide;
  if (isLite()) return false;
  if (!v.getAttribute('src')) {
    v.src = (wide && v.dataset.srcWide) || v.dataset.src || '';
    v.preload = 'auto';
  }
  return true;
}
