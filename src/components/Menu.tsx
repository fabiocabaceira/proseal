import { useEffect, useState } from 'react';
import { isCalm } from '../lib/site';

interface Props {
  open: boolean;
  current: string;
  onClose: () => void;
}

const LINKS = [
  ['index.html', 'Home'],
  ['works.html', 'Works'],
  ['how.html', 'How we work'],
  ['careers.html', 'Careers'],
  ['quote.html', 'Request a quote'],
] as const;

/* matches the close transition of .menu in site.css */
const CLOSE_MS = 480;

/* full-screen menu for phones: unhidden, then drawn open on the next frame; drawn shut, then hidden once the curtain is up */
export default function Menu({ open, current, onClose }: Props) {
  const [shown, setShown] = useState(open);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      setShown(true);
      let r = requestAnimationFrame(() => { r = requestAnimationFrame(() => setDrawn(true)); });
      return () => cancelAnimationFrame(r);
    }
    setDrawn(false);
    const t = setTimeout(() => setShown(false), isCalm() ? 0 : CLOSE_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
      document.getElementById('menuBtn')?.focus();
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open, onClose]);

  return (
    <div className={`menu${drawn ? ' open' : ''}`} id="menu" hidden={!shown}>
      <nav aria-label="Menu">
        {LINKS.map(([href, label]) => (
          <a
            key={href}
            href={href}
            aria-current={href === current ? 'page' : undefined}
            data-cta={href === 'quote.html' ? 'menu-quote' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
