import Hero from '../components/home/Hero';
import Reels from '../components/home/Reels';
import WhatWeDo from '../components/home/WhatWeDo';
import Development from '../components/home/Development';
import OnSite from '../components/home/OnSite';
import QuoteForm from '../components/forms/QuoteForm';

export default function HomePage() {
  return (
    <main id="main">
      {/* 1. hero: the Scroll Expansion Hero from 21st.dev (@arunachalam), rebuilt without React.
     The restored arch fills the screen; the new build plays in a window that opens to the full screen with the scroll,
     and the two halves of the title part to the sides. */}
      <Hero />
      {/* 2. who we are, in one sentence, and three figures */}
      <section className="intro" id="about">
        <p className="lead">
          A Gibraltar builder since 2002. We build new property and we refurbish what already stands, from apartments and starter homes to five and six bedroom family houses.
        </p>
        <dl className="facts" aria-label="ProSeal in numbers">
          <div>
            <dt>2002</dt>
            <dd>founded in Gibraltar</dd>
          </div>
          <div>
            <dt>50</dt>
            <dd>people on staff, approximately</dd>
          </div>
          <div>
            <dt>3</dt>
            <dd>countries we buy direct from</dd>
          </div>
        </dl>
        {/* reels: the carousel on the left, a short text and the list of the four films on the right */}
        <Reels />
      </section>
      {/* 3. what we do: three photographs side by side, the one chosen opens wide and tells its trade */}
      <WhatWeDo />
      {/* in development: The Villas Beacon Point, Europa Point. Renders and clip are the developer's. */}
      <Development />
      {/* 4. on site: the title on one side, the photographs stacked like a hand of prints on the other, three site tapes straight across behind */}
      <OnSite />
      <section className="ask" id="quote">
        <div className="ask-band">
          <p className="ask-k">Request a quote</p>
          <h2 className="h">
            Tell us what{" "}
            <em>you are building.</em>
          </h2>
          <p className="ask-lead">Three short steps. We visit, measure and send a written quote.</p>
          <p className="ask-call">
            <a href="tel:+35020047974" data-cta="ask-call">
              Prefer to talk?{" "}
              <b>+350 200 47974</b>
            </a>
          </p>
        </div>
        <QuoteForm />
      </section>
      <section className="contact" id="contact">
        <figure className="contact-img">
          <img src="img/site-view-900.webp" srcSet="img/site-view-900.webp 900w, img/site-view-1600.webp 1600w" sizes="100vw" alt="A ProSeal site seen from above, with the bay of Gibraltar behind" loading="lazy" decoding="async" />
        </figure>
        <h2 className="h contact-h">
          Where to{" "}
          <em>find us.</em>
        </h2>
        <div className="contact-copy">
          <p className="contact-k">
            ProSeal Construction Ltd
            <span>Gibraltar</span>
          </p>
          <ul className="rows">
            <li>
              <a href="tel:+35020047974" data-cta="contact-call">
                <svg className="ico" aria-hidden="true"><use href="#i-call" /></svg>
                <span>
                  <b>+350 200 47974</b>
                  Telephone
                </span>
                <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6" /></svg>
              </a>
            </li>
            <li>
              <a href="mailto:info@prosealconstruction.com" data-cta="contact-mail">
                <svg className="ico" aria-hidden="true"><use href="#i-mail" /></svg>
                <span>
                  <b>info@prosealconstruction.com</b>
                  Email
                </span>
                <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6" /></svg>
              </a>
            </li>
            <li>
              <a href={"https://www.google.com/maps/search/?api=1&query=3%2F1+City+Mill+Lane+Gibraltar"} target="_blank" rel="noopener" data-cta="contact-map">
                <svg className="ico" aria-hidden="true"><use href="#i-pin" /></svg>
                <span>
                  <b>3/1 City Mill Lane</b>
                  GX11 1AA Gibraltar
                </span>
                <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6" /></svg>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
