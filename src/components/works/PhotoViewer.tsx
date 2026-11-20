import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent as ReactTouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { pad2 } from './kinds';

interface Shot {
  readonly href: string;
  readonly cap: string;
  readonly alt: string;
  readonly thumb: string;
}

/* the same links the first site opened full screen; a ring's duplicate faces open their original */
const SHOTS = 'a.tile, a.rc:not([data-dup])';
const OPENERS = 'a.tile, a.rc';

function readShot(a: HTMLAnchorElement): Shot {
  const img = a.querySelector('img');
  return {
    href: a.getAttribute('href') ?? '',
    cap: a.dataset.cap ?? '',
    alt: img?.alt ?? '',
    thumb: img?.dataset.thumb || img?.getAttribute('src') || '',
  };
}

/* Photographs open full screen: arrows, swipe and keys move through the page's photographs, Esc or the cross closes.
   Pages without such photographs get no viewer at all. It is mounted after hydration, so the server markup stays as is. */
export default function PhotoViewer(): ReactNode {
  const [shots, setShots] = useState<readonly Shot[]>([]);
  const [at, setAt] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState('');
  const closeBtn = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const back = useRef<HTMLElement | null>(null);
  const x0 = useRef<number | null>(null);
  const n = shots.length;

  const close = useCallback(() => {
    setOpen(false);
    back.current?.focus();
  }, []);
  const by = useCallback((d: number) => setAt((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(SHOTS)];
    if (!links.length) return;
    setShots(links.map(readShot));
    /* bubbling, so a ring that stops a drag's click or turns a face behind to the front has already had its say */
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>(OPENERS) : null;
      if (!a) return;
      e.preventDefault();
      const dup = a.hasAttribute('data-dup');
      if ((dup || a.closest('.ring')) && !a.classList.contains('front')) return;
      const i = dup ? links.findIndex((s) => s.getAttribute('href') === a.getAttribute('href')) : links.indexOf(a);
      if (i < 0) return;
      /* a duplicate face is hidden from assistive technology, so focus comes back to its ring instead */
      back.current = dup ? a.closest<HTMLElement>('.ring') ?? a : a;
      setAt(i);
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') by(1);
      else if (e.key === 'ArrowLeft') by(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, by]);

  useEffect(() => {
    if (open) thumbs.current[at]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [open, at]);

  if (!n) return null;
  const shot = at < 0 ? undefined : shots[at];

  const onTouchStart = (e: ReactTouchEvent) => {
    x0.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (x0.current === null) return;
    const dx = e.changedTouches[0].clientX - x0.current;
    x0.current = null;
    if (Math.abs(dx) > 50) by(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      className={open ? 'pv on' : 'pv'}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <figure className="pv-fig">
        <img
          src={shot?.href}
          alt={shot?.alt ?? ''}
          className={shot && loaded === shot.href ? 'in' : undefined}
          onLoad={(e) => setLoaded(e.currentTarget.getAttribute('src') ?? '')}
        />
        <figcaption className="pv-cap">
          <span className="pv-t">{shot?.cap}</span>
          <span className="pv-n">{shot && `${pad2(at + 1)} / ${pad2(n)}`}</span>
        </figcaption>
      </figure>
      <div className="pv-thumbs">
        {shots.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Photograph ${i + 1}`}
            className={i === at ? 'on' : undefined}
            ref={(el) => {
              thumbs.current[i] = el;
            }}
            onClick={() => setAt(i)}
          >
            <img alt="" loading="lazy" src={s.thumb} />
          </button>
        ))}
      </div>
      <button type="button" className="pv-x" aria-label="Close" ref={closeBtn} onClick={close}>
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <button type="button" className="pv-p" aria-label="Previous photograph" onClick={() => by(-1)}>
        <svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" className="pv-nx" aria-label="Next photograph" onClick={() => by(1)}>
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </div>,
    document.body,
  );
}
