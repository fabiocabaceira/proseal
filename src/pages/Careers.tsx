import ApplyForm from '../components/forms/ApplyForm';

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
      <section className="ask" id="apply">
        <div className="ask-band">
          <p className="ask-k">Apply</p>
          <h2 className="h">
            Send us{" "}
            <em>your details.</em>
          </h2>
          <p className="ask-lead">Complete the short form and your email app will open with your application ready to send. Please attach your CV before you send it.</p>
          <p className="ask-call">
            <a href="mailto:info@prosealconstruction.com?subject=Application" data-cta="careers-mail">
              Prefer to write directly?{" "}
              <b>info@prosealconstruction.com</b>
            </a>
          </p>
          <p className="cr-note ask-ethos">
            Every project at ProSeal is planned and run with a strong focus on health and safety, quality and clear communication. We take responsibility for the work we undertake, and we expect the same of everyone on our team.
          </p>
        </div>
        <ApplyForm />
        {/* on phones the same note closes the section, under the form (the one in the band is hidden there) */}
        <p className="cr-note ask-ethos ask-ethos-m">
          Every project at ProSeal is planned and run with a strong focus on health and safety, quality and clear communication. We take responsibility for the work we undertake, and we expect the same of everyone on our team.
        </p>
      </section>
    </main>
  );
}
