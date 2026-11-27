import { useRef, useState, type JSX } from 'react';

/* the project's name laid over the first photograph (phones only, see .sl-cover) */
export type Cover = { readonly kicker: string; readonly name: string };
import type { Photo } from '../../data/projects';
import { pad2 } from '../home/ring';

const ARROW = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

function Shot({ p, sizes, cover }: { readonly p: Photo; readonly sizes: string; readonly cover?: Cover }): JSX.Element {
  return (
    <a className="shot" href={`img/${p.img}-1600.webp`} data-cap={p.caption} draggable={false}>
      <span className="shot-img">
        <img
          src={`img/${p.img}-900.webp`}
          srcSet={`img/${p.img}-900.webp 900w, img/${p.img}-1600.webp 1600w`}
          sizes={sizes}
          alt={p.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        {cover && (
          <span className="sl-cover" aria-hidden="true">
            <span className="sl-cover-k">{cover.kicker}</span>
            <span className="sl-cover-n">{cover.name}</span>
          </span>
        )}
      </span>
      <span className="shot-t">{p.caption}</span>
    </a>
  );
}

/* A project's photographs, one at a time: swipe or use the arrows; the back arrow appears from the second photograph on.
   `tall` sets portrait frames, two to a view on wide screens. Each photograph opens full screen (PhotoViewer). */
export default function Gallery({ photos, label, tall = false, cover }: { readonly photos: readonly Photo[]; readonly label: string; readonly tall?: boolean; readonly cover?: Cover }): JSX.Element {
  const row = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  const [end, setEnd] = useState(photos.length < 2);

  const onScroll = () => {
    const el = row.current;
    const first = el?.firstElementChild;
    if (!el || !(first instanceof HTMLElement)) return;
    const step = first.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
    setAt(Math.round(el.scrollLeft / step));
    setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const go = (dir: 1 | -1) => {
    const el = row.current;
    const first = el?.firstElementChild;
    if (!el || !(first instanceof HTMLElement)) return;
    const step = first.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
    el.scrollTo({ left: el.scrollLeft + dir * step, behavior: 'smooth' });
  };

  return (
    <div className={`sl${tall ? ' sl-tall' : ''}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <ul className="sl-row" ref={row} onScroll={onScroll} tabIndex={0}>
        {photos.map((p, i) => (
          <li className="sl-i" key={p.img} aria-roledescription="slide" aria-label={`${i + 1} of ${photos.length}`}>
            <Shot p={p} sizes={tall ? '(min-width:900px) 340px, 90vw' : '(min-width:900px) 680px, 100vw'} cover={i === 0 ? cover : undefined} />
          </li>
        ))}
      </ul>
      {photos.length > 1 && (
        <>
          <button type="button" className="sl-b sl-prev" aria-label="Previous photograph" hidden={at === 0} onClick={() => go(-1)}>{ARROW}</button>
          <button type="button" className="sl-b sl-next" aria-label="Next photograph" hidden={end} onClick={() => go(1)}>{ARROW}</button>
          <p className="sl-count" aria-live="polite"><b>{pad2(Math.min(at + 1, photos.length))}</b>{` / ${pad2(photos.length)}`}</p>
        </>
      )}
    </div>
  );
}

/* where a project's photographs will go once they are released */
export function PhotosToFollow({ name }: { readonly name: string }): JSX.Element {
  return (
    <div className="pj-wait">
      <i className="cm tl" />
      <i className="cm tr" />
      <i className="cm bl" />
      <i className="cm br" />
      <p className="pj-wait-k">Photography in preparation</p>
      <p className="pj-wait-n" aria-hidden="true">{name}</p>
      <p className="pj-wait-p">Photographs of this project will be published here.</p>
    </div>
  );
}
