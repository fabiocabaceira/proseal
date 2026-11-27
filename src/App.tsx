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
    /* every page opens at the top; a link to a section (#...) still lands on that section. The document never gets
       scroll-behavior: smooth: on iOS WebKit it fights the finger and the toolbar coming back, and the scroll seizes and
       hiccups on the way up. */
    history.scrollRestoration = 'manual';
    const reloaded = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload';
    if (reloaded && location.hash) history.replaceState(history.state, '', location.pathname + location.search);
    if (reloaded || !location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
