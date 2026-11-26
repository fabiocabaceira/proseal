import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { useInView } from '../../hooks/home/useInView';
import { isCalm } from '../../lib/site';
import { pad2, ringOffset, wrapIndex } from './ring';

interface Reel {
  readonly id: string;
  /* what the film says, read out on the film itself */
  readonly title: string;
  /* its line in the list beside the carousel */
  readonly label: string;
}

const REELS = [
  { id: 'r1-we-do-both', title: 'We do both.', label: 'We do both' },
  { id: 'r2-water', title: 'Water always finds the gap.', label: 'Water always finds the gap' },
  { id: 'r3-three-questions', title: 'Hiring a builder in Gibraltar? Ask three questions.', label: 'Ask three questions' },
  { id: 'r4-europa-point', title: 'Site news: Europa Point.', label: 'Site news: Europa Point' },
] as const satisfies readonly Reel[];

const R = REELS.length;
/* repeated so both sides always have a neighbour */
const CARDS: readonly Reel[] = R < 6 ? [...REELS, ...REELS] : REELS;
const N = CARDS.length;

const SOUND_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path className="on" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    <path className="off" d="m16 9.5 5 5m0-5-5 5" />
  </svg>
);

/* the front reel in front, the neighbours smaller behind it, all upright; the rest hidden */
function cardStyle(d: number, wide: boolean): CSSProperties {
  const a = Math.abs(d);
  return {
    transform: `translate3d(${d * (wide ? 74 : 60)}%,0,0) scale(${Math.max(0.7, 1 - a * 0.13)})`,
    zIndex: 50 - a,
    opacity: a > 1 ? 0 : 1,
    pointerEvents: a > 1 ? 'none' : 'auto',
  };
}

const arm = (v: HTMLVideoElement) => { if (!v.getAttribute('src')) v.src = v.dataset.src ?? ''; };

/* Only the front reel and its two neighbours load. The front one plays while the carousel is on screen, muted unless
   the visitor turned the sound on; with reduced motion it only plays once the sound is turned on. */
function syncFilms(films: readonly (HTMLVideoElement | null)[], cur: number, inView: boolean, sound: RefObject<boolean>): void {
  const calm = isCalm();
  films.forEach((v, i) => {
    if (!v) return;
    const a = Math.abs(ringOffset(i, cur, N));
    if (a <= 1) arm(v);
    if (a <= 1 && inView) v.preload = a === 0 ? 'auto' : 'metadata';
    if (a === 0 && inView && !calm) {
      v.muted = !sound.current;
      v.play().catch(() => {
        sound.current = false;
        v.muted = true;
        v.play().catch(() => {});
      });
    } else if (a === 0 && inView && calm && sound.current) {
      v.muted = false;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.muted = true;
    }
  });
}

const audibleNow = (films: readonly (HTMLVideoElement | null)[]) => films.map((v) => !!v && !v.muted && !v.paused);

/* Reels: the carousel (the Pantiera component) with a short text and the list of the films beside it. One tap on the
   speaker turns the sound on inside the tap, the only place iOS allows it. Arrows, keys, a mouse drag, a swipe and the
   trackpad's sideways gesture move one reel at a time. */
export default function Reels() {
  const box = useRef<HTMLDivElement>(null);
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  const sound = useRef(false);
  const dragX = useRef<number | null>(null);
  const dragged = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [cur, setCur] = useState(0);
  const [wide, setWide] = useState(false);
  const [audible, setAudible] = useState<readonly boolean[]>(() => CARDS.map(() => false));
  const inView = useInView(box, 0.3);

  const filmRefs = useMemo(() => CARDS.map((_, i) => (el: HTMLVideoElement | null) => { films.current[i] = el; }), []);
  const go = (i: number) => setCur(wrapIndex(i, N));
  const move = useCallback((by: number) => setCur((c) => wrapIndex(c + by, N)), []);
  const readSound = useCallback(() => {
    setAudible((prev) => {
      const next = audibleNow(films.current);
      return next.every((on, i) => on === prev[i]) ? prev : next;
    });
  }, []);

  useEffect(() => {
    syncFilms(films.current, cur, inView, sound);
    readSound();
  }, [cur, inView, readSound]);

  useEffect(() => {
    const fit = () => setWide(innerWidth >= 900);
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  const onVisibility = useEffectEvent(() => {
    if (document.hidden) films.current[cur]?.pause();
    else {
      syncFilms(films.current, cur, inView, sound);
      readSound();
    }
  });
  /* if the phone refused to start the front reel, the next touch anywhere starts it */
  const onAnyTouchEnd = useEffectEvent(() => {
    const v = films.current[cur];
    if (!inView || isCalm() || !v?.paused) return;
    arm(v);
    v.play().catch(() => {});
  });
  useEffect(() => {
    const visibility = () => onVisibility();
    const touchEnd = () => onAnyTouchEnd();
    document.addEventListener('visibilitychange', visibility);
    addEventListener('touchend', touchEnd, { capture: true, passive: true });
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      removeEventListener('touchend', touchEnd, { capture: true });
    };
  }, []);

  useEffect(() => {
    const release = (e: PointerEvent) => {
      const x0 = dragX.current;
      if (x0 === null) return;
      dragX.current = null;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 40) {
        dragged.current = true;
        move(dx < 0 ? 1 : -1);
      }
    };
    addEventListener('pointerup', release, { passive: true });
    return () => removeEventListener('pointerup', release);
  }, [move]);

  /* the trackpad's sideways gesture: one reel per gesture, however long it is */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let locked = false;
    let acc = 0;
    let idle = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerWidth : 1;
      const dx = e.deltaX * k;
      if (Math.abs(dx) <= Math.abs(e.deltaY * k) * 1.1) return;
      e.preventDefault();
      acc += dx;
      if (locked) acc = 0;
      else if (Math.abs(acc) > 28) {
        move(acc > 0 ? 1 : -1);
        acc = 0;
        locked = true;
      }
      clearTimeout(idle);
      idle = window.setTimeout(() => { acc = 0; locked = false; }, 200);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(idle);
    };
  }, [move]);

  const toggleSound = (i: number) => {
    const v = films.current[i];
    if (!v) return;
    const on = v.muted || v.paused;
    sound.current = on;
    arm(v);
    v.muted = !on;
    if (on) v.play().catch(() => { sound.current = false; v.muted = true; });
    syncFilms(films.current, cur, inView, sound);
    readSound();
  };

  return (
    <div className="reels-row">
      <div className="reels-copy">
        <h2 className="h">
          Short films,{" "}
          <em>shot on site.</em>
        </h2>
        <p className="reels-p">
          Each runs under a minute: what we build, how water finds its way into a building, and what to ask before you hire a builder in Gibraltar.
        </p>
        <ol className="reels-list">
          {REELS.map((r, i) => (
            <li key={r.id}>
              <button type="button" data-reel-go={i} aria-current={i === cur % R ? 'true' : undefined} onClick={() => go(i)}>
                <span>{pad2(i + 1)}</span>
                {r.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div
        className="reels"
        data-reels=""
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="ProSeal reels"
        ref={box}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') move(-1);
          if (e.key === 'ArrowRight') move(1);
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const t0 = touch.current;
          if (!t0) return;
          touch.current = null;
          const t = e.changedTouches[0];
          const dx = t.clientX - t0.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(t.clientY - t0.y) * 1.2) move(dx < 0 ? 1 : -1);
        }}
      >
        <ul
          className="reels-palco"
          data-reels-palco=""
          onPointerDown={(e) => {
            dragged.current = false;
            if (e.pointerType === 'mouse') dragX.current = e.clientX;
          }}
        >
          {CARDS.map((r, i) => {
            const d = ringOffset(i, cur, N);
            return (
              <li
                key={`${r.id}-${i}`}
                className={d === 0 ? 'reels-cartao frente' : 'reels-cartao'}
                style={cardStyle(d, wide)}
                aria-hidden={d !== 0}
                onClick={(e) => {
                  /* the click that ends a mouse drag is not a choice */
                  if (dragged.current) { dragged.current = false; return; }
                  if (cur !== i && !(e.target instanceof Element && e.target.closest('.reels-som'))) go(i);
                }}
              >
                <video
                  ref={filmRefs[i]}
                  muted
                  playsInline
                  preload="none"
                  poster={`img/reels/${r.id}.webp`}
                  data-src={`img/reels/${r.id}.mp4`}
                  width={540}
                  height={960}
                  aria-label={`Reel: ${r.title}`}
                  onEnded={() => { if (cur === i) go(i + 1); }}
                  onPlay={readSound}
                  onPause={readSound}
                  onVolumeChange={readSound}
                />
                <button
                  type="button"
                  className="reels-som"
                  aria-pressed={audible[i]}
                  aria-label={audible[i] ? 'Mute' : 'Turn sound on'}
                  tabIndex={d === 0 ? 0 : -1}
                  onClick={() => toggleSound(i)}
                >
                  {SOUND_ICON}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="reels-painel">
          <button type="button" className="reels-seta" data-reels-ant="" aria-label="Previous reel" onClick={() => move(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
          <span className="reels-num" data-reels-num="" aria-live="polite">{`${pad2((cur % R) + 1)} / ${pad2(R)}`}</span>
          <button type="button" className="reels-seta" data-reels-seg="" aria-label="Next reel" onClick={() => move(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>
    </div>
  );
}
