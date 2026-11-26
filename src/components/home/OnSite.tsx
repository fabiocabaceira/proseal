import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView } from '../../hooks/home/useInView';
import { useTapeGlide } from '../../hooks/home/useTapeGlide';
import { ringOffset, wrapIndex } from './ring';

interface Print {
  readonly slug: string;
  readonly alt: string;
  readonly place: string;
  readonly caption: string;
}

const PRINTS = [
  { slug: 'gunwharf-arch', alt: 'Stone arch and repainted iron roof trusses at Gun Wharf', place: 'Gun Wharf', caption: 'The iron roof, restored' },
  { slug: 'lgfs-a', alt: 'New light-gauge steel framing standing inside the Gun Wharf building', place: 'Gun Wharf', caption: 'New light-gauge steel framing' },
  { slug: 'rock', alt: 'A timber-frame house under scaffolding, with the Rock of Gibraltar behind', place: 'New-build housing', caption: 'Beneath the Rock' },
  { slug: 'slates', alt: 'A roofer laying slate around roof windows already in place, with the bay behind', place: 'New-build housing', caption: 'Slate laid by hand' },
  { slug: 'site-view', alt: 'A ProSeal housing site seen from above, with the Bay of Gibraltar behind', place: 'New-build housing', caption: 'The site from above' },
  { slug: 'frame-1', alt: 'Two timber-frame houses rising inside scaffolding, with a worker on the roof', place: 'New-build housing', caption: 'Timber frames going up' },
] as const satisfies readonly Print[];

const COUNT = PRINTS.length;
const ARROW = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

type CardVars = CSSProperties & Record<`--${string}`, string>;

/* one print in front, the rest fanned behind it: read by the .fan-card rule in site.css */
function fanned(rel: number, spread: number): CardVars {
  const a = Math.abs(rel);
  return {
    '--x': `${(rel * spread * (1 - a * 0.07)).toFixed(1)}px`,
    '--y': `${a * 12}px`,
    '--r': `${rel * 4.5}deg`,
    '--s': (1 - a * 0.1).toFixed(3),
    '--z': String(20 - a * 2 - (rel < 0 ? 1 : 0)),
    '--o': a > 2.5 ? '0' : '1',
    '--dim': String(Math.min(1, a * 0.5)),
    pointerEvents: a > 2.5 ? 'none' : undefined,
  };
}

/* Pointing at a print behind lifts it; pressing it, the arrows, the keys or a swipe bring another to the front. */
export default function OnSite() {
  const section = useRef<HTMLElement>(null);
  const tapes = useRef<HTMLDivElement>(null);
  const firstCard = useRef<HTMLLIElement>(null);
  const touchX = useRef<number | null>(null);
  const [cur, setCur] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);
  /* how far apart the prints stand, from the width of a print; unknown until it can be measured */
  const [spread, setSpread] = useState<number | null>(null);
  const seen = useInView(section, 0);
  useTapeGlide(section, tapes, seen);

  useEffect(() => {
    const measure = () => {
      const w = firstCard.current?.offsetWidth ?? 0;
      setSpread(w * (matchMedia('(min-width:900px)').matches ? 0.5 : 0.3));
    };
    measure();
    addEventListener('resize', measure);
    return () => removeEventListener('resize', measure);
  }, []);

  const go = (i: number) => {
    setCur(wrapIndex(i, COUNT));
    setLifted(null);
  };

  return (
    <section className={seen ? 'works seen' : 'works'} id="works" ref={section}>
      <div className="tapes" aria-hidden="true" ref={tapes}>
        <i />
        <i />
        <i />
      </div>
      <div className="works-copy">
        <h2 className="h">
          On{" "}
          <em>site.</em>
        </h2>
        <p className="works-p">Every photograph here was taken on one of our own sites in Gibraltar.</p>
        <p className="fan-nav">
          <button type="button" className="fan-prev" aria-label="Previous photograph" onClick={() => go(cur - 1)}>{ARROW}</button>
          <span className="fan-count" aria-live="polite">{`${cur + 1} / ${COUNT}`}</span>
          <button type="button" className="fan-next" aria-label="Next photograph" onClick={() => go(cur + 1)}>{ARROW}</button>
        </p>
        <p><a className="line" href="works.html" data-cta="home-works">See all our projects</a></p>
      </div>
      <div
        className="fan"
        id="fan"
        tabIndex={0}
        aria-label="Photographs from our sites"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
        }}
      >
        <ul
          className="fan-stage"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const x0 = touchX.current;
            if (x0 === null) return;
            touchX.current = null;
            const dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 36) go(cur + (dx < 0 ? 1 : -1));
          }}
        >
          {PRINTS.map((p, k) => {
            const rel = ringOffset(k, cur, COUNT);
            const front = spread !== null && rel === 0;
            return (
              <li
                key={p.slug}
                ref={k === 0 ? firstCard : undefined}
                className={`fan-card${front ? ' front' : ''}${lifted === k ? ' up' : ''}`}
                style={spread === null ? undefined : fanned(rel, spread)}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse' && k !== cur) setLifted(k); }}
                onPointerLeave={() => setLifted((l) => (l === k ? null : l))}
                onClickCapture={(e) => {
                  /* a print behind comes to the front; only the front one goes on to open large (Lightbox) */
                  if (k === cur) return;
                  e.preventDefault();
                  e.stopPropagation();
                  go(k);
                }}
              >
                <a href={`img/${p.slug}-1600.webp`} className="card">
                  <img src={`img/${p.slug}-480.webp`} srcSet={`img/${p.slug}-480.webp 480w, img/${p.slug}-900.webp 900w`} sizes="(min-width:900px) 300px, 60vw" alt={p.alt} loading="lazy" decoding="async" />
                  <span className="fan-t">
                    <b>{p.place}</b>
                    <span className="card-l">{p.caption}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
