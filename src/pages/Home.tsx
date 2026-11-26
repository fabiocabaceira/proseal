import Hero from '../components/home/Hero';
import Trust from '../components/home/Trust';
import Reels from '../components/home/Reels';
import WhatWeDo from '../components/home/WhatWeDo';
import OnSite from '../components/home/OnSite';
import QuoteForm from '../components/forms/QuoteForm';
import FindUs from '../components/FindUs';

export default function HomePage() {
  return (
    <main id="main">
      {/* 1. hero: the Scroll Expansion Hero from 21st.dev (@arunachalam), rebuilt without React.
     The restored arch fills the screen; the new build plays in a window that opens to the full screen with the scroll,
     and the two halves of the title part to the sides. */}
      <Hero />
      {/* selected commissions and institutional clients, set in type on a dark band under the hero */}
      <Trust />
      {/* 2. who we are: one sentence and three figures */}
      <section className="intro" id="about">
        <div className="intro-copy">
          <p className="lead">
            Luxury residences, restorations and commercial builds across Gibraltar since 2002.
          </p>
        </div>
        <dl className="facts" aria-label="ProSeal in figures">
          <div>
            <dt>2002</dt>
            <dd>Founded in Gibraltar</dd>
          </div>
          <div>
            <dt><span className="sr-only">around </span><span aria-hidden="true">~</span>100</dt>
            <dd>People on staff</dd>
          </div>
          <div>
            <dt>2027</dt>
            <dd>Property maintenance</dd>
          </div>
        </dl>
        {/* reels: the carousel on the left, a short text and the list of the four films on the right */}
        <Reels />
      </section>
      {/* 3. what we do: a ruled index of the services beside a panel that shows the work behind the one pointed at; each name opens the quote form with that service, one quote request below */}
      <WhatWeDo />
      {/* 4. on site: a carousel of prints from our own sites, each with its caption */}
      <OnSite />
      <section className="ask" id="quote">
        <div className="ask-band">
          <p className="ask-k">Request a quote</p>
          <h2 className="h">
            Tell us what{" "}
            <em>you are building.</em>
          </h2>
          <p className="ask-lead">Three short steps, then a site visit and a written quote.</p>
          <p className="ask-call">
            <a href="tel:+35020047974" data-cta="ask-call">
              Prefer to talk?{" "}
              <b>+350 200 47974</b>
            </a>
          </p>
        </div>
        <QuoteForm />
      </section>
      <FindUs />
    </main>
  );
}
