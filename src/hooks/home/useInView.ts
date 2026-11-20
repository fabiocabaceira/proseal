import { useEffect, useState, type RefObject } from 'react';

/* Whether the element is on screen at the given threshold. With `once`, it stays true after the first time. */
export function useInView(target: RefObject<Element | null>, threshold: number, once = false): boolean {
  const [inView, setInView] = useState(false);
  const settled = once && inView;

  useEffect(() => {
    const el = target.current;
    if (!el || settled) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (once) {
          if (entries.some((e) => e.isIntersecting)) setInView(true);
          return;
        }
        const last = entries.at(-1);
        if (last) setInView(last.isIntersecting);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, threshold, once, settled]);

  return inView;
}
