import { useRef, useState, type KeyboardEvent } from 'react';
import { pad2 } from './ring';
import { FactSheet } from '../works/Facts';

interface Print {
  readonly slug: string;
  readonly alt: string;
  readonly place: string;
  readonly caption: string;
  readonly work: string;
  readonly where: string;
  readonly href: string;
}

const PRINTS = [
  { slug: 'gunwharf-arch', alt: 'Stone arch and repainted iron roof trusses at Gun Wharf', place: 'Gun Wharf', caption: 'The iron roof, restored', work: 'Restoration', where: 'HM Naval Base', href: 'works.html#gun-wharf' },
  { slug: 'lgfs-a', alt: 'New light-gauge steel framing standing inside the Gun Wharf building', place: 'Gun Wharf', caption: 'New light-gauge steel framing', work: 'Steel framing', where: 'HM Naval Base', href: 'works.html#gun-wharf' },
  { slug: 'rock', alt: 'A timber-frame house under scaffolding, with the Rock of Gibraltar behind', place: 'New-build housing', caption: 'Beneath the Rock', work: 'Timber frame', where: 'Gibraltar', href: 'works.html#new-build-housing' },
  { slug: 'slates', alt: 'A roofer laying slate around roof windows already in place, with the bay behind', place: 'Roofing', caption: 'Slate laid by hand', work: 'Roofing', where: 'Gibraltar', href: 'works.html#roofing' },
  { slug: 'site-view', alt: 'A ProSeal housing site seen from above, with the Bay of Gibraltar behind', place: 'New-build housing', caption: 'The site from above', work: 'New build', where: 'Gibraltar', href: 'works.html#new-build-housing' },
  { slug: 'frame-1', alt: 'Two timber-frame houses rising inside scaffolding, with a worker on the roof', place: 'New-build housing', caption: 'Timber frames going up', work: 'Timber frame', where: 'Gibraltar', href: 'works.html#new-build-housing' },
] as const satisfies readonly Print[];

const COUNT = PRINTS.length;
const ARROW = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const clampTo = (v: number, max: number) => Math.min(max, Math.max(0, v));

/* On site, set like a monograph spread: one photograph large, its title block beside it (number, project, what it shows,
   the work and where), and the whole set below as an index of thumbnails. Swipe or scroll the photograph, use the arrows,
   or pick a thumbnail. On phones the project's name sits over the bottom of the photograph instead. */
export default function OnSite() {
  const row = useRef<HTMLUListElement>(null);
  const aim = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const p = PRINTS[active];

  const onScroll = () => {
    const el = row.current;
    if (!el || !el.clientWidth) return;
    const at = clampTo(Math.round(el.scrollLeft / el.clientWidth), COUNT - 1);
    if (aim.current !== null) {
      if (at === aim.current) aim.current = null;
      return;
    }
    setActive(at);
  };

  const go = (to: number) => {
    const el = row.current;
    if (!el) return;
    const k = clampTo(to, COUNT - 1);
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('calm');
    aim.current = k;
    window.setTimeout(() => { if (aim.current === k) aim.current = null; }, 1200);
    el.scrollTo({ left: k * el.clientWidth, behavior: calm ? 'auto' : 'smooth' });
    setActive(k);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
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
      <div className="os ox" role="region" aria-roledescription="carousel" aria-label="Photographs from our sites">
        <div className="ox-stage">
          <ul className="ox-row" ref={row} onScroll={onScroll} onKeyDown={onKeyDown} tabIndex={0}>
            {PRINTS.map((q, k) => (
              <li className="ox-i" key={q.slug} aria-roledescription="slide" aria-label={`${k + 1} of ${COUNT}`}>
                <a className="ox-img" href={q.href} draggable={false} tabIndex={k === active ? 0 : -1} data-cta="home-onsite">
                  <img src={`img/${q.slug}-900.webp`} srcSet={`img/${q.slug}-480.webp 480w, img/${q.slug}-900.webp 900w, img/${q.slug}-1600.webp 1600w`} sizes="(min-width:900px) 520px, 92vw" alt={q.alt} loading={k === 0 ? undefined : 'lazy'} decoding="async" draggable={false} />
                  <span className="ox-cover" aria-hidden="true">
                    <span className="ox-cover-k">{`${pad2(k + 1)} · ${q.work}`}</span>
                    <span className="ox-cover-n">{q.place}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <i className="cm tl" aria-hidden="true" />
          <i className="cm tr" aria-hidden="true" />
          <i className="cm bl" aria-hidden="true" />
          <i className="cm br" aria-hidden="true" />
        </div>
        {/* on phones the section's lead line moves here, into the room beside the thumbnails (the one above is hidden there) */}
        <p className="ox-note">Photographed on our own sites across Gibraltar, <span>while the work is under way.</span></p>
        <div className="ox-side">
          <div className="ox-block" key={active} aria-live="polite">
            <p className="ox-k">
              <span>Photograph</span>
              <span><b>{pad2(active + 1)}</b>{` / ${pad2(COUNT)}`}</span>
            </p>
            <h3 className="ox-name">{p.place}</h3>
            <p className="ox-cap">{p.caption}</p>
            <FactSheet facts={[{ icon: 'tools', label: 'Our work', value: p.work }, { icon: 'pin', label: 'Location', value: p.where }]} name={p.place} />
            <a className="line ox-go" href={p.href} data-cta="home-onsite-project">View the project</a>
          </div>
          <div className="ox-foot">
            <ol className="ox-index" aria-label="All photographs">
              {PRINTS.map((q, k) => (
                <li key={q.slug}>
                  <button type="button" className="ox-th" aria-label={`Photograph ${k + 1}: ${q.caption}`} aria-current={k === active ? 'true' : undefined} onClick={() => go(k)}>
                    <img src={`img/${q.slug}-480.webp`} alt="" loading="lazy" decoding="async" draggable={false} />
                    <span>{pad2(k + 1)}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="os-nav ox-nav">
              <button type="button" className="os-prev" aria-label="Previous photograph" disabled={active === 0} onClick={() => go(active - 1)}>{ARROW}</button>
              <button type="button" className="os-next" aria-label="Next photograph" disabled={active === COUNT - 1} onClick={() => go(active + 1)}>{ARROW}</button>
              <a className="pill dark os-all" href="works.html" data-cta="home-works">
                See all our projects
                {ARROW}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
