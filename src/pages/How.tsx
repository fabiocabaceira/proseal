import HowSteps from '../components/how/HowSteps';
import WhereMap from '../components/how/WhereMap';

export default function HowPage() {
  return (
    <main id="main">
      <HowSteps />
      <WhereMap />
      <section className="cta">
        <div className="cta-in">
          <h2 className="h">
            Tell us what{" "}
            <em>you are building.</em>
          </h2>
          <p className="cta-go">
            <a className="pill" href="quote.html" data-cta="how-quote">Request a quote</a>
            <a className="pill ghost" href="tel:+35020047974" data-cta="how-call">Call +350 200 47974</a>
          </p>
        </div>
      </section>
    </main>
  );
}
