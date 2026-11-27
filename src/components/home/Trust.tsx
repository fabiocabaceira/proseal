/* Selected commissions and institutional clients, set in type. These are names, not the clients' own logos: no crest,
   seal or mark of theirs is drawn here. The only mark on the band is ProSeal's own wordmark. */
interface Client {
  readonly id: string;
  /** the name as it is set: a small line above, the main line, a small line below */
  readonly pre?: string;
  readonly main: string;
  readonly post?: string;
  readonly kind: string;
  /** the project on the works page, where there is one */
  readonly href?: string;
}

const CLIENTS = [
  { id: 'turicum', main: 'Turicum', post: 'Private Bank', kind: 'Commercial', href: 'works.html#turicum-private-bank' },
  { id: 'gibmed', main: 'GibMed', post: 'Clinic ICC', kind: 'Healthcare', href: 'works.html#gibmed-clinic-icc' },
  { id: 'government', pre: 'Government of', main: 'Gibraltar', kind: 'Government departments' },
  { id: 'buena-vista', main: 'Buena Vista', post: 'Villa', kind: 'Luxury residential villa', href: 'works.html#buena-vista-villa' },
  { id: 'healy', main: 'Healy House', kind: 'Luxury private residence', href: 'works.html#healy-house' },
  { id: 'beacon', pre: 'The Villas', main: 'Beacon Point', kind: 'Residential development', href: 'works.html#beacon-point' },
] as const satisfies readonly Client[];

function Wordmark({ c }: { readonly c: Client }) {
  return (
    <>
      <span className="tw-name">
        {c.pre && <span className="tw-pre">{c.pre} </span>}
        <span className="tw-main">{c.main}</span>
        {c.post && <span className="tw-post"> {c.post}</span>}
      </span>
      <span className="tw-kind">{c.kind}</span>
    </>
  );
}

export default function Trust() {
  return (
    <section className="trust" aria-labelledby="trust-k">
      <div className="trust-head">
        <p className="trust-k" id="trust-k">Selected commissions and institutional clients</p>
        <p className="trust-p">
          Our clients include <em>private individuals</em>, <em>corporations</em> and <em>Government departments</em>.
        </p>
        <p className="trust-sig">
          <span className="logo-box trust-mark"><svg viewBox="0 0 8808 1700" role="img" aria-label="ProSeal"><use href="#wm" /></svg></span>
          <span className="trust-sig-t">
            ProSeal Construction Ltd
            <small>Gibraltar, since 2002</small>
          </span>
        </p>
      </div>
      <ul className="trust-list">
        {CLIENTS.map((c: Client) => (
          <li key={c.id} className={`tw tw-${c.id}`}>
            {c.href ? (
              <a href={c.href} data-cta={`trust-${c.id}`}>
                <Wordmark c={c} />
                <svg className="tw-go" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </a>
            ) : (
              <div>
                <Wordmark c={c} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
