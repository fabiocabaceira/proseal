import { useEffect, useRef } from 'react';
import { useInView } from '../../hooks/home/useInView';
import { LETTERS, OUTLINES } from '../../lib/wordmark';

/* The ProSeal wordmark at the head of the quote, drawn straight on the navy. The first time it comes on screen the outline
   of every letter draws itself once in cream, then the letters fill. It never plays again. */
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
      <svg viewBox="140 -1606 8548 1691" role="img" aria-label="ProSeal">
        {OUTLINES.map((d, i) => <path key={i} className="pm-traco" d={d} />)}
        <g className="pm-letras">
          {LETTERS.map((d, i) => <path key={i} d={d} />)}
        </g>
      </svg>
    </div>
  );
}
