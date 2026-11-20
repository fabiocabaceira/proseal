import { Fragment, type JSX } from 'react';
import { useRing } from '../../hooks/works/useRing';
import { pad2, ringFaces, type Kind } from './kinds';

/* One kind of work as a ring of photographs, and the arrows and count under it. */
export default function Ring({ kind }: { readonly kind: Kind }): JSX.Element {
  const { ringProps, stageRef, front, turn } = useRing();
  const real = kind.photos.length;

  return (
    <>
      <div className="ring" data-n={real} tabIndex={0} aria-roledescription="carousel" aria-label={`Photographs: ${kind.id}`} {...ringProps}>
        <div className="ring-stage" ref={stageRef}>
          {ringFaces(kind).map(({ photo: p, dup }, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <a
                className={i === front ? 'rc front' : 'rc'}
                href={`img/${p.img}-1600.webp`}
                data-cap={p.cap}
                data-dup={dup ? '' : undefined}
                tabIndex={dup ? -1 : undefined}
                aria-hidden={dup ? 'true' : undefined}
              >
                <img
                  src={`img/${p.img}-480.webp`}
                  data-thumb={`img/${p.img}-480.webp`}
                  srcSet={`img/${p.img}-480.webp 480w, img/${p.img}-900.webp 900w`}
                  sizes="(min-width:900px) 340px, 62vw"
                  alt={dup ? '' : p.alt}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <span className="rc-t">{p.cap}</span>
              </a>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="ring-ui">
        <button type="button" className="ring-b" data-d="-1" aria-label="Previous photograph" onClick={() => turn(-1)}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button>
        <span className="ring-c"><b>{pad2((front % real) + 1)}</b>{` / ${pad2(real)}`}</span>
        <button type="button" className="ring-b" data-d="1" aria-label="Next photograph" onClick={() => turn(1)}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
      </div>
    </>
  );
}
