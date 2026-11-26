import HowSteps from '../components/how/HowSteps';
import WhereMap from '../components/how/WhereMap';
import { pad2 } from '../components/home/ring';

const APPROACH = [
  { title: 'Quality', text: 'We deliver workmanship and finishes to a consistently high standard.' },
  { title: 'Reliability', text: 'We are a professional, dependable partner from the first survey to handover.' },
  { title: 'Project control', text: 'We keep close control of programme, cost, resources and quality.' },
  { title: 'Communication', text: 'We keep clients, consultants and everyone involved informed at every stage.' },
  { title: 'Health and safety', text: 'We put safe working practices and the wellbeing of everyone on our sites first.' },
  { title: 'Professionalism', text: 'We act with integrity and take responsibility for the work we undertake.' },
] as const;

export default function HowPage() {
  return (
    <main id="main">
      <HowSteps />
      <section className="what approach" id="approach">
        <div className="what-head">
          <h2 className="h">
            Our{" "}
            <em>approach.</em>
          </h2>
          <p className="what-p">Every project is different, so we begin by understanding exactly what the client needs, and we keep communication clear until the work is complete.</p>
        </div>
        <ol className="svc three">
          {APPROACH.map((a, i) => (
            <li key={a.title} className="svc-i">
              <p className="svc-n">{pad2(i + 1)}</p>
              <h3 className="svc-t">{a.title}</h3>
              <p className="svc-p">{a.text}</p>
            </li>
          ))}
        </ol>
      </section>
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
