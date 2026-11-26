import { useCallback, useEffect, useState } from 'react';
import { PAGE_FILES, type PageKey } from './data/pages';
import { finishOpening } from './lib/site';
import { useLeadSource } from './lib/lead';
import SvgSprite from './components/SvgSprite';
import SkipLink from './components/SkipLink';
import Bar from './components/Bar';
import Menu from './components/Menu';
import Seal from './components/Seal';
import Footer from './components/Footer';
import Dock from './components/Dock';
import Lightbox from './components/Lightbox';
import HomePage from './pages/Home';
import WorksPage from './pages/Works';
import HowPage from './pages/How';
import QuotePage from './pages/Quote';
import CareersPage from './pages/Careers';

const PAGES: Record<PageKey, () => React.JSX.Element> = {
  index: HomePage,
  works: WorksPage,
  how: HowPage,
  quote: QuotePage,
  careers: CareersPage,
};

/* the pages that show the developer's renders of The Villas Beacon Point credit them in the footer */
const SHOWS_RENDERS: ReadonlySet<PageKey> = new Set(['works']);

export default function App({ page }: { page: PageKey }) {
  const Page = PAGES[page];
  const home = page === 'index';
  const current = PAGE_FILES[page];
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!home) finishOpening();
    const smooth = () => document.documentElement.classList.add('smooth');
    if (document.readyState === 'complete') smooth();
    else window.addEventListener('load', smooth, { once: true });
    return () => window.removeEventListener('load', smooth);
  }, [home]);

  useLeadSource();

  return (
    <>
      <SvgSprite />
      <SkipLink />
      <Bar home={home} current={current} menuOpen={menuOpen} onMenu={() => setMenuOpen((o) => !o)} />
      <Menu open={menuOpen} current={current} onClose={closeMenu} />
      {home && <Seal />}
      <Page />
      <Footer renders={SHOWS_RENDERS.has(page)} />
      <Dock />
      <Lightbox />
    </>
  );
}
