import Hero from '../components/home/Hero';
import Trust from '../components/home/Trust';
import Reels from '../components/home/Reels';
import WhatWeDo from '../components/home/WhatWeDo';
import OnSite from '../components/home/OnSite';
import QuoteSection from '../components/forms/QuoteSection';
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
      {/* 2. who we are: the reels, then one sentence and three figures */}
      <section className="intro" id="about">
        {/* reels: the carousel on the left, a short text and the list of the four films on the right; the sentence and the figures close the section under them */}
        <Reels />
        <div className="intro-copy intro-after">
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
      </section>
      {/* 3. what we do: a ruled index of the services beside a panel that shows the work behind the one pointed at; each name opens the quote form with that service, one quote request below */}
      <WhatWeDo />
      {/* 4. on site: a carousel of prints from our own sites, each with its caption */}
      <OnSite />
      <QuoteSection heading="h2" />
      <FindUs />
    </main>
  );
}
