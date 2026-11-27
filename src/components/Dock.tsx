import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { pageFromPath } from '../data/pages';

/* on phones the dock is a bar along the bottom edge; it steps aside while the hero, a form, a closing band that already
   carries the same buttons, or the footer is on screen. On desktop the capsule steps aside for the closing band and the
   footer, where the same two buttons are already on the page */
const PHONE = '(max-width: 768px)';
const AWAY_FROM = '.xh, .ask, #quoteForm, .cta, .foot';
const AWAY_FROM_DESKTOP = '.cta, .foot';

export default function Dock() {
  const dock = useRef<HTMLDivElement>(null);
  const [onQuotePage, setOnQuotePage] = useState(false);

  /* on the quote page the capsule would repeat the page it is on; hidden before the opening shows it */
  useLayoutEffect(() => setOnQuotePage(pageFromPath(location.pathname) === 'quote'), []);

  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    const phone = matchMedia(PHONE);
    const seen = new Set<Element>();
    let io: IntersectionObserver | null = null;

    const arm = () => {
      io?.disconnect();
      io = null;
      seen.clear();
      el.classList.remove('is-away');
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        el.classList.toggle('is-away', seen.size > 0);
      });
      document.querySelectorAll(phone.matches ? AWAY_FROM : AWAY_FROM_DESKTOP).forEach((t) => io?.observe(t));
    };

    arm();
    phone.addEventListener('change', arm);
    return () => {
      phone.removeEventListener('change', arm);
      io?.disconnect();
    };
  }, []);

  return (
    <>
      <div className="dock" id="dock" ref={dock} style={onQuotePage ? { display: 'none' } : undefined}>
        <a className="dock-main" href="quote.html" data-cta="dock-quote">Request a quote</a>
        {" "}
        <a href="tel:+35020047974" data-cta="dock-call">
          <svg aria-hidden="true"><use href="#i-call" /></svg>
          Call
        </a>
      </div>
    </>
  );
}
