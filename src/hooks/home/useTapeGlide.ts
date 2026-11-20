import { useEffect, useRef, type RefObject } from 'react';
import { clamp, isCalm } from '../../lib/site';

/* The site tapes behind the photo stack unroll with the scroll, one after the other, eased so they glide.
   The scroll is only listened to while the section is on screen; a glide already started finishes off screen. */
export function useTapeGlide(section: RefObject<HTMLElement | null>, tapes: RefObject<HTMLElement | null>, seen: boolean): void {
  const glide = useRef({ cur: 0, to: 0, raf: 0 });

  useEffect(() => {
    const el = section.current;
    const box = tapes.current;
    if (!el || !box) return;
    const bands = [...box.querySelectorAll<HTMLElement>('i')];
    /* html.calm would show them whole and still (site.css), but nothing sets it any more: the same, inline */
    if (isCalm()) {
      bands.forEach((b) => { b.style.clipPath = 'none'; b.style.animation = 'none'; });
      return;
    }
    if (!seen) return;

    const t = glide.current;
    const paint = () => bands.forEach((b, k) => {
      const p = clamp((t.cur - k * 0.2) / 0.6);
      const cut = `${((1 - p) * 100).toFixed(2)}%`;
      b.style.clipPath = k % 2 ? `inset(-20px 0 -20px ${cut})` : `inset(-20px ${cut} -20px 0)`;
    });
    const step = () => {
      t.raf = 0;
      t.cur += (t.to - t.cur) * 0.034;
      if (Math.abs(t.to - t.cur) < 0.0006) t.cur = t.to;
      else t.raf = requestAnimationFrame(step);
      paint();
    };
    const aim = () => {
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      t.to = clamp((vh * 0.9 - r.top) / (r.height * 0.7 + vh * 0.15));
      if (!t.raf && t.cur !== t.to) t.raf = requestAnimationFrame(step);
    };

    let queued = 0;
    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(() => { queued = 0; aim(); });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    aim();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(queued);
    };
  }, [section, tapes, seen]);

  useEffect(() => {
    const t = glide.current;
    return () => { cancelAnimationFrame(t.raf); t.raf = 0; };
  }, []);
}
