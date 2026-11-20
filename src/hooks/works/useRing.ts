import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { isCalm } from '../../lib/site';

/* a face's angle from the front of the ring, folded into -180..180 */
const fold = (deg: number) => ((deg % 360) + 540) % 360 - 180;

interface Motion {
  readonly faces: readonly HTMLElement[];
  readonly aim: () => number;
  readonly go: (deg: number) => void;
  readonly turn: (by: number) => void;
  readonly bring: (face: number) => void;
  readonly fling: (pxPerMs: number) => void;
  readonly size: () => void;
  readonly stop: () => void;
}

/* The photographs stand on a turning cylinder and the sides fall back into depth. Written straight to the DOM on every
   frame; only the front face goes through React, as state. */
function ringMotion(stage: HTMLElement, faces: readonly HTMLElement[], onFront: (face: number) => void): Motion {
  const n = faces.length;
  const step = 360 / n;
  let ang = 0;
  let aim = 0;
  let raf = 0;
  let r = 0;

  const paint = () => {
    stage.style.transform = `translateZ(${-r}px) rotateY(${ang}deg)`;
    faces.forEach((f, i) => {
      const a = Math.abs(fold(i * step + ang));
      f.style.opacity = a > 115 ? '0' : (1 - Math.max(0, a - 40) / 90).toFixed(3);
      f.style.filter = a < 8 ? '' : `brightness(${(1 - Math.min(a, 110) / 260).toFixed(3)})`;
      f.style.pointerEvents = a > 70 ? 'none' : '';
    });
    onFront(((Math.round(-ang / step) % n) + n) % n);
  };
  const run = () => {
    ang += (aim - ang) * 0.12;
    if (Math.abs(aim - ang) < 0.02) {
      ang = aim;
      raf = 0;
      paint();
      return;
    }
    paint();
    raf = requestAnimationFrame(run);
  };
  const go = (deg: number) => {
    aim = deg;
    if (isCalm()) {
      ang = aim;
      paint();
      return;
    }
    if (!raf) raf = requestAnimationFrame(run);
  };
  const nearest = (deg: number) => Math.round(deg / step) * step;
  const size = () => {
    const w = faces[0]?.offsetWidth || 240;
    r = Math.round((w / 2 / Math.tan(Math.PI / n)) * 1.08);
    stage.style.setProperty('--r', `${r}px`);
    paint();
  };

  faces.forEach((f, i) => {
    f.style.transform = `rotateY(${i * step}deg) translateZ(var(--r))`;
  });
  size();

  return {
    faces,
    aim: () => aim,
    go,
    turn: (by) => go(nearest(aim) - by * step),
    bring: (face) => go(nearest(aim) - fold(face * step + aim)),
    fling: (v) => go(nearest(aim + v * 120)),
    size,
    stop: () => cancelAnimationFrame(raf),
  };
}

export interface RingProps {
  readonly onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
  readonly onClickCapture: (e: ReactMouseEvent<HTMLElement>) => void;
  readonly onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => void;
  readonly onDragStart: (e: ReactDragEvent<HTMLElement>) => void;
}

export interface Ring {
  /** spread on .ring: drag, swipe, keys, and a press on a face behind brings it to the front */
  readonly ringProps: RingProps;
  readonly stageRef: RefObject<HTMLDivElement | null>;
  /** index of the face at the front, duplicates included */
  readonly front: number;
  /** one face along: 1 is the next photograph, -1 the previous */
  readonly turn: (by: number) => void;
}

/* a press that travelled further than this was a drag, and its click is not a press on the photograph */
const DRAG_PX = 6;

export function useRing(): Ring {
  const stageRef = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion | null>(null);
  const endDrag = useRef<(() => void) | null>(null);
  const moved = useRef(0);
  const [front, setFront] = useState(0);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let shown = 0;
    const m = ringMotion(stage, [...stage.querySelectorAll<HTMLElement>(':scope > .rc')], (face) => {
      if (face === shown) return;
      shown = face;
      setFront(face);
    });
    motion.current = m;
    window.addEventListener('resize', m.size, { passive: true });
    return () => {
      endDrag.current?.();
      window.removeEventListener('resize', m.size);
      m.stop();
      motion.current = null;
    };
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const m = motion.current;
    if (!m || !e.isPrimary || e.button !== 0) return;
    endDrag.current?.();
    const id = e.pointerId;
    const x0 = e.clientX;
    const a0 = m.aim();
    let lx = x0;
    let lt = performance.now();
    let v = 0;
    moved.current = 0;
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      const now = performance.now();
      const dx = ev.clientX - x0;
      moved.current = Math.max(moved.current, Math.abs(dx));
      v = (ev.clientX - lx) / Math.max(1, now - lt);
      lx = ev.clientX;
      lt = now;
      m.go(a0 + dx * 0.35);
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      endDrag.current = null;
    };
    /* the throw carries on only if the pointer was still moving when it let go; a cancelled pointer (the page took
       the gesture to scroll) just settles on the nearest face */
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      stop();
      m.fling(ev.type === 'pointerup' && performance.now() - lt < 120 ? v : 0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    endDrag.current = stop;
  }, []);

  const onClickCapture = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const m = motion.current;
    if (!m) return;
    if (e.detail > 0 && moved.current > DRAG_PX) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const face = e.target instanceof Element ? e.target.closest<HTMLElement>('.rc') : null;
    if (!face || face.classList.contains('front')) return;
    e.preventDefault();
    e.stopPropagation();
    m.bring(m.faces.indexOf(face));
  }, []);

  const onKeyDown = useCallback((e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') motion.current?.turn(1);
    else if (e.key === 'ArrowLeft') motion.current?.turn(-1);
  }, []);

  /* the faces are links, and a link pressed and moved starts the browser's own drag, which swallows the pointer */
  const onDragStart = useCallback((e: ReactDragEvent<HTMLElement>) => e.preventDefault(), []);

  const turn = useCallback((by: number) => motion.current?.turn(by), []);

  return { ringProps: { onPointerDown, onClickCapture, onKeyDown, onDragStart }, stageRef, front, turn };
}
