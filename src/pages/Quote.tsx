import QuoteForm from '../components/forms/QuoteForm';
import FindUs from '../components/FindUs';

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
      <FindUs />
    </main>
  );
}
