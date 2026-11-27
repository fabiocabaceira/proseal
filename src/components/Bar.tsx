import { useEffect, useState } from 'react';
import { NAV } from './Menu';

interface Props {
  home: boolean;
  current: string;
  menuOpen: boolean;
  onMenu: () => void;
}

/* past 60px a scroll is an intent to go down, and the navy drops in behind the bar */
const LIMIT = 60;

/* the bar, as on detalhesdosal.com: the mark on the left; from 1024px the links in a line on the right, below that a text button.
   Its navy is a sibling behind the text that slides in with a transform. Over the home hero on wide screens it waits for the
   first scroll; everywhere else, and on phones, it is always there. */
export default function Bar({ home, current, menuOpen, onMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last: boolean | null = null;
    const onScroll = () => {
      const past = window.scrollY > LIMIT;
      if (past === last) return;
      last = past;
      setScrolled(past);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || menuOpen || !home;

  return (
    <header className="bar" id="bar">
      <div className={solid ? 'bar-bg on' : 'bar-bg'} aria-hidden="true" />
      <a className="logo" href="index.html" aria-label="ProSeal Construction, home">
        <span className="logo-box" id="logoBox"><svg viewBox="0 0 8808 1700" aria-hidden="true"><use href="#wm" /></svg></span>{' '}
        <span className="logo-sub">Construction</span>
      </a>
      <nav className="nav" aria-label="Main">
        {NAV.map(([href, label]) => (
          <a key={href} href={href} aria-current={href === current ? 'page' : undefined} data-cta={href === 'quote.html' ? 'nav-quote' : undefined}>
            {label}
            <span className="nav-u" aria-hidden="true" />
          </a>
        ))}
      </nav>
      <button type="button" className="menu-btn" id="menuBtn" aria-expanded={menuOpen} aria-controls="menu-navegacao" onClick={onMenu}>
        {menuOpen ? 'Close menu' : 'Open menu'}
      </button>
    </header>
  );
}
