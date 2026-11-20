import { Fragment, useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type SetStateAction } from 'react';
import { useInView } from '../../hooks/home/useInView';
import { armFilm, isCalm, isWide } from '../../lib/site';
import { pad2 } from './ring';

interface Render {
  readonly slug: string;
  readonly name: string;
  readonly alt: string;
  readonly widths: readonly number[];
}

const RENDERS = [
  { slug: 'beacon-villa', name: 'The villas', alt: 'Render of a villa at Beacon Point, glass balconies and timber screens', widths: [900, 1600] },
  { slug: 'beacon-group', name: 'The terraces', alt: 'Render of the homes at Beacon Point, glass balconies and garden terraces', widths: [900, 1600, 1900] },
  { slug: 'beacon-poolday', name: 'The communal pool', alt: 'Render of the communal pool at Beacon Point, palms and townhouses around it', widths: [900, 1600, 1900] },
] as const satisfies readonly Render[];

const AUTO_MS = 6000;

/* the developer's aerial film plays only while it is on screen, and never with reduced motion */
function useDevFilm() {
  const film = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = film.current;
    if (!v) return;
    if (isWide() && v.dataset.posterWide) v.poster = v.dataset.posterWide;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !isCalm() && armFilm(v)) v.play().catch(() => {});
        else v.pause();
      }),
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => { io.disconnect(); v.pause(); };
  }, []);
  return film;
}

/* the renders: one picture at a time, chosen from the index; it moves on by itself while on screen, and stops while a
   mouse is over it or once a picture has been chosen */
function DevShow() {
  const box = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef(0);
  const [on, setOn] = useState(0);
  const [auto, setAuto] = useState(false);
  const [shows, setShows] = useState(0);
  const seen = useInView(box, 0.3);

  const show = (next: SetStateAction<number>) => {
    setOn(next);
    setShows((n) => n + 1);
  };
  const stop = () => {
    clearInterval(timer.current);
    timer.current = 0;
    setAuto(false);
  };
  const go = () => {
    if (timer.current || isCalm() || !seen) return;
    setAuto(true);
    show((k) => k);
    timer.current = window.setInterval(() => show((k) => (k + 1) % RENDERS.length), AUTO_MS);
  };

  const onSeen = useEffectEvent((visible: boolean) => {
    if (visible) go();
    else stop();
  });
  useEffect(() => { onSeen(seen); }, [seen]);

  useEffect(() => () => clearInterval(timer.current), []);

  /* restart the run line under the chosen picture even when it was already the one on */
  useLayoutEffect(() => {
    const b = buttons.current[on];
    if (!shows || !b) return;
    b.classList.remove('is-on');
    void b.offsetWidth;
    b.classList.add('is-on');
  }, [on, shows]);

  return (
    <div
      className={auto ? 'dev-show auto' : 'dev-show'}
      id="devShow"
      data-on={on}
      ref={box}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') stop(); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') go(); }}
    >
      <div className="dev-pic">
        {RENDERS.map((r, i) => (
          <Fragment key={r.slug}>
            {i > 0 && " "}
            <img className={i === on ? 'is-on' : undefined} src={`img/${r.slug}-900.webp`} srcSet={r.widths.map((w) => `img/${r.slug}-${w}.webp ${w}w`).join(', ')} sizes="(min-width:900px) 1240px, 140vw" alt={r.alt} loading="lazy" decoding="async" />
          </Fragment>
        ))}
        <div className="dev-cap" aria-hidden="true">
          <p className="dev-no">
            {RENDERS.map((r, i) => <b key={r.slug}>{pad2(i + 1)}</b>)}
            <span>{`/ ${pad2(RENDERS.length)}`}</span>
          </p>
          <p className="dev-name">
            {RENDERS.map((r) => <span key={r.slug}>{r.name}</span>)}
          </p>
        </div>
      </div>
      <ol className="dev-index">
        {RENDERS.map((r, i) => (
          <li key={r.slug}>
            <button
              type="button"
              className={i === on ? 'is-on' : undefined}
              aria-pressed={i === on}
              ref={(el) => { buttons.current[i] = el; }}
              onClick={() => { stop(); show(i); }}
            >
              <img src={`img/${r.slug}-400.webp`} alt="" loading="lazy" decoding="async" width={400} />
              <span>{pad2(i + 1)}</span>
              {r.name}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Development() {
  const film = useDevFilm();
  return (
    <section className="dev" id="development">
      <p className="dev-k">
        <span>In development</span>
        <span>Europa Point, Gibraltar</span>
      </p>
      <figure className="dev-film">
        <video ref={film} id="devFilm" data-src="img/beacon-loop-720.mp4" data-src-wide="img/beacon-loop.mp4" poster="img/beacon-poster-900.webp" data-poster-wide="img/beacon-poster-1600.webp" muted loop playsInline preload="none" aria-label="Aerial render of The Villas Beacon Point with the Rock of Gibraltar behind" />
        {" "}
        <i className="cm tl" />
        <i className="cm tr" />
        <i className="cm bl" />
        <i className="cm br" />
        <figcaption>
          <span>36°06′ N 5°20′ W</span>
          <span>Developer's render</span>
        </figcaption>
        <div className="dev-brand">
          <div className="bp-logo" role="img" aria-label="The Villas Beacon Point">
            <svg className="bp-mark" viewBox="0 0 450 215" aria-hidden="true">
              <g transform="translate(0,215) scale(.1,-.1)">
                <path fill="#d6c7a3" d="M72 2012 c432 -818 1064 -2002 1068 -2002 3 0 70 142 148 317 l142 316 -413 751 -412 751 -303 3 -303 2 73 -138z" />
                <path fill="#d6c7a3" d="M1415 1803 c-87 -192 -158 -352 -158 -358 1 -11 270 -514 283 -528 4 -4 132 268 285 605 153 337 280 616 282 621 2 4 -117 7 -265 7 l-269 0 -158 -347z" />
                <path fill="#7d6c49" d="M2555 1838 c-84 -172 -252 -513 -373 -758 l-220 -445 45 -85 c171 -320 297 -540 304 -533 8 8 999 2120 999 2129 0 2 -135 4 -301 4 l-300 0 -154 -312z" />
                <path fill="#7d6c49" d="M3525 1400 c-206 -412 -375 -755 -375 -761 0 -11 342 -641 346 -636 2 3 950 2028 980 2095 l24 52 -300 0 -300 0 -375 -750z" />
              </g>
            </svg>
            <span className="bp-1">The Villas</span>
            <i className="bp-rule" />
            <span className="bp-2">Beacon Point</span>
          </div>
          <h2 className="sr-only">The Villas Beacon Point</h2>
        </div>
      </figure>
      <div className="dev-row">
        <div className="dev-copy">
          <p className="dev-lead">
            An exclusive range of townhouses, villas and luxury apartments at the southern tip of Gibraltar, with the Rock behind and Morocco across the water. Under construction by ProSeal.
          </p>
          <p className="dev-go">
            <a className="pill" href="https://thevillasbeaconpoint.gi/" target="_blank" rel="noopener" data-cta="dev-visit">Visit the development</a>
            <a className="line" href="quote.html?job=New+build" data-cta="dev-quote">Build with us</a>
          </p>
        </div>
        <ul className="dev-facts">
          <li>
            <span>01</span>
            <b>Townhouses</b>
            villas and apartments
          </li>
          <li>
            <span>02</span>
            <b>Communal pool</b>
            in the Mediterranean sun
          </li>
          <li>
            <span>03</span>
            <b>Views to Morocco</b>
            across the Strait
          </li>
          <li>
            <span>04</span>
            <b>Under construction</b>
            status of the development
          </li>
        </ul>
      </div>
      <DevShow />
      <div className="dev-more">
        <a className="pill dev-cta" href="https://thevillasbeaconpoint.gi/" target="_blank" rel="noopener" data-cta="dev-renders">
          See every render on the development's site{" "}
          <span aria-hidden="true">↗</span>
        </a>
        <p className="dev-note">Renders courtesy of the developer.</p>
      </div>
    </section>
  );
}
