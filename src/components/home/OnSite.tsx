import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { pad2 } from './ring';

interface Print {
  readonly slug: string;
  readonly alt: string;
  readonly place: string;
  readonly caption: string;
  readonly work: string;
}

const PRINTS = [
  { slug: 'gunwharf-arch', alt: 'Stone arch and repainted iron roof trusses at Gun Wharf', place: 'Gun Wharf', caption: 'The iron roof, restored', work: 'Restoration' },
  { slug: 'lgfs-a', alt: 'New light-gauge steel framing standing inside the Gun Wharf building', place: 'Gun Wharf', caption: 'New light-gauge steel framing', work: 'Steel framing' },
  { slug: 'rock', alt: 'A timber-frame house under scaffolding, with the Rock of Gibraltar behind', place: 'New-build housing', caption: 'Beneath the Rock', work: 'Timber frame' },
  { slug: 'slates', alt: 'A roofer laying slate around roof windows already in place, with the bay behind', place: 'New-build housing', caption: 'Slate laid by hand', work: 'Roofing' },
  { slug: 'site-view', alt: 'A ProSeal housing site seen from above, with the Bay of Gibraltar behind', place: 'New-build housing', caption: 'The site from above', work: 'New-build' },
  { slug: 'frame-1', alt: 'Two timber-frame houses rising inside scaffolding, with a worker on the roof', place: 'New-build housing', caption: 'Timber frames going up', work: 'Timber frame' },
] as const satisfies readonly Print[];

const COUNT = PRINTS.length;
const ARROW = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const clampTo = (v: number, max: number) => Math.min(max, Math.max(0, v));

interface Drag {
  readonly id: number;
  readonly x0: number;
  readonly y0: number;
  on: boolean;
  lastX: number;
  lastT: number;
  v: number;
}

/* The prints sit whole inside the frame: one on a phone, two or three on wider screens. The row slides under the arrows,
   the keys, a drag or a swipe, and settles on the nearest print. The current print carries the count and the ruled caption. */
export default function OnSite() {
  const view = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const drag = useRef<Drag | null>(null);
  const [active, setActive] = useState(0);
  const [fit, setFit] = useState({ step: 0, perView: 1 });

  const max = COUNT - fit.perView;
  const offset = Math.min(active, max);

  const place = (x: number) => {
    if (row.current) row.current.style.transform = `translate3d(${x}px,0,0)`;
  };

  useEffect(() => {
    const vp = view.current;
    const el = row.current;
    if (!vp || !el) return;
    const measure = () => {
      const first = el.firstElementChild;
      if (!(first instanceof HTMLElement)) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const step = first.getBoundingClientRect().width + gap;
      setFit({ step, perView: Math.max(1, Math.round((vp.clientWidth + gap) / step)) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  useEffect(() => place(-offset * fit.step), [offset, fit.step]);

  const go = (to: number) => setActive(clampTo(to, COUNT - 1));

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !fit.step) return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, on: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.on) {
      if (Math.abs(e.clientY - d.y0) > 10 && Math.abs(e.clientY - d.y0) > Math.abs(dx)) { drag.current = null; return; }
      if (Math.abs(dx) < 6) return;
      d.on = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      row.current?.classList.add('is-drag');
    }
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    const min = -max * fit.step;
    let x = -offset * fit.step + dx;
    if (x > 0) x *= 0.3;
    else if (x < min) x = min + (x - min) * 0.3;
    place(x);
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.on) return;
    row.current?.classList.remove('is-drag');
    /* a drag ends with a click on the print under the pointer; it must not open the photograph */
    const swallow = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault(); };
    window.addEventListener('click', swallow, { capture: true, once: true });
    setTimeout(() => window.removeEventListener('click', swallow, true), 0);
    const dx = e.clientX - d.x0;
    let shift = Math.round(-dx / fit.step);
    if (shift === 0 && (Math.abs(d.v) > 0.35 || Math.abs(dx) > fit.step * 0.18)) shift = dx < 0 ? 1 : -1;
    const target = offset + shift;
    if (shift > 0 && target > max) go(active + shift);
    else if (shift !== 0) go(clampTo(target, max));
    place(-Math.min(shift ? clampTo(target, max) : offset, max) * fit.step);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  return (
    <section className="works" id="works">
      <p className="works-k">
        <span>From our own sites</span>
        <span>Gibraltar</span>
      </p>
      <div className="works-head">
        <h2 className="h">
          On{" "}
          <em>site.</em>
        </h2>
        <div className="works-copy">
          <p className="works-p">Photographed on our own sites across Gibraltar, <span>while the work is under way.</span></p>
        </div>
      </div>
      <div className="os" role="region" aria-roledescription="carousel" aria-label="Photographs from our sites">
        <div className="os-view" ref={view} tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
          <ul className="os-row" ref={row}>
            {PRINTS.map((p, k) => (
              <li key={p.slug} className={k === active ? 'os-i is-on' : 'os-i'} aria-roledescription="slide" aria-label={`${k + 1} of ${COUNT}`}>
                <a href={`img/${p.slug}-1600.webp`} className="card os-card" draggable={false} onFocus={() => (k < offset || k >= offset + fit.perView) && go(k)}>
                  <span className="os-img">
                    <img src={`img/${p.slug}-480.webp`} srcSet={`img/${p.slug}-480.webp 480w, img/${p.slug}-900.webp 900w, img/${p.slug}-1600.webp 1600w`} sizes="(min-width:900px) 31vw, 90vw" alt={p.alt} loading="lazy" decoding="async" draggable={false} />
                  </span>
                  <span className="os-t">
                    <span className="os-n">{pad2(k + 1)}</span>
                    <span>
                      <b>{p.place}</b>
                      <span className="card-l">{p.caption}</span>
                    </span>
                    <span className="os-w">{p.work}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="os-nav">
          <p className="os-count" aria-live="polite"><b>{pad2(active + 1)}</b>{` / ${pad2(COUNT)}`}</p>
          <span className="os-bar" aria-hidden="true"><i style={{ transform: `scaleX(${(active + 1) / COUNT})` }} /></span>
          <button type="button" className="os-prev" aria-label="Previous photograph" disabled={active === 0} onClick={() => go(active - 1)}>{ARROW}</button>
          <button type="button" className="os-next" aria-label="Next photograph" disabled={active === COUNT - 1} onClick={() => go(active + 1)}>{ARROW}</button>
          <a className="pill dark os-all" href="works.html" data-cta="home-works">
            See all our projects
            {ARROW}
          </a>
        </div>
      </div>
    </section>
  );
}
