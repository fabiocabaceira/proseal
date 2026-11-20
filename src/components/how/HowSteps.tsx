import { Fragment, useEffect, useRef, useState, type AnimationEvent } from 'react';
import { track } from '../../lib/site';

const STEPS = [
  { title: 'Survey and quote', body: 'We visit, measure and price the work in writing.' },
  { title: 'Build', body: 'Our own staff on site, materials bought direct by our buying department.' },
  { title: 'Handover', body: 'Keys, and an after build service once you have moved in.' },
] as const;

const FIGS = [
  <>
    <rect className="s" pathLength="1" x="24" y="14" width="152" height="122" />
    <path className="s" pathLength="1" d="M44 104h70V58H44zM114 104h42V78h-42M44 58l35-22 35 22M62 104V84h16v20" />
    <path className="s d2" pathLength="1" d="M44 118h112M44 114v8M156 114v8" />
  </>,
  <>
    <path className="s" pathLength="1" d="M30 120h140M46 120V64l54-34 54 34v56" />
    <path className="s d2" pathLength="1" d="M46 92h108M78 120V92M122 120V92M100 30v62" />
    <path className="s d3" pathLength="1" d="M150 20v34M136 34h28" />
  </>,
  <>
    <circle className="s" pathLength="1" cx="66" cy="75" r="26" />
    <circle className="s d2" pathLength="1" cx="66" cy="75" r="8" />
    <path className="s d2" pathLength="1" d="M92 75h78M150 75v18M132 75v12" />
  </>,
];

/* how we work: one step open at a time, with its drawing; it moves on by itself until someone chooses */
export default function HowSteps() {
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const [manual, setManual] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) setInView(e.isIntersecting);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const choose = (k: number) => {
    setOpen(k);
    setManual(true);
    track('step_open', { step: k + 1 });
  };

  /* the line over the open step fills in CSS (animation "fill"); when it is full the next step opens */
  const onFilled = (e: AnimationEvent<HTMLOListElement>) => {
    if (e.animationName === 'fill' && !manual) setOpen((k) => (k + 1) % STEPS.length);
  };

  return (
    <section className={['how', inView && 'in', manual && 'manual'].filter(Boolean).join(' ')} id="how" ref={section}>
      <h1 className="h">
        Three steps,{" "}
        <em>one team.</em>
      </h1>
      <div className="stage" aria-hidden="true">
        {FIGS.map((fig, k) => (
          <Fragment key={k}>
            {k > 0 && ' '}
            <svg className={k === open ? 'fig is-on' : 'fig'} viewBox="0 0 200 150">{fig}</svg>
          </Fragment>
        ))}
      </div>
      <ol className="steplist" id="steplist" onAnimationEnd={onFilled}>
        {STEPS.map((s, k) => (
          <li key={s.title} className={k === open ? 'is-on' : undefined}>
            <h2>
              <button type="button" aria-expanded={k === open} onClick={() => choose(k)}>
                <span className="n">{k + 1}</span>
                {s.title}
              </button>
            </h2>
            <div className="body"><p>{s.body}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
