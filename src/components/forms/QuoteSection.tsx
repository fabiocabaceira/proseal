import QuoteForm from './QuoteForm';
import ProSealMark from './ProSealMark';

/* the quote on Home and on the quote page: on phones one column centred on the navy; on desktop the wordmark, heading and
   contacts on the left and the form beside them, so the whole step is seen without scrolling */
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
            <a href="mailto:info@prosealconstruction.com" data-cta="ask-mail"><small>Email</small>info@prosealconstruction.com</a>{" "}
            <a href="tel:+35020047974" data-cta="ask-call"><small>Call</small>+350 200 47974</a>
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
