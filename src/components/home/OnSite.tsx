import { useEffect, useRef, useState } from 'react';
import { isCalm } from '../../lib/site';
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

/* A row of prints that scrolls sideways under the finger, the trackpad or the two arrows; it snaps to each print. */
export default function OnSite() {
  const track = useRef<HTMLUListElement>(null);
  const [cur, setCur] = useState(0);
  const [ends, setEnds] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let queued = 0;
    const read = () => {
      queued = 0;
      const items = [...el.children] as HTMLElement[];
      const origin = items[0]?.offsetLeft ?? 0;
      const x = el.scrollLeft;
      let best = 0;
      items.forEach((it, k) => {
        if (Math.abs(it.offsetLeft - origin - x) < Math.abs(items[best].offsetLeft - origin - x)) best = k;
      });
      const max = el.scrollWidth - el.clientWidth;
      setCur(x >= max - 2 ? COUNT - 1 : best);
      setEnds({ start: x <= 2, end: x >= max - 2 });
    };
    const onScroll = () => { if (!queued) queued = requestAnimationFrame(read); };
    read();
    el.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(queued);
    };
  }, []);

  const go = (step: number) => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const next = items[Math.min(COUNT - 1, Math.max(0, cur + step))];
    el.scrollTo({ left: next.offsetLeft - items[0].offsetLeft, behavior: isCalm() ? 'auto' : 'smooth' });
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
          <p className="works-p">Every photograph here was taken on one of our own sites in Gibraltar.</p>
          <p><a className="line" href="works.html" data-cta="home-works">See all our projects</a></p>
        </div>
      </div>
      <div className="strip-wrap">
      <ul className="strip" ref={track} tabIndex={0} aria-label="Photographs from our sites">
        {PRINTS.map((p, k) => (
          <li key={p.slug} className="strip-i">
            <a href={`img/${p.slug}-1600.webp`} className="card">
              <span className="strip-img">
                <img src={`img/${p.slug}-480.webp`} srcSet={`img/${p.slug}-480.webp 480w, img/${p.slug}-900.webp 900w`} sizes="(min-width:900px) 420px, 76vw" alt={p.alt} loading="lazy" decoding="async" />
              </span>
              <span className="strip-t">
                <span className="strip-n">{pad2(k + 1)}</span>
                <span>
                  <b>{p.place}</b>
                  <span className="card-l">{p.caption}</span>
                </span>
                <span className="strip-w">{p.work}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="strip-nav">
        <span className="strip-count" aria-live="polite"><b>{pad2(cur + 1)}</b>{` / ${pad2(COUNT)}`}</span>
        <span className="strip-bar" aria-hidden="true">
          {PRINTS.map((p, k) => <i key={p.slug} className={k <= cur ? 'on' : undefined} />)}
        </span>
        <button type="button" className="strip-prev" aria-label="Previous photograph" disabled={ends.start} onClick={() => go(-1)}>{ARROW}</button>
        <button type="button" className="strip-next" aria-label="Next photograph" disabled={ends.end} onClick={() => go(1)}>{ARROW}</button>
      </div>
      </div>
    </section>
  );
}
