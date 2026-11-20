import { useLayoutEffect, useState } from 'react';
import { pageFromPath } from '../data/pages';

export default function Dock() {
  const [onQuotePage, setOnQuotePage] = useState(false);

  /* on the quote page the capsule would repeat the page it is on; hidden before the opening shows it */
  useLayoutEffect(() => setOnQuotePage(pageFromPath(location.pathname) === 'quote'), []);

  return (
    <>
      <div className="dock" id="dock" style={onQuotePage ? { display: 'none' } : undefined}>
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
