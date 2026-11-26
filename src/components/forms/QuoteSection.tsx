import QuoteForm from './QuoteForm';
import ProSealMark from './ProSealMark';

/* the quote on Home and on the quote page: one narrow column centred on the navy, the wordmark drawn on it, then the form */
export default function QuoteSection({ heading: H }: { readonly heading: 'h1' | 'h2' }) {
  return (
    <section className="ask aq" id="quote">
      <div className="aq-col">
        <div className="aq-head">
          <ProSealMark />
          <p className="aq-k">Request a quote</p>
          <H className="aq-h">
            Tell us what{" "}
            <em>you are building.</em>
          </H>
          <p className="aq-lead">Leave your details and we will be in touch.</p>
          <p className="aq-links">
            <a href="mailto:info@prosealconstruction.com" data-cta="ask-mail">info@prosealconstruction.com</a>{" "}
            <a href="tel:+35020047974" data-cta="ask-call">+350 200 47974</a>
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
