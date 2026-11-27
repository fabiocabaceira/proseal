import { useEffect } from 'react';

interface Props {
  open: boolean;
  current: string;
  onClose: () => void;
}

export const NAV = [
  ['index.html', 'Home'],
  ['works.html', 'Works'],
  ['how.html', 'How we work'],
  ['careers.html', 'Careers'],
  ['quote.html', 'Request a quote'],
] as const;

/* the panel below 1024px, as on detalhesdosal.com: always in the DOM. Shut is visibility hidden, opacity 0 and inert; open is
   data-aberto, so the transition always has a state to start from. The navy is a sibling behind the links. */
export default function Menu({ open, current, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
      document.getElementById('menuBtn')?.focus();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, onClose]);

  return (
    <div id="menu-navegacao" className="menu-painel" data-aberto={open ? '' : undefined} aria-hidden={!open} inert={!open}>
      <div className="menu-fundo" aria-hidden="true" />
      <nav aria-label="Menu">
        {NAV.map(([href, label], i) => (
          <a
            key={href}
            href={href}
            className="menu-item"
            aria-current={href === current ? 'page' : undefined}
            data-cta={href === 'quote.html' ? 'menu-quote' : undefined}
            onClick={onClose}
            style={{ transitionDelay: open ? `${0.12 + i * 0.06}s` : '0s' }}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
