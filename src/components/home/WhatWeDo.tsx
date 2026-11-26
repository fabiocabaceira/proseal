import { useState } from 'react';
import { pad2 } from './ring';

interface Fact {
  readonly name: string;
  readonly text: string;
}

interface Shot {
  readonly slug: string;
  readonly alt: string;
}

/* what the preview panel shows for a service: a photograph from our own sites, or names and figures set in type
   where no photograph of that work exists yet */
interface Panel {
  readonly k: string;
  readonly shot?: Shot;
  readonly display?: readonly { readonly big: string; readonly small?: string }[];
  readonly cap?: string;
  readonly facts?: readonly Fact[];
  /** a heading over the facts, where they are about other projects than the photograph */
  readonly fk?: string;
  /** one line under the service on phones, where the panel is not shown */
  readonly ref?: string;
  /** the photograph goes beside that line only when the line describes it */
  readonly refShot?: boolean;
}

interface Service {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  /** the job the quote form opens with; none while the service is not yet offered */
  readonly job?: string;
  readonly from?: string;
  readonly panel: Panel;
}

const SERVICES = [
  {
    id: 'new-build', title: 'New-build residential', text: 'Luxury private residences and residential developments, from planning through to handover.', job: 'New build',
    panel: {
      k: 'From our sites',
      shot: { slug: 'terrace', alt: 'A row of new houses at different stages of construction along the same street' },
      cap: 'New-build housing in Gibraltar: one street, every stage of construction.',
      fk: 'Current projects',
      facts: [
        { name: 'Buena Vista Villa', text: 'A substantial luxury villa, currently under construction' },
        { name: 'Lancashire House', text: 'A new luxury residence within the grounds' },
      ],
      ref: 'Buena Vista Villa, under construction',
    },
  },
  {
    id: 'restoration', title: 'Refurbishment and restoration', text: 'Existing and historic buildings refurbished and modernised, with their character respected.', job: 'Refurbishment or restoration',
    panel: {
      k: 'From our sites',
      shot: { slug: 'gunwharf-roof', alt: 'The iron roof at Gun Wharf seen from inside, with the roof lights open to the sky' },
      cap: 'Gun Wharf: the iron roof trusses repainted and the roof lights opened.',
      fk: 'Current project',
      facts: [{ name: 'Healy House', text: 'A former nursing home, becoming a high-end private residence' }],
      ref: 'Gun Wharf, the iron roof restored',
      refShot: true,
    },
  },
  {
    id: 'commercial', title: 'Commercial and healthcare', text: 'Banking premises and specialist clinical facilities, with major works carried out while the building remains open.', job: 'Commercial or healthcare',
    panel: {
      k: 'Current projects',
      display: [
        { big: 'Turicum Private Bank', small: 'Refurbished while the bank stayed open' },
        { big: 'GibMed Clinic ICC', small: 'Operating theatre, X-ray and MRI rooms' },
      ],
      ref: 'Turicum Private Bank · GibMed Clinic ICC',
    },
  },
  {
    id: 'electrical', title: 'Electrical installations', text: 'For new homes, refurbishments and commercial fit-outs, coordinated with the rest of the build.', job: 'Electrical installation',
    panel: {
      k: 'Our scope',
      display: [{ big: 'New homes' }, { big: 'Refurbishments' }, { big: 'Commercial fit-outs' }],
      cap: 'Coordinated with the rest of the build.',
    },
  },
  {
    id: 'pools', title: 'Swimming pools', text: 'Built as an integral part of the home, as with the private infinity pool at Healy House.', job: 'Swimming pool',
    panel: {
      k: 'Current project',
      display: [{ big: 'The private infinity pool at Healy House', small: 'South District, Gibraltar' }],
      facts: [{ name: 'Healy House', text: 'Six bedrooms and six bathrooms, a cinema room, sauna and gymnasium' }],
      ref: 'Healy House, South District',
    },
  },
  {
    id: 'roofing', title: 'Roofing and waterproofing', text: 'Natural slate laid by hand, and waterproofing systems from partner manufacturers in Germany and the UK.', job: 'Roofing or waterproofing',
    panel: {
      k: 'From our sites',
      shot: { slug: 'slates', alt: 'A roofer laying slate around roof windows already in place, with the bay behind' },
      cap: 'Natural slate laid by hand around the roof windows, with the bay behind.',
      facts: [{ name: 'Waterproofing', text: 'Systems from partner manufacturers in Germany and the UK' }],
      ref: 'Slate laid by hand',
      refShot: true,
    },
  },
  {
    id: 'management', title: 'Project and construction management', text: 'Estimating and cost control, and the coordination of specialist subcontractors and trades.', job: 'Project management',
    panel: {
      k: 'Our scope',
      display: [{ big: 'Estimating' }, { big: 'Cost control' }, { big: 'Coordination' }],
      cap: 'From the first estimate to the final account.',
      ref: 'From the first estimate to the final account',
    },
  },
  {
    id: 'maintenance', title: 'Property maintenance', text: 'An independent property maintenance service. Details will be published closer to the launch.', from: 'Launching 2027',
    panel: {
      k: 'Launching 2027',
      display: [{ big: '2027', small: 'An independent property maintenance service' }],
      cap: 'Details will be published closer to the launch.',
    },
  },
] as const satisfies readonly Service[];

const COUNT = SERVICES.length;
const ARROW = <svg className="wwd-arw" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

function Card({ s, n, on }: { readonly s: Service; readonly n: number; readonly on: boolean }) {
  const p = s.panel;
  return (
    <div className={`wwp-c wwp-${s.id}${on ? ' is-on' : ''}${p.shot ? ' has-shot' : ' is-type'}`} aria-hidden={!on}>
      <p className="wwp-k">
        <span>{`${pad2(n)} / ${pad2(COUNT)}`}</span>
        <span>{p.k}</span>
      </p>
      <div className="wwp-m">
        {p.shot ? (
          <img
            src={`img/${p.shot.slug}-900.webp`}
            srcSet={`img/${p.shot.slug}-480.webp 480w, img/${p.shot.slug}-900.webp 900w`}
            sizes="(min-width:1500px) 640px, 40vw"
            alt={p.shot.alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <ul className={`wwp-d n${p.display?.length ?? 0}`}>
            {p.display?.map((d) => (
              <li key={d.big}>
                <b>{d.big}</b>
                {d.small && <span>{d.small}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {p.cap && <p className="wwp-cap">{p.cap}</p>}
      {p.fk && <p className="wwp-fk">{p.fk}</p>}
      {p.facts && (
        <ul className="wwp-f">
          {p.facts.map((f) => (
            <li key={f.name}>
              <b>{f.name}</b>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* the index of the eight services; on wide screens the panel beside it shows the work behind the service pointed at.
   On phones (site.css, max-width 768px) each row is an accordion button and only one panel is open; the title link and
   the button are both in the markup and the stylesheet shows one of them, so the prerendered page needs no width check. */
export default function WhatWeDo() {
  const [on, setOn] = useState(0);
  const [open, setOpen] = useState(-1);
  return (
    <section className="what" id="what">
      <div className="what-head">
        <h2 className="h">
          What{" "}
          <em>we do.</em>
        </h2>
        <p className="what-p">Our own team on site, and specialists where the work requires them.</p>
      </div>
      <div className="wwd-grid">
        <div className="wwd-col">
          <p className="wwd-k">
            <span>Our services</span>
            <span>{`01 — ${pad2(COUNT)}`}</span>
          </p>
          <p className="sr-only" id="wwd-hint">Each service opens the quote form with that service already selected.</p>
          <ol className="wwd">
            {SERVICES.map((s: Service, i) => (
              <li
                key={s.id}
                className={`wwd-i${s.job ? '' : ' soon'}${i === on ? ' is-on' : ''}${i === open ? ' is-open' : ''}`}
                onPointerEnter={() => setOn(i)}
                onFocus={() => setOn(i)}
              >
                <span className="wwd-n">{pad2(i + 1)}</span>
                <h3 className="wwd-t">
                  {s.job ? (
                    <a href={`quote.html?job=${encodeURIComponent(s.job)}`} data-cta={`what-${s.id}`} aria-describedby="wwd-hint">{s.title}</a>
                  ) : (
                    <span className="wwd-tt">{s.title}</span>
                  )}
                  {s.from && <span className="wwd-soon">{s.from}</span>}
                  <button
                    type="button"
                    className="wwd-b"
                    id={`wwd-b-${s.id}`}
                    aria-expanded={i === open}
                    aria-controls={`wwd-x-${s.id}`}
                    onClick={() => setOpen(i === open ? -1 : i)}
                  >
                    <span className="wwd-bn">{pad2(i + 1)}</span>
                    <span className="wwd-bt">{s.title}</span>
                    <span className="wwd-pm" aria-hidden="true" />
                  </button>
                </h3>
                <div className="wwd-x" id={`wwd-x-${s.id}`}>
                  <div className="wwd-xi">
                    <p className="wwd-p">{s.text}</p>
                    {s.panel.ref && (
                      <p className="wwd-ref">
                        {s.panel.refShot && s.panel.shot && <img src={`img/${s.panel.shot.slug}-480.webp`} alt="" loading="lazy" decoding="async" />}
                        <span>{s.panel.ref}</span>
                      </p>
                    )}
                    {s.job ? (
                      <a className="wwd-q" href={`quote.html?job=${encodeURIComponent(s.job)}`} data-cta={`what-${s.id}`}>
                        Request a quote
                        {ARROW}
                      </a>
                    ) : (
                      s.from && <p className="wwd-soon wwd-soon-m">{s.from}</p>
                    )}
                  </div>
                </div>
                {s.job && ARROW}
              </li>
            ))}
          </ol>
          <div className="wwd-go">
            <p>We visit the site, take measurements and send you a written quote.</p>
            <a className="pill dark" href="quote.html" data-cta="what-quote">Request a quote</a>
          </div>
        </div>
        <aside className="wwp" aria-label="The work behind the service">
          <div className="wwp-in">
            {SERVICES.map((s: Service, i) => <Card key={s.id} s={s} n={i + 1} on={i === on} />)}
          </div>
        </aside>
      </div>
    </section>
  );
}
