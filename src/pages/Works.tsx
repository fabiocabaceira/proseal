import type { JSX } from 'react';
import Ring from '../components/works/Ring';
import { KINDS, pad2 } from '../components/works/kinds';

export default function WorksPage(): JSX.Element {
  return (
    <main id="main">
      {/* works: by kind of work; each kind turns as a ring of photographs */}
      <header className="wk-head">
        <h1 className="h">
          On{" "}
          <em>site.</em>
        </h1>
        <div className="wk-side">
          <p className="page-lead">
            Photographs taken on our own sites in Gibraltar, by kind of work. Drag or swipe each ring to turn it, tap a photograph to see it full screen.
          </p>
          <ol className="wk-toc">
            {KINDS.map((k, i) => (
              <li key={k.id}>
                <a href={`#${k.id}`}>
                  <span>{pad2(i + 1)}</span>
                  <b>{k.title}</b>
                  <i>{k.photos.length}</i>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </header>
      {KINDS.map((k, i) => (
        <section className="kind" id={k.id} key={k.id}>
          <div className="kind-head">
            <p className="kind-n">
              {pad2(i + 1)}
              <span>{`${k.photos.length} photographs`}</span>
            </p>
            <h2 className="h">{k.title}</h2>
            <p className="kind-p">{k.text}</p>
          </div>
          <Ring kind={k} />
        </section>
      ))}
      <section className="also">
        <h2 className="also-k">Also built or renovated by ProSeal</h2>
        <ol>
          <li>
            <span>01</span>
            Buena Vista Villas
          </li>
          <li>
            <span>02</span>
            The Island
          </li>
          <li>
            <span>03</span>
            The Sails
          </li>
          <li>
            <span>04</span>
            Beaulieu House
          </li>
          <li>
            <span>05</span>
            1 Rosia Parade
          </li>
          <li>
            <span>06</span>
            Rock Cottage
          </li>
        </ol>
      </section>
      <section className="cta">
        <div className="cta-in">
          <h2 className="h">
            Tell us what{" "}
            <em>you are building.</em>
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
