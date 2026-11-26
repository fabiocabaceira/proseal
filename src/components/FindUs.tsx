const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=3%2F1+City+Mill+Lane+Gibraltar+GX11+1AA';

interface Way {
  readonly id: string;
  readonly label: string;
  readonly lines: readonly string[];
  readonly href: string;
  readonly action: string;
  readonly icon: string;
  readonly external?: boolean;
}

const WAYS = [
  { id: 'contact-map', label: 'Office', lines: ['3/1 City Mill Lane', 'Gibraltar GX11 1AA'], href: DIRECTIONS, action: 'Directions', icon: 'i-pin', external: true },
  { id: 'contact-call', label: 'Telephone', lines: ['+350 200 47974'], href: 'tel:+35020047974', action: 'Call', icon: 'i-call' },
  { id: 'contact-mail', label: 'Email', lines: ['info@prosealconstruction.com'], href: 'mailto:info@prosealconstruction.com', action: 'Write', icon: 'i-mail' },
] as const satisfies readonly Way[];

/* where to find us: the office card on the left, each line of it a direct way in; a view of Gibraltar from one of our sites on the right */
export default function FindUs() {
  return (
    <section className="find" id="contact" aria-labelledby="find-h">
      <p className="find-k">
        <span>Proseal Construction Ltd</span>
        <span>Gibraltar</span>
      </p>
      <div className="find-copy">
        <h2 className="h find-h" id="find-h">
          Where to{" "}
          <em>find us.</em>
        </h2>
        <p className="find-p">Call, write or come and see us at our office.</p>
        <address className="find-card">
          <ul>
            {WAYS.map((w: Way) => (
              <li key={w.id}>
                <a className="find-row" href={w.href} data-cta={w.id} {...(w.external ? { target: '_blank', rel: 'noopener' } : {})}>
                  <span className="find-l">{w.label}</span>
                  <span className="find-v">{w.lines.map((l) => <span key={l}>{l}</span>)}</span>
                  <span className="find-a">
                    <svg className="find-ico" aria-hidden="true"><use href={`#${w.icon}`} /></svg>
                    <span>{w.action}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </address>
      </div>
      <figure className="find-view">
        <img src="img/site-view-900.webp" srcSet="img/site-view-900.webp 900w, img/site-view-1600.webp 1600w" sizes="(min-width:900px) 54vw, 100vw" alt="A ProSeal site seen from above, with the Bay of Gibraltar behind" loading="lazy" decoding="async" />
        <figcaption>Gibraltar, from one of our sites</figcaption>
      </figure>
    </section>
  );
}
