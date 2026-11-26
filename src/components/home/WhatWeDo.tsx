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
  { id: 'new-build', title: 'New-build residential', text: 'We build luxury private residences and residential developments to a high specification, from planning through to handover.', job: 'New build' },
  { id: 'restoration', title: 'Refurbishment and restoration', text: 'We refurbish, alter and modernise existing and historic buildings while respecting their character.', job: 'Refurbishment or restoration' },
  { id: 'commercial', title: 'Commercial and healthcare', text: 'Our commercial work includes banking premises and specialist clinical facilities, with major works carried out while a building stays open.', job: 'Commercial or healthcare' },
  { id: 'electrical', title: 'Electrical installations', text: 'We carry out electrical installations for new homes, refurbishments and commercial fit-outs, coordinated with the rest of the build.', job: 'Electrical installation' },
  { id: 'pools', title: 'Swimming pools', text: 'We build swimming pools as an integral part of the home, such as the private infinity pool at Healy House.', job: 'Swimming pool' },
  { id: 'roofing', title: 'Roofing and waterproofing', text: 'We lay natural slate by hand and install waterproofing systems from our partner manufacturers in Germany and the UK.', job: 'Roofing or waterproofing' },
  { id: 'management', title: 'Project and construction management', text: 'We provide project and construction management, estimating and cost control, and coordinate specialist subcontractors and trades.', job: 'Project management' },
  { id: 'maintenance', title: 'Property maintenance', text: 'An independent property maintenance service will launch in 2027. Details will be published closer to the launch.', from: 'From 2027' },
] as const satisfies readonly Service[];

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
      <ol className="svc">
        {SERVICES.map((s: Service, i) => (
          <li key={s.id} className={s.from ? 'svc-i soon' : 'svc-i'}>
            <p className="svc-n">
              {pad2(i + 1)}
              {s.from && <span className="svc-from">{s.from}</span>}
            </p>
            <h3 className="svc-t">{s.title}</h3>
            <p className="svc-p">{s.text}</p>
            {s.job && (
              <a className="svc-a" href={`quote.html?job=${encodeURIComponent(s.job)}`} data-cta={`what-${s.id}`}>
                Request a quote<span className="sr-only">{` for ${s.title.toLowerCase()}`}</span> <span aria-hidden="true">→</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
