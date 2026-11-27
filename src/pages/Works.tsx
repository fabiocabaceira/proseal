import type { JSX } from 'react';
import Gallery, { PhotosToFollow } from '../components/works/Gallery';
import { pad2 } from '../components/home/ring';
import { FactSheet, FeatureChips, ReadMore } from '../components/works/Facts';
import { ALSO_BUILT, BEACON_FACTS, BEACON_FEATURES, BEACON_RENDERS, GUN_WHARF, GUN_WHARF_FACTS, GUN_WHARF_FEATURES, PROJECTS, SITE_PHOTOS } from '../data/projects';

export default function WorksPage(): JSX.Element {
  return (
    <main id="main">
      <header className="wk-head pj-head">
        <h1 className="h">
          Project by{" "}
          <em>project.</em>
        </h1>
        <div className="wk-side">
          <p className="page-lead">
            A selection of the projects ProSeal is delivering in Gibraltar today, from luxury private residences to a private bank and a specialist clinic. Each project is listed with its essential facts and, where available, its photographs.
          </p>
        </div>
      </header>

      <section className="pj-group" aria-labelledby="current">
        <h2 className="pj-k" id="current">Current projects</h2>
        {PROJECTS.map((p, i) => (
          <article className={p.photos.length > 0 ? 'pj has-cover' : 'pj'} id={p.slug} key={p.slug}>
            <div className="pj-copy">
              <p className="pj-n">
                <span>{pad2(i + 1)}</span>
                {p.status}
              </p>
              <h3 className="pj-name">{p.name}</h3>
              <FactSheet facts={p.facts} name={p.name} />
              {p.text.slice(0, 1).map((t) => <p className="pj-p" key={t}>{t}</p>)}
              {(p.text.length > 1 || p.features.length > 0) && (
                <ReadMore>
                  {p.text.slice(1).map((t) => <p className="pj-p" key={t}>{t}</p>)}
                  {p.features.length > 0 && <FeatureChips features={p.features} name={p.name} />}
                </ReadMore>
              )}
            </div>
            <div className="pj-media">
              {p.photos.length > 0 ? <Gallery photos={p.photos} label={`Images of ${p.name}`} tall={p.slug === 'buena-vista-villa'} cover={{ kicker: `${pad2(i + 1)} · ${p.status}`, name: p.name }} /> : <PhotosToFollow name={p.name} />}
              {p.credit && <p className="pj-credit">{p.credit}</p>}
            </div>
          </article>
        ))}
      </section>

      <section className="pj-group" aria-labelledby="also-by">
        <h2 className="pj-k" id="also-by">Further projects</h2>
        <article className="pj has-cover" id="beacon-point">
          <div className="pj-copy">
            <p className="pj-n">
              <span>{pad2(PROJECTS.length + 1)}</span>
              In development
            </p>
            <h3 className="pj-name">The Villas Beacon Point</h3>
            <FactSheet facts={BEACON_FACTS} name="The Villas Beacon Point" />
            <p className="pj-p">The Villas Beacon Point is an exclusive collection of townhouses, villas and luxury apartments at the southern tip of Gibraltar, with the Rock behind and Morocco across the Strait.</p>
            <ReadMore>
              <p className="pj-p">ProSeal is building the development. The images shown here are the developer’s renders, not photographs.</p>
              <FeatureChips features={BEACON_FEATURES} name="The Villas Beacon Point" />
            </ReadMore>
            <p className="pj-go">
              <a className="line" href="https://thevillasbeaconpoint.gi/" target="_blank" rel="noopener" data-cta="works-beacon">Visit the development’s website</a>
            </p>
          </div>
          <div className="pj-media">
            <Gallery photos={BEACON_RENDERS} label="Developer’s renders of The Villas Beacon Point" cover={{ kicker: `${pad2(PROJECTS.length + 1)} · In development`, name: 'The Villas Beacon Point' }} />
            <p className="pj-credit">Renders courtesy of the developer.</p>
          </div>
        </article>
        <article className="pj has-cover" id="gun-wharf">
          <div className="pj-copy">
            <p className="pj-n">
              <span>{pad2(PROJECTS.length + 2)}</span>
              Works carried out
            </p>
            <h3 className="pj-name">Gun Wharf</h3>
            <FactSheet facts={GUN_WHARF_FACTS} name="Gun Wharf" />
            <p className="pj-p">ProSeal’s work on this historic building has included repainting the iron roof trusses, opening up the roof lights and installing new light-gauge steel framing inside.</p>
            <ReadMore>
              <FeatureChips features={GUN_WHARF_FEATURES} name="Gun Wharf" />
            </ReadMore>
          </div>
          <div className="pj-media">
            <Gallery photos={GUN_WHARF} label="Photographs of Gun Wharf" cover={{ kicker: `${pad2(PROJECTS.length + 2)} · Works carried out`, name: 'Gun Wharf' }} />
          </div>
        </article>
      </section>

      <section className="pj-group" id="site-photography" aria-labelledby="from-sites">
        <h2 className="pj-k" id="from-sites">From our sites</h2>
        {SITE_PHOTOS.map((set) => (
          <article className="pj has-cover" id={set.id} key={set.id}>
            <div className="pj-copy">
              <p className="pj-n">Site photography</p>
              <h3 className="pj-name">{set.title}</h3>
              <p className="pj-p">{set.text}</p>
              {set.features && (
                <ReadMore>
                  <FeatureChips features={set.features} name={set.title} />
                </ReadMore>
              )}
            </div>
            <div className="pj-media">
              <Gallery photos={set.photos} label={`Site photography: ${set.title.toLowerCase()}`} cover={{ kicker: 'Site photography', name: set.title }} />
            </div>
          </article>
        ))}
      </section>

      <section className="also">
        <h2 className="also-k">Also built or refurbished by ProSeal</h2>
        <ol>
          {ALSO_BUILT.map((name, i) => (
            <li key={name}>
              <span>{pad2(i + 1)}</span>
              {name}
            </li>
          ))}
        </ol>
      </section>
      <section className="cta">
        <div className="cta-in">
          <h2 className="h">
            Tell us about{" "}
            <em>your project.</em>
          </h2>
          <p className="cta-go">
            <a className="pill" href="quote.html" data-cta="works-quote">Request a quote</a>
            <a className="pill ghost" href="tel:+35020047974" data-cta="works-call">Call +350 200 47974</a>
          </p>
        </div>
      </section>
    </main>
  );
}
