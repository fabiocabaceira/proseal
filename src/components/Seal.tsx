import { useRef } from 'react';
import { useWeldOpening } from '../hooks/home/useWeldOpening';
import { LETTERS, LETTERS_AT, OUTLINES, PLATE_EDGE, PLATE_H, PLATE_W } from '../lib/wordmark';

/* the bead the torch leaves behind it, and the glowing tip just behind the torch */
function Seam({ d }: { readonly d: string }) {
  return (
    <>
      <path className="bead" pathLength="1" d={d} />
      <path className="hot" pathLength="1" d={d} />
    </>
  );
}

export default function Seal() {
  const weld = useRef<SVGSVGElement>(null);
  const cool = useWeldOpening(weld);
  return (
    <>
      <div className={cool ? 'seal cool' : 'seal'} id="seal" aria-hidden="true">
        <svg className="weld" viewBox={`0 0 ${PLATE_W} ${PLATE_H}`} ref={weld}>
          <defs>
            <linearGradient id="plg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#143a69" />
              <stop offset="1" stopColor="#0b2140" />
            </linearGradient>
          </defs>
          <rect className="plate" width={PLATE_W} height={PLATE_H} rx="70" />
          <g className="run">
            <Seam d={PLATE_EDGE} />
          </g>
          <g transform={LETTERS_AT}>
            {LETTERS.map((d, i) => <path key={i} className="ltr" d={d} />)}
            <g className="run">
              {OUTLINES.map((d, i) => <Seam key={i} d={d} />)}
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}
