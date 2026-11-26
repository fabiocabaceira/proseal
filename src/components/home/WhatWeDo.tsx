import { pad2 } from './ring';

interface Service {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  /** the job the quote form opens with; none while the service is not yet offered */
  readonly job?: string;
  readonly from?: string;
}

const SERVICES = [
  { id: 'new-build', title: 'New-build residential', text: 'Luxury private residences and residential developments, from planning through to handover.', job: 'New build' },
  { id: 'restoration', title: 'Refurbishment and restoration', text: 'Existing and historic buildings refurbished and modernised, with their character respected.', job: 'Refurbishment or restoration' },
  { id: 'commercial', title: 'Commercial and healthcare', text: 'Banking premises and specialist clinical facilities, with major works carried out while a building stays open.', job: 'Commercial or healthcare' },
  { id: 'electrical', title: 'Electrical installations', text: 'For new homes, refurbishments and commercial fit-outs, coordinated with the rest of the build.', job: 'Electrical installation' },
  { id: 'pools', title: 'Swimming pools', text: 'Built as an integral part of the home, such as the private infinity pool at Healy House.', job: 'Swimming pool' },
  { id: 'roofing', title: 'Roofing and waterproofing', text: 'Natural slate laid by hand, and waterproofing systems from partner manufacturers in Germany and the UK.', job: 'Roofing or waterproofing' },
  { id: 'management', title: 'Project and construction management', text: 'Estimating and cost control, and the coordination of specialist subcontractors and trades.', job: 'Project management' },
  { id: 'maintenance', title: 'Property maintenance', text: 'An independent property maintenance service. Details will be published closer to the launch.', from: 'Launching 2027' },
] as const satisfies readonly Service[];

const ARROW = <svg className="wwd-arw" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

export default function WhatWeDo() {
  return (
    <section className="what" id="what">
      <div className="what-head">
        <h2 className="h">
          What{" "}
          <em>we do.</em>
        </h2>
        <p className="what-p">ProSeal plans, builds and manages projects of every scale across Gibraltar, with its own team on site and trusted specialist subcontractors where the work requires them.</p>
      </div>
      <p className="wwd-k">
        <span>Our services</span>
        <span>{`01 — ${pad2(SERVICES.length)}`}</span>
      </p>
      <p className="sr-only" id="wwd-hint">Each service opens the quote form with that service already selected.</p>
      <ol className="wwd">
        {SERVICES.map((s: Service, i) => (
          <li key={s.id} className={s.job ? 'wwd-i' : 'wwd-i soon'}>
            <span className="wwd-n">{pad2(i + 1)}</span>
            <h3 className="wwd-t">
              {s.job ? (
                <a href={`quote.html?job=${encodeURIComponent(s.job)}`} data-cta={`what-${s.id}`} aria-describedby="wwd-hint">{s.title}</a>
              ) : (
                s.title
              )}
              {s.from && <span className="wwd-soon">{s.from}</span>}
            </h3>
            <p className="wwd-p">{s.text}</p>
            {s.job && ARROW}
          </li>
        ))}
      </ol>
      <div className="wwd-go">
        <p>We visit the site, take measurements and send you a written quote.</p>
        <a className="pill dark" href="quote.html" data-cta="what-quote">Request a quote</a>
      </div>
    </section>
  );
}
