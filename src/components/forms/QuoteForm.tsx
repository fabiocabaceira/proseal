import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { readLeadSource } from '../../lib/lead';
import { track } from '../../lib/site';
import { LETTERS } from '../../lib/wordmark';
import { pad2 } from '../home/ring';
import ProSealMark from './ProSealMark';

interface Values {
  readonly job: string;
  readonly place: string;
  readonly details: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
}
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;
type Dir = 'forward' | 'back';

const JOBS = ['New build', 'Refurbishment or restoration', 'Commercial or healthcare', 'Electrical installation', 'Swimming pool', 'Roofing or waterproofing', 'Project management', 'Something else'] as const;
const STEPS: readonly (readonly Field[])[] = [['job'], ['place', 'details'], ['name', 'phone', 'email']];
const LAST = STEPS.length - 1;
const REQUIRED: Errors = {
  job: 'Please choose the kind of project.',
  name: 'Please add your name.',
  phone: 'Please add a phone number so that we can reach you.',
};
const EMPTY: Values = { job: '', place: '', details: '', name: '', phone: '', email: '' };

/* the one check, for the Continue of a step and for the send */
function check(v: Values, step: number): Errors {
  const errors: Errors = {};
  for (const f of STEPS[step]) {
    const message = REQUIRED[f];
    if (message && v[f].trim().length < 2) errors[f] = message;
  }
  return errors;
}

/* an empty field leaves no line in the email */
function enquiry(v: Values, source: string): string {
  const details = v.details.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
  const lines: readonly (readonly [string, string])[] = [
    ['Project', v.job], ['Location', v.place], ['Details', details], ['Name', v.name], ['Phone', v.phone], ['Email', v.email], ['Source', source],
  ];
  return lines.map(([label, value]) => [label, value.trim()]).filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n');
}

const mailto = (job: string, body: string) =>
  `mailto:info@prosealconstruction.com?subject=${encodeURIComponent(`Quote request: ${job}`)}&body=${encodeURIComponent(body)}`;

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
  const required = name in REQUIRED;
  const id = `qf-${name}`;
  const errorId = `qf-e-${name}`;
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

/* the quote form in three steps; the enquiry leaves as an email from the visitor's own mail app */
export default function QuoteForm() {
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
  const [source, setSource] = useState('direct');

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

  const onJob = (e: ChangeEvent<HTMLInputElement>) => {
    update('job', e.target.value);
    if (autoNext.current) return;
    autoNext.current = window.setTimeout(() => {
      autoNext.current = 0;
      if (at.current === 0) next();
    }, 280);
  };

  /* Enter in a field of an earlier step moves on: left to the browser, it presses the hidden send button and sends half an enquiry */
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
    const body = enquiry(v, source);
    track('lead', { source, job: v.job });
    flushSync(() => setSent(body));
    okTitle.current?.focus();
    window.location.href = mailto(v.job, body);
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
    focusOn.current = 'job';
    setStep(0);
  };

  useEffect(() => {
    setSource(readLeadSource());
    const job = new URLSearchParams(location.search).get('job');
    if (job && (JOBS as readonly string[]).includes(job)) {
      latest.current = { ...latest.current, job };
      setValues(latest.current);
      at.current = 1;
      setStep(1);
    }
    return () => clearTimeout(autoNext.current);
  }, []);

  useEffect(() => {
    const name = focusOn.current;
    if (!name) return;
    focusOn.current = null;
    const f = form.current;
    const el = name === 'job'
      ? f?.querySelector('input[name="job"]:checked') ?? f?.querySelector('input[name="job"]')
      : f?.elements.namedItem(name);
    if (el instanceof HTMLElement) el.focus({ preventScroll: true });
  });

  const field = (name: Field) => ({ name, value: values[name], error: errors[name], onChange: update });

  return (
    <form className="steps qf" id="quoteForm" noValidate ref={form} onKeyDown={onKeyDown} onSubmit={onSubmit}>
      <div className="qf-head" hidden={sent !== null}>
        <ProSealMark />
        <div className="qf-head-r">
          <span className="qf-title">Quote request</span>
          <p className="qf-conta" id="stepCount" role="status">
            <span className="sr-only">{`Step ${step + 1} of ${STEPS.length}`}</span>
            <span aria-hidden="true"><b key={step}>{pad2(step + 1)}</b>{` / ${pad2(STEPS.length)}`}</span>
          </p>
        </div>
      </div>
      {sent === null ? (
        <>
          <div className="qf-barra" aria-hidden="true">
            {STEPS.map((_, i) => <span key={i} className="qf-barra-s" data-feito={i <= step || undefined} />)}
          </div>
          <div className="qf-palco" data-dir={dir}>
            <div className="qf-passo" key={step}>
              {step === 0 && (
                <fieldset>
                  <legend id="qf-l-job">What kind of project is it?</legend>
                  <div
                    className="opts"
                    role="radiogroup"
                    aria-labelledby="qf-l-job"
                    aria-required="true"
                    aria-invalid={errors.job ? true : undefined}
                    aria-describedby={errors.job ? 'qf-e-job' : undefined}
                  >
                    {JOBS.map((job) => (
                      <label key={job} className="qf-campo">
                        <input type="radio" name="job" value={job} checked={values.job === job} onChange={onJob} />
                        <span>
                          {job}
                          <i className="opt-dot" aria-hidden="true" />
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="qf-err" id="qf-e-job" role="alert">{errors.job}</p>
                </fieldset>
              )}
              {step === 1 && (
                <fieldset>
                  <legend>Tell us about the project</legend>
                  <div className="qf-campos">
                    <TextField {...field('place')} label="Location in Gibraltar" autoComplete="street-address" placeholder="Street or area" />
                    <TextField {...field('details')} label="What does the work involve?" placeholder="A few lines are plenty" rows={3} />
                  </div>
                </fieldset>
              )}
              {step === 2 && (
                <fieldset>
                  <legend>How can we reach you?</legend>
                  <div className="qf-campos">
                    <TextField {...field('name')} label="Name" autoComplete="name" placeholder="Your name" />
                    <TextField {...field('phone')} label="Phone" type="tel" autoComplete="tel" placeholder="Your phone number" />
                    <TextField {...field('email')} label="Email" hint="(optional)" type="email" autoComplete="email" placeholder="If you would rather we emailed you" />
                  </div>
                </fieldset>
              )}
            </div>
          </div>
          <div className="steps-nav qf-nav">
            <button type="button" className="back" id="stepBack" hidden={step === 0} onClick={back}>
              <span className="arw" aria-hidden="true">←</span>{" "}
              Back
            </button>
            <button type="button" className="pill dark" id="stepNext" hidden={step === LAST} onClick={next}>
              Continue{" "}
              <span className="arw" aria-hidden="true">→</span>
            </button>
            <button type="submit" className="pill dark" id="stepSend" hidden={step !== LAST} data-cta="form-send">
              Send enquiry{" "}
              <span className="arw" aria-hidden="true">→</span>
            </button>
          </div>
        </>
      ) : (
        <div className="qf-ok" id="formDone" role="status">
          <div className="qf-ok-selo">
            <svg viewBox="0 0 64 64" role="img" aria-label="ProSeal">
              <defs>
                <linearGradient id="qf-ok-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#143a69" />
                  <stop offset="1" stopColor="#0b2140" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="14" fill="url(#qf-ok-g)" />
              <path fill="#fff" transform="translate(11.25 51.2) scale(0.02579)" d={LETTERS[0]} />
            </svg>
            <span className="qf-ok-visto" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M6.5 12.5l3.5 3.5 7.5-8" /></svg>
            </span>
          </div>
          <p className="qf-ok-t" tabIndex={-1} ref={okTitle}>Thank you. Your enquiry is ready.</p>
          <p className="qf-ok-p">Your email app should now open with the message below, addressed to info@prosealconstruction.com. If it does not, open it again or copy the message. You can also call us on +350 200 47974.</p>
          <pre className="qf-ok-msg">{sent}</pre>
          <div className="qf-ok-acts">
            <a className="pill dark" href={mailto(values.job, sent)} data-cta="form-open-email">
              Open email{" "}
              <span className="arw" aria-hidden="true">→</span>
            </a>
            <button type="button" className="pill qf-ok-copy" onClick={copy}>Copy message</button>
          </div>
          <p className="qf-ok-copied" aria-live="polite">{copied}</p>
          <button type="button" className="qf-ok-again" onClick={again}>Send another enquiry</button>
        </div>
      )}
    </form>
  );
}
