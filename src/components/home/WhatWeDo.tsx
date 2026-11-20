import { useRef, useState } from 'react';
import { useInView } from '../../hooks/home/useInView';
import { pad2 } from './ring';

interface Trade {
  readonly slug: string;
  readonly alt: string;
  readonly title: string;
  readonly text: string;
  readonly job: string;
  readonly cta: string;
  readonly ask: string;
}

const TRADES = [
  { slug: 'rock', alt: 'Timber frame house under scaffolding with the Rock of Gibraltar behind', title: 'New build', text: 'New homes and developments, from the foundations to the keys.', job: 'New+build', cta: 'what-build', ask: 'Quote a new build' },
  { slug: 'gunwharf-arch', alt: 'Stone arch and restored iron roof trusses at Gun Wharf', title: 'Restoration', text: 'Existing and historic buildings refurbished, with their character kept.', job: 'Renovation', cta: 'what-restore', ask: 'Quote a restoration' },
  { slug: 'membrane', alt: 'A grey liquid membrane covering a roof edge, scaffolding beside it', title: 'Waterproofing', text: 'Waterproofing systems from our partner manufacturers in Germany and the UK.', job: 'Waterproofing', cta: 'what-seal', ask: 'Quote waterproofing' },
] as const satisfies readonly Trade[];

/* the pane pressed, or pointed at with a mouse on a wide screen, opens wide */
export default function WhatWeDo() {
  const section = useRef<HTMLElement>(null);
  const entered = useInView(section, 0, true);
  const [open, setOpen] = useState(0);

  return (
    <section className={entered ? 'what in' : 'what'} id="what" ref={section}>
      <div className="what-head">
        <h2 className="h">
          What{" "}
          <em>we do.</em>
        </h2>
        <p className="what-p">New build, restoration and waterproofing, by our own staff on site.</p>
      </div>
      <div className="panes" id="panes">
        {TRADES.map((t, i) => (
          <article
            key={t.slug}
            className={i === open ? 'pane is-on' : 'pane'}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse' && matchMedia('(min-width:900px)').matches) setOpen(i); }}
          >
            <img src={`img/${t.slug}-900.webp`} srcSet={`img/${t.slug}-900.webp 900w, img/${t.slug}-1600.webp 1600w`} sizes="(min-width:900px) 60vw, 100vw" alt={t.alt} loading="lazy" decoding="async" />
            {" "}
            <button type="button" className="pane-tab" aria-expanded={i === open} onClick={() => setOpen(i)}>
              <span className="pane-n">{pad2(i + 1)}</span>
              <span className="pane-t">{t.title}</span>
            </button>
            <div className="pane-body">
              <p>{t.text}</p>
              <a className="pill" href={`quote.html?job=${t.job}`} data-cta={t.cta}>{t.ask}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
