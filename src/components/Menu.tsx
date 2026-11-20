import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  current: string;
  onClose: () => void;
}

/* full-screen menu for phones: shown, then faded in on the next frame; faded out, then hidden after the fade */
export default function Menu({ open, current, onClose }: Props) {
  const [shown, setShown] = useState(open);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      setShown(true);
      const r = requestAnimationFrame(() => setFaded(true));
      return () => cancelAnimationFrame(r);
    }
    setFaded(false);
    const t = setTimeout(() => setShown(false), 360);
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

  const here = (href: string) => (href === current ? 'page' : undefined);

  return (
    <div className={`menu${faded ? ' open' : ''}`} id="menu" hidden={!shown}>
      <nav aria-label="Menu">
        <a href="index.html" aria-current={here('index.html')}>Home</a>{' '}
        <a href="works.html" aria-current={here('works.html')}>Works</a>{' '}
        <a href="how.html" aria-current={here('how.html')}>How we work</a>{' '}
        <a href="quote.html" data-cta="menu-quote" aria-current={here('quote.html')}><em>Request a quote</em></a>
      </nav>
      <p className="menu-foot">
        <a href="tel:+35020047974" data-cta="menu-call" aria-label="Call +350 200 47974"><svg aria-hidden="true"><use href="#i-call" /></svg></a>{' '}
        <a href="mailto:info@prosealconstruction.com" data-cta="menu-mail" aria-label="Email ProSeal Construction"><svg aria-hidden="true"><use href="#i-mail" /></svg></a>
      </p>
    </div>
  );
}
