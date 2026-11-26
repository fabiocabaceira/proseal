import { useEffect, useState } from 'react';

interface Props {
  home: boolean;
  current: string;
  menuOpen: boolean;
  onMenu: () => void;
}

/* the bar is clear over the home hero and turns solid once the hero has scrolled away; on the other pages it is always solid (CSS) */
export default function Bar({ home, current, menuOpen, onMenu }: Props) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    if (!home) return;
    let ticking = false;
    const check = () => {
      ticking = false;
      const hero = document.getElementById('top');
      const end = hero ? hero.offsetHeight : Math.min(innerHeight * 0.92, 900);
      setSolid(scrollY > end - 90);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', check);
    check();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', check);
    };
  }, [home]);

  /* over a dark section (the development, the quote, the footer) the solid bar turns to dark glass */
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const bar = document.getElementById('bar');
    if (!bar) return;
    const isDark = (el: Element) => {
      const c = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number);
      if (!c || (c.length > 3 && c[3] < 0.5)) return false;
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] < 90;
    };
    const darkOnes = [...document.querySelectorAll('main > section, .foot')].filter(isDark);
    if (!darkOnes.length) return;
    let ticking = false;
    const check = () => {
      ticking = false;
      const y = bar.offsetHeight;
      setDark(darkOnes.some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; }));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const here = (href: string) => (href === current ? 'page' : undefined);

  return (
    <header className={`bar${solid ? ' solid' : ''}${dark ? ' dark' : ''}${menuOpen ? ' over-menu' : ''}`} id="bar">
      <a className="logo" href="index.html" aria-label="ProSeal Construction, home">
        <span className="logo-box" id="logoBox"><svg viewBox="0 0 8808 1700" aria-hidden="true"><use href="#wm" /></svg></span>{' '}
        <span className="logo-sub">Construction</span>
      </a>
      <nav className="nav" aria-label="Main">
        <a href="index.html#what">What we do</a>{' '}
        <a href="works.html" aria-current={here('works.html')}>Works</a>{' '}
        <a href="how.html" aria-current={here('how.html')}>How we work</a>{' '}
        <a href="careers.html" aria-current={here('careers.html')}>Careers</a>{' '}
        <a href="index.html#contact">Contact</a>
      </nav>
      <a className="pill nav-cta" href="quote.html" data-cta="nav-quote">Request a quote</a>{' '}
      <button className="menu-btn" id="menuBtn" aria-expanded={menuOpen} aria-controls="menu" onClick={onMenu}>
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
      </button>
    </header>
  );
}
