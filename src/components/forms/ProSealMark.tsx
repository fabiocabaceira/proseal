import { useEffect, useRef } from 'react';
import { useInView } from '../../hooks/home/useInView';
import { LETTERS, LETTERS_AT, OUTLINES, PLATE_EDGE, PLATE_H, PLATE_W } from '../../lib/wordmark';

/* The ProSeal plate at the head of the quote form. The first time it comes on screen the outline of the plate and of
   every letter draws itself once, then the navy plate and the white letters settle in. It never plays again. */
export default function ProSealMark() {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, 0.5, true);

  useEffect(() => {
    for (const p of box.current?.querySelectorAll<SVGPathElement>('.pm-traco') ?? []) {
      p.style.setProperty('--len', p.getTotalLength().toFixed(1));
    }
  }, []);

  return (
    <div className={seen ? 'pm is-in' : 'pm'} ref={box}>
      <svg viewBox={`0 0 ${PLATE_W} ${PLATE_H}`} role="img" aria-label="ProSeal">
        <defs>
          <linearGradient id="pm-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#143a69" />
            <stop offset="1" stopColor="#0b2140" />
          </linearGradient>
        </defs>
        <rect className="pm-placa" width={PLATE_W} height={PLATE_H} rx="70" fill="url(#pm-g)" />
        <path className="pm-traco" d={PLATE_EDGE} />
        <g transform={LETTERS_AT}>
          {OUTLINES.map((d, i) => <path key={i} className="pm-traco pm-traco--l" d={d} />)}
          <g className="pm-letras">
            {LETTERS.map((d, i) => <path key={i} d={d} />)}
          </g>
        </g>
      </svg>
    </div>
  );
}
