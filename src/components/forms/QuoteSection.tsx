import QuoteForm from './QuoteForm';
import ProSealMark from './ProSealMark';

/* the quote on Home and on the quote page: one narrow card on the navy, the form itself, so that a step and its button
   fit one phone screen; the contacts are a quiet line at its foot */
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
        </div>
        <QuoteForm />
        <p className="aq-links">
          <a href="mailto:info@prosealconstruction.com" data-cta="ask-mail">info@prosealconstruction.com</a>
          <a href="tel:+35020047974" data-cta="ask-call">+350 200 47974</a>
        </p>
      </div>
    </section>
  );
}
