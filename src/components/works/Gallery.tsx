import type { JSX } from 'react';
import type { Photo } from '../../data/projects';

/* A project's photographs: the first one wide, the rest in pairs. Each opens full screen (PhotoViewer). */
export default function Gallery({ photos, label }: { readonly photos: readonly Photo[]; readonly label: string }): JSX.Element {
  return (
    <ul className="gal" aria-label={label}>
      {photos.map((p, i) => (
        <li key={p.img}>
          <a className="shot" href={`img/${p.img}-1600.webp`} data-cap={p.caption}>
            <span className="shot-img">
              <img
                src={`img/${p.img}-900.webp`}
                srcSet={`img/${p.img}-900.webp 900w, img/${p.img}-1600.webp 1600w`}
                sizes={i === 0 ? '(min-width:900px) 680px, 100vw' : '(min-width:900px) 340px, 50vw'}
                alt={p.alt}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="shot-t">{p.caption}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* where a project's photographs will go once they are released */
export function PhotosToFollow({ name }: { readonly name: string }): JSX.Element {
  return (
    <div className="pj-wait">
      <i className="cm tl" />
      <i className="cm tr" />
      <i className="cm bl" />
      <i className="cm br" />
      <p className="pj-wait-k">Photography in preparation</p>
      <p className="pj-wait-n" aria-hidden="true">{name}</p>
      <p className="pj-wait-p">Photographs of this project will be published here.</p>
    </div>
  );
}
