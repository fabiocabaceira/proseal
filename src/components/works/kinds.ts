export interface Photo {
  /** file stem under img/: the ring shows -480/-900, full screen shows -1600 */
  readonly img: string;
  readonly cap: string;
  readonly alt: string;
}

export interface Kind {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  /** faces on the ring; the photographs repeat to fill them, so the cylinder stays round with only two or four */
  readonly faces: number;
  readonly photos: readonly Photo[];
}

export interface Face {
  readonly photo: Photo;
  readonly dup: boolean;
}

export const KINDS: readonly Kind[] = [
  {
    id: 'new-build',
    title: 'New build',
    text: 'Timber frame houses from the slab up: frames inside scaffolding, materials lifted to the roof, every stage on the same street.',
    faces: 12,
    photos: [
      { img: 'site-view', cap: 'The site from above', alt: 'The whole site seen from above, with the bay of Gibraltar behind' },
      { img: 'rock', cap: 'Under the Rock', alt: 'Timber frame house under scaffolding with the Rock of Gibraltar behind' },
      { img: 'terrace', cap: 'One street, every stage', alt: 'A row of new houses at different stages of construction along the same street' },
      { img: 'frame-1', cap: 'Frames up', alt: 'Two timber frame houses going up inside scaffolding, a worker on the roof' },
      { img: 'frame-2', cap: 'Lifting to the roof', alt: 'A lorry crane lifting materials to a roof being boarded' },
      { img: 'frame-3', cap: 'Under scaffolding', alt: 'A three storey house under scaffolding' },
    ],
  },
  {
    id: 'restoration',
    title: 'Restoration and steel frames',
    text: 'Old buildings brought back: iron roof trusses repainted, roof lights opened, and new light steel frames put up inside.',
    faces: 8,
    photos: [
      { img: 'gunwharf-arch', cap: 'The iron roof, restored', alt: 'Stone arch and repainted iron roof trusses at Gun Wharf' },
      { img: 'gunwharf-roof', cap: 'Under the trusses', alt: 'The iron roof at Gun Wharf seen from inside, with the roof lights open to the sky' },
      { img: 'lgfs-a', cap: 'A new steel frame inside', alt: 'New light steel framing standing inside the Gun Wharf building' },
      { img: 'lgfs-b', cap: 'Steel, stud by stud', alt: 'A corridor of light steel studs inside Gun Wharf' },
    ],
  },
  {
    id: 'roofs',
    title: 'Roofing and waterproofing',
    text: 'Slate laid by hand, and waterproofing systems from our partner manufacturers in Germany and the UK.',
    faces: 8,
    photos: [
      { img: 'slates', cap: 'Slate, laid by hand', alt: 'Roofer laying slate with roof windows already set, the bay behind' },
      { img: 'membrane', cap: 'A liquid membrane on a roof edge', alt: 'A grey liquid membrane covering a roof edge, scaffolding beside it' },
    ],
  },
];

export function ringFaces(kind: Kind): readonly Face[] {
  const n = kind.photos.length;
  return Array.from({ length: kind.faces }, (_, i) => ({ photo: kind.photos[i % n], dup: i >= n }));
}

export const pad2 = (n: number): string => String(n).padStart(2, '0');
