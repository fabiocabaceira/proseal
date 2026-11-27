import { useEffect, useState, type RefObject } from 'react';
import { clamp, finishOpening, isCalm } from '../../lib/site';

const SVG_NS = 'http://www.w3.org/2000/svg';
const WELD_DELAY = 150;
const WELD_TIME = 1500;
const COOL_TIME = 650;
const FLY_TIME = 850;

function svgNode<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Readonly<Record<string, number | string>>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  return el;
}

function frames(signal: AbortSignal, step: (now: number) => boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    let id = 0;
    const tick = (now: number) => {
      if (step(now)) id = requestAnimationFrame(tick);
      else resolve();
    };
    id = requestAnimationFrame(tick);
    signal.addEventListener('abort', () => { cancelAnimationFrame(id); reject(signal.reason); }, { once: true });
  });
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { clearTimeout(id); reject(signal.reason); }, { once: true });
  });
}

/* The opening of the landing page, every time it loads: the plate edge and every stroke of every letter are welded at
   the same time, each with its own torch that leaves the bead behind it; the seams cool from orange to steel, then the
   plate flies to its place in the bar. Runs only under html.opening (set before first paint by index.html). Returns
   true once the seams have cooled. */
export function useWeldOpening(weld: RefObject<SVGSVGElement | null>): boolean {
  const [cool, setCool] = useState(false);

  useEffect(() => {
    const svg = weld.current;
    const root = document.documentElement;
    if (!svg || !root.classList.contains('opening') || isCalm() || typeof svg.animate !== 'function') {
      finishOpening();
      return;
    }

    const ac = new AbortController();
    const { signal } = ac;
    const spawned = new Set<SVGElement>();
    /* a reload starts at the top: the #section left in the address by an earlier click must not fling the page there */
    const reloaded = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload';
    if (reloaded && location.hash) history.replaceState(history.state, '', location.pathname + location.search);
    const target = reloaded ? '' : location.hash;
    history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const spark = (host: ParentNode, x: number, y: number, k: number) => {
      const a = Math.random() * Math.PI * 2;
      const r = (8 + Math.random() * 22) * k;
      const line = svgNode('line', { class: 'spk', x1: x, y1: y, x2: x + Math.cos(a) * 3 * k, y2: y + Math.sin(a) * 3 * k });
      host.append(line);
      spawned.add(line);
      line.animate(
        [{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r + 14 * k}px)`, opacity: 0 }],
        { duration: 320 + Math.random() * 380, easing: 'cubic-bezier(.2,.6,.4,1)' },
      ).onfinish = () => { line.remove(); spawned.delete(line); };
    };

    const run = async () => {
      try {
        const k = svg.viewBox.baseVal.width / svg.getBoundingClientRect().width;
        svg.style.setProperty('--k', String(k));
        const beads = [...svg.querySelectorAll<SVGPathElement>('.bead')];
        const hots = [...svg.querySelectorAll<SVGPathElement>('.hot')];
        const lengths = beads.map((p) => p.getTotalLength());
        const heads = beads.map((p) => {
          const p0 = p.getPointAtLength(0);
          const head = svgNode('circle', { class: 'hd', r: 2.6 * k, cx: p0.x, cy: p0.y });
          p.parentNode?.append(head);
          spawned.add(head);
          return head;
        });

        const t0 = performance.now() + WELD_DELAY;
        await frames(signal, (now) => {
          const raw = clamp((now - t0) / WELD_TIME);
          const p = raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2;
          if (now >= t0) {
            beads.forEach((bead, i) => {
              bead.style.strokeDashoffset = String(1 - p);
              hots[i].style.strokeDashoffset = String(0.045 - p);
              const pt = bead.getPointAtLength(p * lengths[i]);
              heads[i].setAttribute('cx', String(pt.x));
              heads[i].setAttribute('cy', String(pt.y));
              if (raw < 1 && Math.random() < 0.3 && bead.parentNode) spark(bead.parentNode, pt.x, pt.y, k);
            });
          }
          return raw < 1;
        });
        heads.forEach((head) => { head.remove(); spawned.delete(head); });

        setCool(true);
        await sleep(COOL_TIME, signal);

        const logo = document.getElementById('logoBox')?.getBoundingClientRect();
        if (logo) {
          const plate = svg.getBoundingClientRect();
          const s = logo.width / plate.width;
          const dx = logo.left + logo.width / 2 - (plate.left + plate.width / 2);
          const dy = logo.top + logo.height / 2 - (plate.top + plate.height / 2);
          root.classList.add('seal-out', 'scaf-go', 'titled');
          const fly = svg.animate(
            [{ transform: 'none' }, { transform: `translate(${dx}px,${dy}px) scale(${s})` }],
            { duration: FLY_TIME, easing: 'cubic-bezier(.6,0,.15,1)', fill: 'forwards' },
          );
          signal.addEventListener('abort', () => fly.cancel(), { once: true });
          await fly.finished;
        }
      } catch {
        /* a failed measurement or animation still has to end the opening, or the page stays under the plate */
      }
      if (signal.aborted) return;
      finishOpening();
      if (target) document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'instant' });
    };
    void run();

    return () => {
      ac.abort();
      spawned.forEach((node) => {
        node.getAnimations().forEach((a) => a.cancel());
        node.remove();
      });
      spawned.clear();
    };
  }, [weld]);

  /* back/forward from the page cache: reload so the opening plays again */
  useEffect(() => {
    const replay = (e: PageTransitionEvent) => { if (e.persisted) location.reload(); };
    addEventListener('pageshow', replay);
    return () => removeEventListener('pageshow', replay);
  }, []);

  return cool;
}
