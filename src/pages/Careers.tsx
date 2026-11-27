import ApplyForm from '../components/forms/ApplyForm';
import ProSealMark from '../components/forms/ProSealMark';

const ROLES = [
  {
    id: 'civil-engineers',
    title: 'Civil Engineers',
    text: [
      'Our civil engineers work on structural and general building works across new-build, refurbishment, commercial and healthcare projects, alongside our project and construction managers from early planning through to completion and handover.',
      'We look for engineers who plan carefully, identify issues early and maintain the highest standards of safety and workmanship on site.',
    ],
  },
  {
    id: 'quantity-surveyors',
    title: 'Quantity Surveyors',
    text: [
      'Our quantity surveyors lead estimating and cost control, from the first estimate to the final account, and work closely with clients, consultants and specialist subcontractors.',
      'We look for surveyors who keep close control of cost and programme, and who communicate clearly with everyone involved in a project.',
    ],
  },
] as const;

export default function CareersPage() {
  return (
    <main id="main">
      <header className="wk-head cr-head">
        <h1 className="h">
          Build your career{" "}
          <em>with ProSeal.</em>
        </h1>
        <div className="wk-side">
          <p className="page-lead">
            ProSeal Construction has been building in Gibraltar since 2002 and employs around 100 people. We would like to hear from civil engineers and quantity surveyors who want to work on demanding residential, commercial and healthcare projects.
          </p>
          <p className="cr-jump">
            <a className="pill dark" href="#apply" data-cta="careers-apply">Apply now</a>
          </p>
        </div>
      </header>
      <section className="cr-roles" aria-labelledby="roles">
        <h2 className="pj-k" id="roles">The roles we recruit for</h2>
        <div className="cr-grid">
          {ROLES.map((r) => (
            <article className="cr-role" id={r.id} key={r.id}>
              <h3 className="pj-name">{r.title}</h3>
              {r.text.map((t) => <p className="pj-p" key={t}>{t}</p>)}
            </article>
          ))}
        </div>
      </section>
      {/* the same card as the quote: three short steps, the address a quiet line at its foot, the ethos note under it */}
      <section className="ask aq" id="apply">
        <div className="aq-col">
          <div className="aq-head">
            <ProSealMark />
            <p className="aq-k">Apply</p>
            <h2 className="aq-h">
              Send us{" "}
              <em>your details.</em>
            </h2>
            <p className="aq-lead">Three short steps, then your email app opens with your application.</p>
          </div>
          <ApplyForm />
          <p className="aq-links">
            <a href="mailto:info@prosealconstruction.com?subject=Application" data-cta="careers-mail">info@prosealconstruction.com</a>
          </p>
        </div>
        <p className="aq-note">
          Every project at ProSeal is planned and run with a strong focus on health and safety, quality and clear communication. We take responsibility for the work we undertake, and we expect the same of everyone on our team.
        </p>
      </section>
    </main>
  );
}
