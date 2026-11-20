import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { isCalm } from '../../lib/site';

type PlaceId = 'office' | 'quay' | 'rosia' | 'south' | 'europa';

interface Place {
  readonly id: PlaceId;
  readonly name: string;
  readonly note: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly side: 'start' | 'end';
}

const PLACES: readonly Place[] = [
  { id: 'office', name: 'City Mill Lane', note: 'our office', label: 'Office', x: 152.7, y: 159.3, side: 'start' },
  { id: 'quay', name: 'Queensway Quay', note: 'The Island, The Sails', label: 'Queensway Quay', x: 118.5, y: 180, side: 'end' },
  { id: 'rosia', name: 'Rosia', note: '1 Rosia Parade', label: 'Rosia', x: 151.2, y: 290.7, side: 'end' },
  { id: 'south', name: 'South District', note: 'Buena Vista Villas', label: 'South District', x: 189.7, y: 362.7, side: 'start' },
  { id: 'europa', name: 'Europa Point', note: 'The Villas Beacon Point, in development', label: 'Europa Point', x: 211.5, y: 425.7, side: 'start' },
];

const at = (v: number) => v.toFixed(1);

/* the list and the drawn map light each other; the places take turns until someone points at one */
export default function WhereMap() {
  const map = useRef<SVGSVGElement>(null);
  const tour = useRef(0);
  const turn = useRef(0);
  const touched = useRef(false);
  const [lit, setLit] = useState<PlaceId | null>(null);
  const [drawn, setDrawn] = useState(false);

  const stopTour = () => {
    clearInterval(tour.current);
    tour.current = 0;
  };

  useEffect(() => {
    const el = map.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      setDrawn(true);
      io.disconnect();
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = map.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        stopTour();
        if (e.isIntersecting && !touched.current && !isCalm()) {
          tour.current = window.setInterval(() => setLit(PLACES[turn.current++ % PLACES.length].id), 1900);
        }
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      stopTour();
    };
  }, []);

  const pick = (id: PlaceId) => {
    touched.current = true;
    stopTour();
    setLit(id);
  };
  const point = (id: PlaceId) => (e: PointerEvent) => {
    if (e.pointerType === 'mouse') pick(id);
  };

  return (
    <section className="where" id="where">
      <h2 className="h">
        All over{" "}
        <em>the Rock.</em>
      </h2>
      <div className="where-box">
        <div className="where-list">
          <ul className="places" id="places">
            {PLACES.map((p, k) => (
              <li key={p.id} data-p={p.id} className={p.id === lit ? 'on' : undefined} onPointerEnter={point(p.id)} onClick={() => pick(p.id)}>
                <i className="no">{k + 1}</i>
                <b>{p.name}</b>
                {` ${p.note}`}
              </li>
            ))}
          </ul>
          <p className="map-note">Coastline from OpenStreetMap. Places shown approximately.</p>
        </div>
        <svg className={drawn ? 'map draw in' : 'map draw'} id="map" ref={map} viewBox="-40 -8 364 484" role="img" aria-label="Map of Gibraltar with the places where ProSeal has worked">
          <defs>
            <pattern id="sea" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6h6" className="sea-l" /></pattern>
          </defs>
          <rect x="-40" y="-8" width="364" height="484" fill="url(#sea)" className="sea" />
          <rect x="-40" y="-8" width="364" height="34.1" className="spain" />
          <path className="border" d="M-40 26.1H324" />
          <path className="s coast" pathLength="1" d="M99.7 29.8 L86.5 29.8 L85.3 28.7 L83.9 29.7 L70.6 29.8 L68.9 28.9 L67.8 29.8 L65.1 29.6 L64.9 31.0 L160.9 31.0 L161.5 36.2 L165.0 42.6 L162.1 53.5 L161.6 59.6 L167.7 58.3 L166.7 60.2 L151.9 60.9 L149.3 59.1 L147.7 61.0 L145.3 61.3 L139.0 60.7 L135.8 61.7 L122.3 61.7 L121.2 61.1 L120.9 59.3 L122.4 57.8 L122.7 55.8 L120.4 53.7 L119.8 47.4 L119.6 53.3 L118.0 56.1 L117.7 60.2 L115.2 61.9 L103.3 62.5 L102.4 63.8 L102.5 74.2 L103.5 75.4 L127.1 74.0 L127.2 75.2 L127.5 74.0 L136.7 73.6 L139.2 74.5 L141.5 73.5 L151.3 73.2 L153.2 93.7 L152.6 97.3 L150.7 96.1 L151.0 92.9 L141.7 90.5 L141.5 91.4 L148.9 97.6 L143.2 106.0 L125.5 87.4 L113.6 84.4 L113.8 83.7 L99.1 83.8 L95.5 82.9 L76.4 83.4 L71.5 82.8 L71.6 80.4 L58.4 80.4 L58.9 130.0 L61.5 129.4 L61.5 93.0 L66.3 93.1 L66.6 101.1 L68.3 100.9 L68.6 93.0 L73.1 93.0 L73.3 101.0 L80.1 101.1 L80.1 120.9 L81.1 120.9 L81.1 101.2 L82.1 100.9 L82.2 93.0 L87.0 93.1 L87.3 101.1 L89.0 100.8 L89.1 93.0 L93.6 92.9 L93.8 102.7 L95.9 102.8 L96.5 100.6 L100.3 102.9 L100.4 105.0 L98.0 107.5 L91.2 107.5 L89.5 108.9 L88.8 137.3 L89.7 138.5 L96.3 141.4 L101.8 145.5 L105.0 148.8 L110.5 157.6 L114.1 157.2 L114.6 159.7 L111.7 161.3 L113.9 166.9 L117.0 169.5 L118.6 173.9 L113.4 175.9 L110.7 168.2 L109.8 168.4 L114.2 181.5 L113.1 182.0 L113.3 183.0 L104.2 186.2 L94.0 158.2 L99.5 156.2 L100.1 154.9 L99.1 153.2 L97.6 153.8 L98.0 155.2 L92.2 157.3 L106.7 196.5 L108.0 196.9 L117.3 194.0 L118.6 197.7 L123.2 196.5 L124.2 197.1 L124.7 195.4 L118.7 180.7 L125.3 178.3 L130.8 193.9 L133.2 193.0 L134.4 196.9 L133.8 197.6 L125.4 200.5 L126.3 203.1 L135.5 200.0 L141.5 218.1 L126.2 223.6 L125.2 220.7 L128.4 219.5 L122.7 204.5 L123.8 203.1 L121.5 202.2 L120.4 200.3 L120.2 202.2 L118.0 204.1 L117.8 206.1 L123.6 222.1 L124.5 221.0 L128.3 231.0 L130.5 230.6 L132.6 236.8 L133.4 236.5 L129.8 225.7 L137.3 223.0 L138.9 226.2 L137.9 227.0 L141.1 235.0 L141.7 234.5 L140.1 229.9 L144.7 228.3 L143.8 229.6 L146.3 235.1 L131.7 240.5 L144.6 277.8 L142.8 279.2 L143.2 280.1 L141.4 281.5 L140.6 280.9 L137.7 283.1 L138.1 284.0 L132.4 287.2 L132.9 288.2 L130.5 290.1 L129.6 289.3 L126.5 291.8 L72.4 221.0 L70.6 220.7 L70.1 222.4 L102.7 265.3 L119.6 289.3 L123.2 291.5 L130.5 301.5 L136.0 307.2 L135.7 309.3 L138.9 311.6 L140.5 314.5 L142.8 320.5 L142.5 322.8 L144.2 326.0 L146.7 325.5 L147.3 326.5 L149.7 324.9 L150.2 323.5 L152.3 323.4 L156.9 326.9 L158.2 331.2 L155.7 335.9 L151.6 336.7 L147.1 332.8 L146.3 333.9 L154.4 340.3 L156.7 345.6 L156.4 346.9 L157.8 346.7 L160.8 348.8 L161.7 348.0 L165.0 351.9 L164.6 353.7 L165.8 353.1 L166.1 357.1 L164.2 357.5 L166.7 365.6 L169.5 365.8 L169.9 367.8 L169.1 368.2 L169.9 368.2 L170.2 369.5 L169.2 369.8 L170.5 370.6 L172.2 384.3 L178.5 392.8 L178.9 395.6 L173.5 402.9 L171.2 413.6 L172.5 427.8 L176.1 430.4 L175.7 431.4 L179.6 436.5 L180.4 436.3 L184.2 440.2 L185.7 440.1 L188.1 442.0 L189.3 441.7 L192.4 444.3 L200.1 445.5 L202.9 446.8 L205.5 446.1 L206.1 443.2 L208.8 441.3 L213.9 441.1 L213.3 436.9 L212.0 434.9 L211.4 428.0 L212.1 424.9 L213.6 423.9 L214.8 418.7 L217.5 415.2 L219.2 410.7 L222.4 409.0 L223.3 399.1 L222.1 395.3 L223.6 391.0 L223.2 388.4 L226.5 379.0 L229.5 377.1 L230.1 374.8 L233.1 372.1 L234.3 372.2 L235.5 369.9 L235.4 367.3 L233.4 366.1 L232.6 364.7 L233.2 363.9 L231.0 361.4 L232.2 358.5 L230.2 350.3 L234.7 340.5 L233.5 338.4 L235.0 335.8 L234.7 333.7 L235.7 333.6 L234.8 332.4 L234.9 329.7 L237.6 327.2 L238.1 324.2 L244.2 312.2 L242.9 301.3 L249.3 301.1 L249.2 300.4 L242.8 300.8 L242.0 298.7 L245.3 296.0 L246.0 293.2 L247.7 290.9 L246.2 289.4 L246.9 288.5 L246.5 285.6 L242.3 283.3 L243.0 281.6 L241.7 281.9 L241.6 279.9 L240.2 277.4 L238.9 277.0 L237.8 272.7 L237.1 272.5 L238.1 269.4 L237.4 266.2 L238.1 265.2 L237.3 264.4 L238.1 263.8 L237.1 262.8 L238.0 261.3 L246.9 260.0 L248.4 258.8 L241.3 259.5 L239.2 256.0 L239.2 247.8 L242.5 240.9 L244.0 239.4 L251.2 242.2 L249.9 240.6 L242.7 237.5 L241.0 235.2 L242.6 227.5 L244.2 225.1 L242.9 223.0 L241.8 223.5 L241.8 221.6 L242.9 220.3 L244.2 220.4 L242.5 218.9 L244.6 217.4 L244.1 215.1 L245.3 213.8 L244.6 211.7 L242.0 210.3 L242.9 205.4 L245.4 203.5 L244.4 202.0 L242.6 202.0 L242.1 200.4 L244.1 194.7 L243.4 190.6 L244.6 189.2 L241.8 186.8 L242.4 183.8 L240.8 183.7 L240.6 181.8 L244.9 168.8 L246.8 168.3 L247.5 169.2 L249.3 166.2 L255.4 167.6 L258.1 166.1 L264.3 122.1 L262.8 118.7 L260.3 119.3 L256.7 117.0 L252.2 117.1 L250.6 116.2 L249.2 111.9 L250.1 96.0 L251.3 94.3 L255.0 94.7 L250.9 93.5 L250.2 91.8 L250.1 86.9 L252.6 73.0 L253.9 70.0 L258.0 70.1 L254.4 69.1 L253.7 65.9 L254.9 56.7 L256.4 56.1 L255.3 55.0 L255.5 43.6 L257.4 27.9 L257.4 26.1 L99.7 26.1 Z" />
          <path className="bits" d="M48.1 143.2 L48.1 143.2 Z M242.4 280.5 L242.4 280.5 Z M153.7 326.3 L153.7 326.3 Z M134.1 310.2 L134.1 310.2 Z" />
          <path className="s ridge" pathLength="1" d="M202.1 112.5 L213.0 130.5 L225.3 171.0 L229.7 229.5 L227.5 297.0" />
          <g className="peak">
            <path d="M208.0 134.5l5 -8 5 8z" />
            <text textAnchor="end" x="204.0" y="134.5">The Rock · 426 m</text>
          </g>
          <text className="area" x="288" y="16.1" textAnchor="end">SPAIN</text>
          {" "}
          <text className="water" x="18" y="290" transform="rotate(-90 18 290)" textAnchor="middle">Bay of Gibraltar</text>
          {" "}
          <text className="water" x="153" y="466" textAnchor="middle">Strait of Gibraltar</text>
          <g className="north" transform="translate(306 64.1)">
            <path d="M0 -14 5 4 0 0 -5 4Z" />
            <text y="18" textAnchor="middle">N</text>
          </g>
          <g className="scale" transform="translate(-28 434)">
            <path d="M0 0h40.5M0 -4v8M40.5 -4v8" />
            <text x="0" y="16">500 m</text>
          </g>
          {PLACES.map((p, k) => (
            <g key={p.id} className={p.id === lit ? 'pt on' : 'pt'} data-p={p.id} onPointerEnter={point(p.id)} onClick={() => pick(p.id)}>
              <circle className="halo" cx={at(p.x)} cy={at(p.y)} r="17" />
              <circle cx={at(p.x)} cy={at(p.y)} r="9" />
              <text className="no" x={at(p.x)} y={at(p.y + 3.4)} textAnchor="middle">{k + 1}</text>
              <text className="nm" x={at(p.side === 'start' ? p.x + 18 : p.x - 18)} y={at(p.y + 4)} textAnchor={p.side}>{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
