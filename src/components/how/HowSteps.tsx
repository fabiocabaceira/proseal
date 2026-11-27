import { Fragment, useEffect, useRef, useState, type AnimationEvent } from 'react';
import { track } from '../../lib/site';

const STEPS = [
  { title: 'Survey and quote', body: 'We visit the site, take measurements and send you a written quote.' },
  { title: 'Build', body: 'Our own staff run the site, with trusted specialist subcontractors where the work calls for them. Our buying department purchases materials directly, and we keep you informed on programme and cost throughout.' },
  { title: 'Handover', body: 'We hand over the keys, and our aftercare continues once you have moved in.' },
] as const;

const FIGS = [
  <>
    <rect className="s" pathLength="1" x="24" y="14" width="152" height="122" />
    <path className="s" pathLength="1" d="M44 104h70V58H44zM114 104h42V78h-42M44 58l35-22 35 22M62 104V84h16v20" />
    <path className="s d2" pathLength="1" d="M44 118h112M44 114v8M156 114v8" />
  </>,
  <>
    {/* build: the frame going up inside its scaffolding, the crane lifting a pallet of materials bought direct,
        and the programme sheet that keeps the client informed */}
    <path className="s" pathLength="1" d="M14 128h172M62 128V74h62v54M62 101h62M83 128V74M103 128V74" />
    <path className="s" pathLength="1" d="M124 128V66M140 128V66M124 112h16M124 96h16M124 80h16M124 66h16M124 112l16-16M124 80l16-14" />
    <path className="s d2" pathLength="1" d="M40 128V22M40 22V12M28 22h104M28 22v7h9v-7M40 12L28 22M40 12l92 10M112 22v20" />
    <path className="s d2" pathLength="1" d="M104 42h16v10h-16zM104 47h16" />
    <path className="s d3" pathLength="1" d="M146 26h38v32h-38zM152 35h20M152 42h26M152 49h12" />
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
