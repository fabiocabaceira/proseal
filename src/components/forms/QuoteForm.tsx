import { Fragment, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { readLeadSource } from '../../lib/lead';
import { track } from '../../lib/site';

type Required = 'job' | 'name' | 'phone';

interface QuoteRequest {
  readonly job: string;
  readonly place: string;
  readonly details: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly source: string;
}

const JOBS = ['New build', 'Refurbishment or restoration', 'Commercial or healthcare', 'Electrical installation', 'Swimming pool', 'Roofing or waterproofing', 'Project management', 'Something else'] as const;
const REQUIRED: readonly (readonly Required[])[] = [['job'], [], ['name', 'phone']];
const LAST = REQUIRED.length - 1;
const NONE: ReadonlySet<Required> = new Set();

function readRequest(form: HTMLFormElement): QuoteRequest {
  const data = new FormData(form);
  const text = (key: keyof QuoteRequest): string => {
    const value = data.get(key);
    return typeof value === 'string' ? value : '';
  };
  return {
    job: text('job'),
    place: text('place'),
    details: text('details'),
    name: text('name'),
    phone: text('phone'),
    email: text('email'),
    source: text('source'),
  };
}

function mailto(q: QuoteRequest): string {
  const body = `Project: ${q.job}\nLocation: ${q.place}\nDetails: ${q.details}\n\nName: ${q.name}\nPhone: ${q.phone}\nEmail: ${q.email}\n\nSource: ${q.source}`;
  return `mailto:info@prosealconstruction.com?subject=${encodeURIComponent(`Quote request: ${q.job}`)}&body=${encodeURIComponent(body)}`;
}

/* the quote form in three steps; the request leaves as an email from the visitor's own mail app */
export default function QuoteForm() {
  const form = useRef<HTMLFormElement>(null);
  const fieldsets = useRef<(HTMLFieldSetElement | null)[]>([]);
  const done = useRef<HTMLParagraphElement>(null);
  const current = useRef(0);
  const autoNext = useRef(0);
  const [step, setStep] = useState(0);
  const [bad, setBad] = useState(NONE);
  const [sent, setSent] = useState(false);
  const [source, setSource] = useState('direct');

  const show = (i: number) => {
    current.current = i;
    setStep(i);
  };

  const filled = (name: Required): boolean => {
    const f = form.current;
    if (!f) return false;
    if (name === 'job') return f.querySelector('input[name="job"]:checked') !== null;
    const input = f.elements.namedItem(name);
    return input instanceof HTMLInputElement && input.value.trim().length > 1;
  };

  const valid = (i: number): boolean => {
    const missing = REQUIRED[i].filter((name) => !filled(name));
    setBad((was) => {
      const now = new Set(was);
      for (const name of REQUIRED[i]) {
        if (missing.includes(name)) now.add(name);
        else now.delete(name);
      }
      return now;
    });
    const first = missing[0];
    const input = first && first !== 'job' ? form.current?.elements.namedItem(first) : null;
    if (input instanceof HTMLInputElement) input.focus();
    return missing.length === 0;
  };

  const next = () => {
    const i = current.current;
    if (!valid(i)) return;
    flushSync(() => show(i + 1));
    fieldsets.current[i + 1]?.querySelector<HTMLElement>('input,textarea')?.focus({ preventScroll: true });
  };

  const back = () => show(current.current - 1);

  const onJob = () => {
    if (autoNext.current) return;
    autoNext.current = window.setTimeout(() => {
      autoNext.current = 0;
      if (current.current === 0) next();
    }, 280);
  };

  /* Enter in a field of an earlier step moves on: left to the browser, it presses the hidden send button and sends half a request */
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing || current.current === LAST || !(e.target instanceof HTMLInputElement)) return;
    e.preventDefault();
    next();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid(current.current)) return;
    const request = readRequest(e.currentTarget);
    track('lead', { source: request.source, job: request.job });
    flushSync(() => setSent(true));
    done.current?.focus();
    window.location.href = mailto(request);
  };

  useEffect(() => {
    setSource(readLeadSource());
    const job = new URLSearchParams(location.search).get('job');
    const radios = form.current?.querySelectorAll<HTMLInputElement>('input[name="job"]') ?? [];
    const chosen = [...radios].find((r) => r.value === job);
    if (chosen) {
      chosen.checked = true;
      show(1);
    }
    return () => clearTimeout(autoNext.current);
  }, []);

  const stepClass = (k: number) => (k === step ? 'step is-on' : 'step');

  return (
    <form className="steps" id="quoteForm" noValidate data-step={step} ref={form} onKeyDown={onKeyDown} onSubmit={onSubmit}>
      <input type="hidden" name="source" id="leadSource" value={source} />
      <p className="level" aria-hidden="true"><i /></p>
      <p className="steps-count" id="stepCount" aria-live="polite">{`${step + 1} / ${REQUIRED.length}`}</p>
      <fieldset className={stepClass(0)} ref={(el) => { fieldsets.current[0] = el; }}>
        <legend>What kind of project is it?</legend>
        <div className="opts">
          {JOBS.map((job, k) => (
            <Fragment key={job}>
              {k > 0 && ' '}
              <label>
                <input type="radio" name="job" value={job} required={k === 0} className={k === 0 && bad.has('job') ? 'bad' : undefined} onChange={onJob} />
                <span>{job}</span>
              </label>
            </Fragment>
          ))}
        </div>
      </fieldset>
      <fieldset className={stepClass(1)} ref={(el) => { fieldsets.current[1] = el; }}>
        <legend>Tell us about the project</legend>
        <label className="field">
          <span>Location in Gibraltar</span>
          <input type="text" name="place" autoComplete="street-address" placeholder="Street or area" />
        </label>
        {" "}
        <label className="field">
          <span>What does the work involve?</span>
          <textarea name="details" rows={2} placeholder="A few lines are plenty" />
        </label>
      </fieldset>
      <fieldset className={stepClass(2)} ref={(el) => { fieldsets.current[2] = el; }}>
        <legend>How can we reach you?</legend>
        <label className="field">
          <span>Name</span>
          <input type="text" name="name" autoComplete="name" required placeholder="Your name" className={bad.has('name') ? 'bad' : undefined} />
        </label>
        {" "}
        <label className="field">
          <span>Phone</span>
          <input type="tel" name="phone" autoComplete="tel" required placeholder="Your phone number" className={bad.has('phone') ? 'bad' : undefined} />
        </label>
        {" "}
        <label className="field">
          <span>
            Email{" "}
            <small>(optional)</small>
          </span>
          <input type="email" name="email" autoComplete="email" placeholder="If you prefer us to email you" />
        </label>
      </fieldset>
      <div className="steps-nav">
        <button type="button" className="back" id="stepBack" hidden={step === 0} onClick={back}>Back</button>
        {" "}
        <button type="button" className="pill dark" id="stepNext" hidden={step === LAST} onClick={next}>Continue</button>
        {" "}
        <button type="submit" className="pill dark" id="stepSend" hidden={step !== LAST} data-cta="form-send">
          Send request{" "}
          <span className="arw" aria-hidden="true">→</span>
        </button>
      </div>
      <p className="done" id="formDone" hidden={!sent} tabIndex={-1} ref={done}>Your email app should now open with the request ready to send. If it does not, please call +350 200 47974.</p>
    </form>
  );
}
