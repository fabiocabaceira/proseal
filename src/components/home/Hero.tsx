import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { armFilm, isCalm, onTitled } from '../../lib/site';

/* Scroll Expansion Hero (21st.dev, @arunachalam), rebuilt for this site. The section is taller than the screen and its
   stage is sticky; the scroll progress through it drives --p (linear) and --e (eased) in CSS, which open the window from
   its frame to the full screen, fade the background photo and part the two halves of the title (site.css, "1. hero"). */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<'' | 'run' | 'done'>('');

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const p = useTransform(scrollYProgress, (v) => (isCalm() ? 0 : v));
  const e = useTransform(p, (v) => v * v * (3 - 2 * v));

  useMotionValueEvent(p, 'change', (v) => setStage(v > 0.94 ? 'done' : v > 0.12 ? 'run' : ''));

  /* the film in the window starts when the title appears; with reduced motion its poster stays */
  useEffect(() => {
    const v = film.current;
    if (!v) return;
    const on = armFilm(v);
    const again = () => { v.play().catch(() => {}); };
    const stop = onTitled(() => {
      if (!on || isCalm()) return;
      v.play().catch(() => {
        ['touchstart', 'scroll', 'pointerdown'].forEach((t) => addEventListener(t, again, { once: true, passive: true }));
      });
    });
    return () => {
      stop();
      ['touchstart', 'scroll', 'pointerdown'].forEach((t) => removeEventListener(t, again));
    };
  }, []);

  return (
    <motion.section
      ref={section}
      className={`xh${stage === 'run' ? ' run' : stage === 'done' ? ' run done' : ''}`}
      id="top"
      style={{ '--p': p, '--e': e } as Record<string, unknown>}
    >
      <div className="xh-pin">
        <img
          className="xh-bg"
          src="img/gunwharf-arch-900.webp"
          srcSet="img/gunwharf-arch-480.webp 480w, img/gunwharf-arch-900.webp 900w, img/gunwharf-arch-1600.webp 1600w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className="xh-win">
          <video
            ref={film}
            className="xh-film"
            id="heroFilm"
            data-src="img/hero-bg-m.mp4"
            data-src-wide="img/hero-bg.mp4"
            muted
            loop
            playsInline
            preload="none"
            poster="img/hero-bg-poster-m.webp"
            data-poster-wide="img/hero-bg-poster-1920.webp"
            aria-label="Aerial view of a large house with a red-tiled roof"
          />
        </div>
        <div className="xh-copy">
          <h1 className="xh-title">
            <span className="xh-a">Building the future,</span>{' '}
            <em className="xh-b">restoring the past.</em>
          </h1>
        </div>
        <p className="xh-meta" aria-hidden="true">
          <span className="xh-a">Gibraltar, since 2002</span>
          <span className="xh-b">Scroll</span>
        </p>
        <p className="xh-go">
          <a className="pill" href="works.html" data-cta="hero-works">See our projects</a>
          <a className="pill ghost" href="quote.html" data-cta="hero-quote">Request a quote</a>
        </p>
        <p className="xh-end">
          <span>We take every project from planning through to handover.</span>
          <a className="pill" href="works.html" data-cta="hero-works-end">See our projects</a>
        </p>
      </div>
    </motion.section>
  );
}
