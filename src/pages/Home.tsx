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
      {/* 2. who we are: where the company comes from, where it stands today and what comes next, and three figures for the same */}
      <section className="intro" id="about">
        <div className="intro-copy">
          <p className="lead">
            ProSeal has been building in Gibraltar since 2002. We deliver luxury private residences, residential developments, the refurbishment of existing and historic buildings, and commercial and healthcare projects, from planning through to handover.
          </p>
          <p className="intro-p">
            Today a team of around 100 people is delivering projects that range from Healy House in the South District to Turicum Private Bank and the GibMed Clinic. In 2027 we will launch an independent property maintenance service.
          </p>
        </div>
        <dl className="facts" aria-label="ProSeal in figures">
          <div>
            <dt>2002</dt>
            <dd>founded in Gibraltar</dd>
          </div>
          <div>
            <dt><small>around</small>100</dt>
            <dd>people on staff</dd>
          </div>
          <div>
            <dt>2027</dt>
            <dd>our property maintenance service begins</dd>
          </div>
        </dl>
        {/* reels: the carousel on the left, a short text and the list of the four films on the right */}
        <Reels />
      </section>
      {/* 3. what we do: a ruled index of the services; each name opens the quote form with that service, one quote request below */}
      <WhatWeDo />
      {/* in development: The Villas Beacon Point, Europa Point. Renders and clip are the developer's. */}
      <Development />
      {/* 4. on site: a row of prints from our own sites, scrolled sideways, each with its caption */}
      <OnSite />
      <section className="ask" id="quote">
        <div className="ask-band">
          <p className="ask-k">Request a quote</p>
          <h2 className="h">
            Tell us what{" "}
            <em>you are building.</em>
          </h2>
          <p className="ask-lead">It takes three short steps. We then visit the site, take measurements and send you a written quote.</p>
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
          <img src="img/site-view-900.webp" srcSet="img/site-view-900.webp 900w, img/site-view-1600.webp 1600w" sizes="100vw" alt="A ProSeal site seen from above, with the Bay of Gibraltar behind" loading="lazy" decoding="async" />
        </figure>
        <h2 className="h contact-h">
          Where to{" "}
          <em>find us.</em>
        </h2>
        <div className="contact-copy">
          <p className="contact-k">
            Proseal Construction Ltd
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
                  Gibraltar GX11 1AA
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
