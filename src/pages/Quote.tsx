import QuoteForm from '../components/forms/QuoteForm';

export default function QuotePage() {
  return (
    <main id="main">
      <section className="ask" id="quote">
        <div className="ask-band">
          <p className="ask-k">Request a quote</p>
          <h1 className="h">
            Tell us what{" "}
            <em>you are building.</em>
          </h1>
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
