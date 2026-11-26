import { Fragment, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { track } from '../../lib/site';

type Required = 'role' | 'name' | 'email';

const ROLES = ['Civil Engineer', 'Quantity Surveyor'] as const;

interface Application {
  readonly role: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly message: string;
}

function readApplication(form: HTMLFormElement): Application {
  const data = new FormData(form);
  const text = (key: keyof Application): string => {
    const value = data.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };
  return { role: text('role'), name: text('name'), phone: text('phone'), email: text('email'), message: text('message') };
}

function mailto(a: Application): string {
  const body = `Role: ${a.role}\nName: ${a.name}\nPhone: ${a.phone}\nEmail: ${a.email}\n\n${a.message}\n\n(Please attach your CV before sending.)`;
  return `mailto:info@prosealconstruction.com?subject=${encodeURIComponent(`Application: ${a.role}, ${a.name}`)}&body=${encodeURIComponent(body)}`;
}

/* the application form; like the quote form, it leaves as an email from the applicant's own mail app, where the CV is attached */
export default function ApplyForm() {
  const done = useRef<HTMLParagraphElement>(null);
  const [bad, setBad] = useState<ReadonlySet<Required>>(new Set());
  const [sent, setSent] = useState(false);

  const missing = (f: HTMLFormElement): Required[] => {
    const a = readApplication(f);
    const out: Required[] = [];
    if (!a.role) out.push('role');
    if (a.name.length < 2) out.push('name');
    if (!/^\S+@\S+\.\S+$/.test(a.email)) out.push('email');
    return out;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const gaps = missing(f);
    setBad(new Set(gaps));
    const first = gaps.find((g) => g !== 'role');
    if (gaps.length) {
      const input = first ? f.elements.namedItem(first) : null;
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    const application = readApplication(f);
    track('application', { role: application.role });
    flushSync(() => setSent(true));
    done.current?.focus();
    window.location.href = mailto(application);
  };

  return (
    <form className="steps apply" id="applyForm" noValidate onSubmit={onSubmit}>
      <fieldset>
        <legend>Which role are you applying for?</legend>
        <div className={bad.has('role') ? 'opts bad' : 'opts'}>
          {ROLES.map((role, k) => (
            <Fragment key={role}>
              {k > 0 && ' '}
              <label>
                <input type="radio" name="role" value={role} required={k === 0} />
                <span>{role}</span>
              </label>
            </Fragment>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="sr-only">Your details</legend>
        <label className="field">
          <span>Name</span>
          <input type="text" name="name" autoComplete="name" required placeholder="Your full name" className={bad.has('name') ? 'bad' : undefined} />
        </label>
        {" "}
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" required placeholder="So we can reply to you" className={bad.has('email') ? 'bad' : undefined} />
        </label>
        {" "}
        <label className="field">
          <span>
            Phone{" "}
            <small>(optional)</small>
          </span>
          <input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" />
        </label>
        {" "}
        <label className="field">
          <span>A brief covering note</span>
          <textarea name="message" rows={3} placeholder="Your experience, qualifications and when you could start" />
        </label>
      </fieldset>
      <div className="steps-nav">
        <button type="submit" className="pill dark" data-cta="careers-send">
          Prepare my application{" "}
          <span className="arw" aria-hidden="true">→</span>
        </button>
      </div>
      <p className="done" hidden={!sent} tabIndex={-1} ref={done}>Your email app should now open with your application. Please attach your CV before you send it.</p>
    </form>
  );
}
