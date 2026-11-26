import { useEffect, useRef, useState, type JSX } from 'react';
import { track } from '../lib/site';
import PhotoViewer from './works/PhotoViewer';

interface Photo {
  readonly src: string;
  readonly alt: string;
  readonly cap: string;
}

/* The photograph, large, without leaving the page: the prints of the home page open here.
   Every page also gets the full screen viewer for its own photographs (works). */
export default function Lightbox(): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const lb = dialog.current;
    if (!lb || typeof lb.showModal !== 'function') return;
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a.card') : null;
      if (!a) return;
      e.preventDefault();
      setPhoto({
        src: a.href,
        alt: a.querySelector('img')?.alt ?? '',
        cap: `${a.querySelector('b')?.textContent ?? ''}. ${a.querySelector('.card-l')?.textContent ?? ''}`,
      });
      lb.showModal();
      track('photo_open', { photo: a.getAttribute('href') });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return (
    <>
      <dialog
        className="lb"
        id="lb"
        aria-label="Photograph"
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <img id="lbImg" src={photo?.src} alt={photo?.alt ?? ''} />
        <p id="lbCap">{photo?.cap}</p>
        <button type="button" id="lbClose" onClick={() => dialog.current?.close()}><span>Close</span></button>
      </dialog>
      <PhotoViewer />
    </>
  );
}
