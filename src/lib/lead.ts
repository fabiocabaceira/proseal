import { useEffect } from 'react';
import { session, track } from './site';

/* lead source: the last contact button pressed travels with the visitor to the quote form, across pages */

const utmSource = (): string | null => new URLSearchParams(location.search).get('utm_source') || session.get('utm');

/* what the quote form sends as its source: "utm:<source> / <last contact button>", or "direct" */
export function readLeadSource(): string {
  const utm = utmSource();
  return [utm && `utm:${utm}`, session.get('cta')].filter(Boolean).join(' / ') || 'direct';
}

export function useLeadSource(): void {
  useEffect(() => {
    const utm = utmSource();
    if (utm) session.set('utm', utm);

    /* capture phase, so a handler that stops the click further down cannot hide it */
    const onClick = (e: MouseEvent) => {
      const button = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cta]') : null;
      if (!button) return;
      const id = button.dataset.cta ?? '';
      track('cta_click', { cta: id });
      if (id !== 'form-send') session.set('cta', id);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}
