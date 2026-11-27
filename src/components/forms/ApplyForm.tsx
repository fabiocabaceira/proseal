import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { track } from '../../lib/site';
import { LETTERS } from '../../lib/wordmark';

interface Values {
  readonly role: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly message: string;
}
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;
type Dir = 'forward' | 'back';

const ROLES = ['Civil Engineer', 'Quantity Surveyor'] as const;
const STEPS: readonly (readonly Field[])[] = [['role'], ['name', 'email'], ['phone', 'message']];
const LAST = STEPS.length - 1;
const EMPTY: Values = { role: '', name: '', email: '', phone: '', message: '' };

/* the one check, for the Continue of a step and for the send */
function check(v: Values, step: number): Errors {
  const errors: Errors = {};
  for (const f of STEPS[step]) {
    if (f === 'role' && !v.role) errors.role = 'Please choose a role.';
    if (f === 'name' && v.name.trim().length < 2) errors.name = 'Please add your name.';
    if (f === 'email' && !/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = 'Please add an email address so that we can reply.';
  }
  return errors;
}

function application(v: Values): string {
  const pairs: readonly (readonly [string, string])[] = [['Role', v.role], ['Name', v.name], ['Phone', v.phone], ['Email', v.email]];
  const lines = pairs
    .map(([label, value]) => [label, value.trim()])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);
  const note = v.message.trim();
  return [lines.join('\n'), note, '(Please attach your CV before sending.)'].filter(Boolean).join('\n\n');
}

const mailto = (v: Values, body: string) =>
  `mailto:info@prosealconstruction.com?subject=${encodeURIComponent(`Application: ${v.role}, ${v.name.trim()}`)}&body=${encodeURIComponent(body)}`;

interface FieldProps {
  readonly name: Field;
  readonly label: string;
  readonly hint?: string;
  readonly type?: string;
  readonly autoComplete?: string;
  readonly placeholder: string;
  readonly rows?: number;
  readonly value: string;
  readonly error?: string;
  readonly onChange: (name: Field, value: string) => void;
}

function TextField({ name, label, hint, type = 'text', autoComplete, placeholder, rows, value, error, onChange }: FieldProps) {
  const required = name === 'name' || name === 'email';
  const id = `af-${name}`;
  const errorId = `af-e-${name}`;
  const common = {
    id,
    name,
    value,
    placeholder,
    autoComplete,
    'aria-required': required || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: error ? 'bad' : undefined,
  };
  return (
    <div className="field qf-campo">
      <label htmlFor={id}>
        <span>
          {label}
          {hint && <> <small>{hint}</small></>}
        </span>
      </label>
      {rows
        ? <textarea {...common} rows={rows} onChange={(e) => onChange(name, e.target.value)} />
        : <input {...common} type={type} onChange={(e) => onChange(name, e.target.value)} />}
      {required && <p className="qf-err" id={errorId} role="alert">{error}</p>}
    </div>
  );
}

/* the application in three steps, the same card as the quote; it leaves as an email from the applicant's own mail app,
   where the CV is attached */
export default function ApplyForm() {
  const form = useRef<HTMLFormElement>(null);
  const okTitle = useRef<HTMLParagraphElement>(null);
  const latest = useRef(EMPTY);
  const at = useRef(0);
  const autoNext = useRef(0);
  const focusOn = useRef<Field | null>(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<Dir>('forward');
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

  const go = (to: number, focus: Field | null) => {
    if (to !== at.current) setDir(to < at.current ? 'back' : 'forward');
    at.current = to;
    focusOn.current = focus;
    setStep(to);
  };

  const update = (name: Field, value: string) => {
    latest.current = { ...latest.current, [name]: value };
    setValues(latest.current);
    setErrors((was) => {
      if (!was[name]) return was;
      const now = { ...was };
      delete now[name];
      return now;
    });
  };

  const next = () => {
    const i = at.current;
    const found = check(latest.current, i);
    const first = STEPS[i].find((f) => found[f]);
    setErrors(found);
    if (first) {
      focusOn.current = first;
      return;
    }
    go(i + 1, STEPS[i + 1][0]);
  };

  const back = () => {
    setErrors({});
    go(at.current - 1, STEPS[at.current - 1][0]);
  };

  const onRole = (role: string) => {
    update('role', role);
    if (autoNext.current) return;
    autoNext.current = window.setTimeout(() => {
      autoNext.current = 0;
      if (at.current === 0) next();
    }, 280);
  };

  /* Enter in a field of an earlier step moves on, instead of sending half an application */
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing || at.current === LAST || !(e.target instanceof HTMLInputElement)) return;
    e.preventDefault();
    next();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = latest.current;
    for (let i = 0; i <= LAST; i++) {
      const found = check(v, i);
      const first = STEPS[i].find((f) => found[f]);
      if (first) {
        go(i, first);
        setErrors(found);
        return;
      }
    }
    const body = application(v);
    track('application', { role: v.role });
    flushSync(() => setSent(body));
    okTitle.current?.focus();
    window.location.href = mailto(v, body);
  };

  const copy = () => {
    if (sent === null) return;
    const fail = () => setCopied('Copying did not work. Please select the message and copy it.');
    if (!navigator.clipboard) return fail();
    navigator.clipboard.writeText(sent).then(() => setCopied('Copied.'), fail);
  };

  const again = () => {
    latest.current = EMPTY;
    setValues(EMPTY);
    setErrors({});
    setCopied('');
    setSent(null);
    setDir('forward');
    at.current = 0;
    focusOn.current = 'role';
    setStep(0);
  };

  useEffect(() => () => clearTimeout(autoNext.current), []);

  useEffect(() => {
    const name = focusOn.current;
    if (!name) return;
    focusOn.current = null;
    const f = form.current;
    const el = name === 'role'
      ? f?.querySelector('input[name="role"]:checked') ?? f?.querySelector('input[name="role"]')
      : f?.elements.namedItem(name);
    if (el instanceof HTMLElement) el.focus({ preventScroll: true });
  });

  const field = (name: Field) => ({ name, value: values[name], error: errors[name], onChange: update });

  return (
    <form className="qf" id="applyForm" noValidate ref={form} onKeyDown={onKeyDown} onSubmit={onSubmit}>
      {sent === null ? (
        <>
          <div className="qf-barra" aria-hidden="true">
            {STEPS.map((_, i) => <span key={i} className="qf-barra-s" data-feito={i <= step || undefined} />)}
          </div>
          <p className="qf-conta" role="status">
            {"Step "}
            <b key={step}>{step + 1}</b>
            {` of ${STEPS.length}`}
          </p>
          <div className="qf-palco" data-dir={dir}>
            <div className="qf-passo" key={step}>
              {step === 0 && (
                <fieldset>
                  <legend id="af-l-role">Which role are you applying for?</legend>
                  <div
                    className="opts"
                    role="radiogroup"
                    aria-labelledby="af-l-role"
                    aria-required="true"
                    aria-invalid={errors.role ? true : undefined}
                    aria-describedby={errors.role ? 'af-e-role' : undefined}
                  >
                    {ROLES.map((role) => (
                      <label key={role} className="qf-campo">
                        <input type="radio" name="role" value={role} checked={values.role === role} onChange={() => onRole(role)} />
                        <span>
                          {role}
                          <i className="opt-dot" aria-hidden="true" />
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="qf-err" id="af-e-role" role="alert">{errors.role}</p>
                </fieldset>
              )}
              {step === 1 && (
                <fieldset>
                  <legend>Who are we speaking to?</legend>
                  <div className="qf-campos">
                    <TextField {...field('name')} label="Name" autoComplete="name" placeholder="Your full name" />
                    <TextField {...field('email')} label="Email" type="email" autoComplete="email" placeholder="So we can reply to you" />
                  </div>
                </fieldset>
              )}
              {step === 2 && (
                <fieldset>
                  <legend>A few words, then your CV</legend>
                  <div className="qf-campos">
                    <TextField {...field('phone')} label="Phone" hint="(optional)" type="tel" autoComplete="tel" placeholder="Your phone number" />
                    <TextField {...field('message')} label="A brief covering note" placeholder="Your experience, qualifications and when you could start" rows={3} />
                  </div>
                  <p className="af-cv">Your email app will open with your application. Attach your CV before you send it.</p>
                </fieldset>
              )}
            </div>
          </div>
          <div className="qf-nav">
            <button type="button" className="back" hidden={step === 0} onClick={back}>
              <span className="arw" aria-hidden="true">←</span>{" "}
              Back
            </button>
            <button type="button" className="pill qf-go" hidden={step === LAST} onClick={next}>
              Continue{" "}
              <span className="arw" aria-hidden="true">→</span>
            </button>
            <button type="submit" className="pill qf-go" hidden={step !== LAST} data-cta="careers-send">
              Prepare my application{" "}
              <span className="arw" aria-hidden="true">→</span>
            </button>
          </div>
        </>
      ) : (
        <div className="qf-ok" role="status">
          <div className="qf-ok-selo">
            <svg viewBox="0 0 64 64" role="img" aria-label="ProSeal">
              <rect className="qf-ok-aro" x=".75" y=".75" width="62.5" height="62.5" rx="14" />
              <path className="qf-ok-p-l" transform="translate(11.25 51.2) scale(0.02579)" d={LETTERS[0]} />
            </svg>
            <span className="qf-ok-visto" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M6.5 12.5l3.5 3.5 7.5-8" /></svg>
            </span>
          </div>
          <p className="qf-ok-t" tabIndex={-1} ref={okTitle}>Thank you. Your application is ready.</p>
          <p className="qf-ok-p">Your email app should now open with the message below, addressed to info@prosealconstruction.com. Please attach your CV before you send it.</p>
          <pre className="qf-ok-msg">{sent}</pre>
          <div className="qf-ok-acts">
            <a className="pill qf-go" href={mailto(values, sent)} data-cta="careers-open-email">
              Open email{" "}
              <span className="arw" aria-hidden="true">→</span>
            </a>
            <button type="button" className="pill qf-ok-copy" onClick={copy}>Copy message</button>
          </div>
          <p className="qf-ok-copied" aria-live="polite">{copied}</p>
          <button type="button" className="qf-ok-again" onClick={again}>Start another application</button>
        </div>
      )}
    </form>
  );
}
