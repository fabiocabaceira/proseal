/* The works page, project by project.
   To add photographs to a project: save each one under public/img/projects/<slug>/ in two widths, <stem>-900.webp and
   <stem>-1600.webp, then list it in that project's photos as { img: 'projects/<slug>/<stem>', caption, alt }.
   A project with no photographs shows a titled panel in their place, so nothing else on the page has to change. */

import type { IconName } from '../components/works/Icon';

/** one line of a project's fact sheet: the type, the location, the status and our part in it */
export interface Fact {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
}

/** a key feature, shown as a chip with its icon */
export interface Feature {
  readonly icon: IconName;
  readonly text: string;
}

export interface Photo {
  /** file stem under img/: the grid shows -900, full screen shows -1600 */
  readonly img: string;
  readonly caption: string;
  readonly alt: string;
}

export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly kind: string;
  readonly place: string;
  readonly status: string;
  readonly text: readonly string[];
  readonly facts: readonly Fact[];
  readonly features: readonly Feature[];
  readonly photos: readonly Photo[];
  /** a line under the photographs, where they are not photographs of the finished work */
  readonly credit?: string;
}

/* the current projects, as presented by the company */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'buena-vista-villa',
    name: 'Buena Vista Villa',
    kind: 'Luxury residential villa',
    place: 'Gibraltar',
    status: 'Current project',
    text: [
      'ProSeal is building this luxury villa in the South District, one of the company’s principal residential projects.',
      'It is being built to a high specification, with a strong emphasis on quality, craftsmanship and attention to detail at every stage.',
    ],
    facts: [
      { icon: 'villa', label: 'Type', value: 'Luxury residential villa' },
      { icon: 'pin', label: 'Location', value: 'South District' },
      { icon: 'crane', label: 'Status', value: 'Under construction' },
      { icon: 'tools', label: 'Our work', value: 'New build' },
    ],
    features: [],
    photos: [
      { img: 'projects/buena-vista-villa/villa', caption: 'The villa, with its infinity pool and green roof', alt: 'A white modern villa with a green roof, an infinity pool on its terrace and gardens below' },
      { img: 'projects/buena-vista-villa/aerial', caption: 'Seen from above, with the Rock behind', alt: 'Aerial view of modern white villas with green roofs and pools along a road below the Rock of Gibraltar' },
      { img: 'projects/buena-vista-villa/pool', caption: 'The pool and gardens', alt: 'A curved swimming pool seen from above, surrounded by gardens, parasols and stone walls' },
      { img: 'projects/buena-vista-villa/terrace', caption: 'From the terrace, across the Strait to Africa', alt: 'A terrace with two sun loungers behind floor-to-ceiling glass, looking across the sea to the mountains of Africa' },
    ],
    credit: 'Computer-generated images based on the architect’s designs.',
  },
  {
    slug: 'healy-house',
    name: 'Healy House',
    kind: 'Luxury private residence',
    place: 'South District, Gibraltar',
    status: 'Current project',
    text: [
      'Healy House is a substantial property in the South District that once operated as a nursing home.',
      'ProSeal is carrying out an extensive refurbishment and modernisation to transform it into a high-end private residence.',
    ],
    facts: [
      { icon: 'house', label: 'Type', value: 'Luxury private residence' },
      { icon: 'pin', label: 'Location', value: 'South District' },
      { icon: 'crane', label: 'Status', value: 'Works in progress' },
      { icon: 'tools', label: 'Our work', value: 'Refurbishment and modernisation' },
    ],
    features: [
      { icon: 'history', text: 'Formerly a nursing home' },
      { icon: 'bed', text: 'Six bedrooms' },
      { icon: 'bath', text: 'Six bathrooms' },
      { icon: 'pool', text: 'Private infinity pool' },
      { icon: 'cinema', text: 'Dedicated cinema room' },
      { icon: 'sauna', text: 'Sauna' },
      { icon: 'gym', text: 'Gymnasium' },
    ],
    photos: [],
  },
  {
    slug: 'europa-walks',
    name: 'Europa Walks',
    kind: 'Residential development',
    place: 'Gibraltar',
    status: 'Current project',
    text: [
      'Europa Walks is a residential development of villas, townhouses and apartments, bringing several property types together in a single scheme.',
      'A development of this kind calls for careful planning, coordination and management across every stage of construction.',
    ],
    facts: [
      { icon: 'estate', label: 'Type', value: 'Residential development' },
      { icon: 'pin', label: 'Location', value: 'Europa Point' },
      { icon: 'crane', label: 'Status', value: 'Works in progress' },
      { icon: 'tools', label: 'Our work', value: 'Construction' },
    ],
    features: [
      { icon: 'villa', text: 'Villas' },
      { icon: 'townhouse', text: 'Townhouses' },
      { icon: 'apartments', text: 'Apartments' },
      { icon: 'pool', text: 'Communal pool' },
      { icon: 'parking', text: 'Underground car park' },
      { icon: 'sun', text: 'Solar PV panels' },
    ],
    photos: [],
  },
  {
    slug: 'turicum-private-bank',
    name: 'Turicum Private Bank',
    kind: 'Commercial development',
    place: 'Gibraltar',
    status: 'Current project',
    text: [
      'ProSeal has completed a full refurbishment and major alterations to the building, and is now constructing a complete new floor.',
      'The bank has remained fully operational throughout, so every stage is planned, coordinated and communicated to keep the work safe and efficient.',
    ],
    facts: [
      { icon: 'bank', label: 'Type', value: 'Private bank premises' },
      { icon: 'pin', label: 'Location', value: 'Main Street' },
      { icon: 'crane', label: 'Status', value: 'New floor under construction' },
      { icon: 'tools', label: 'Our work', value: 'Refurbishment, alterations and a new floor' },
    ],
    features: [
      { icon: 'roller', text: 'Full refurbishment' },
      { icon: 'bricks', text: 'Major alterations' },
      { icon: 'layers', text: 'A complete new floor' },
      { icon: 'open', text: 'Bank open throughout the works' },
    ],
    photos: [],
  },
  {
    slug: 'lancashire-house',
    name: 'Lancashire House',
    kind: 'Luxury residence',
    place: 'Gibraltar',
    status: 'Current project',
    text: [
      'ProSeal has carried out major alterations to the existing house and, as the development continues, is now building a new luxury residence within its grounds.',
      'The project combines extensive work on an established high-end home with new-build construction on the same site.',
    ],
    facts: [
      { icon: 'house', label: 'Type', value: 'Luxury residence' },
      { icon: 'pin', label: 'Location', value: 'South District' },
      { icon: 'crane', label: 'Status', value: 'New residence under construction' },
      { icon: 'tools', label: 'Our work', value: 'Alterations and new build' },
    ],
    features: [
      { icon: 'bricks', text: 'Major alterations to the existing house' },
      { icon: 'newhouse', text: 'New luxury residence within the grounds' },
    ],
    photos: [],
  },
  {
    slug: 'gibmed-clinic-icc',
    name: 'GibMed Clinic ICC',
    kind: 'Healthcare · specialist clinical facility',
    place: 'Gibraltar',
    status: 'Current project',
    text: [
      'ProSeal is transforming GibMed Clinic into a specialist clinical facility, constructing and fitting out highly technical clinical spaces and the infrastructure that supports them.',
      'The work calls for detailed planning, close coordination with the client and specialist contractors, and careful management of the technical requirements of medical equipment.',
    ],
    facts: [
      { icon: 'clinic', label: 'Type', value: 'Specialist clinical facility' },
      { icon: 'pin', label: 'Location', value: 'ICC, Casemates Square' },
      { icon: 'crane', label: 'Status', value: 'Works in progress' },
      { icon: 'tools', label: 'Our work', value: 'Construction and fit-out' },
    ],
    features: [
      { icon: 'cross', text: 'Operating theatre' },
      { icon: 'scan', text: 'X-ray and MRI rooms' },
      { icon: 'bed', text: 'Recovery facilities and patient bed spaces' },
      { icon: 'rooms', text: 'Clinical rooms and supporting areas' },
    ],
    photos: [],
  },
];

/* the fact sheets of the further projects, shown beside their photographs */
export const BEACON_FACTS: readonly Fact[] = [
  { icon: 'estate', label: 'Type', value: 'Residential development' },
  { icon: 'pin', label: 'Location', value: 'Europa Point' },
  { icon: 'crane', label: 'Status', value: 'In development' },
  { icon: 'tools', label: 'Our work', value: 'Building the development' },
];
export const BEACON_FEATURES: readonly Feature[] = [
  { icon: 'townhouse', text: 'Townhouses' },
  { icon: 'villa', text: 'Villas' },
  { icon: 'apartments', text: 'Luxury apartments' },
  { icon: 'pool', text: 'Communal pool' },
  { icon: 'parking', text: 'Underground car park' },
  { icon: 'sun', text: 'Solar PV panels' },
  { icon: 'sea', text: 'Views across the Strait to Morocco' },
];
export const GUN_WHARF_FACTS: readonly Fact[] = [
  { icon: 'heritage', label: 'Type', value: 'Historic building' },
  { icon: 'pin', label: 'Location', value: 'HM Naval Base' },
  { icon: 'crane', label: 'Status', value: 'Works carried out' },
  { icon: 'tools', label: 'Our work', value: 'Restoration and steel framing' },
];
export const GUN_WHARF_FEATURES: readonly Feature[] = [
  { icon: 'truss', text: 'Iron roof trusses repainted' },
  { icon: 'sun', text: 'Roof lights opened up' },
  { icon: 'studs', text: 'New light-gauge steel framing' },
];

/* the developer's renders of The Villas Beacon Point, Europa Point: not ours, credited wherever they are shown */
export const BEACON_RENDERS: readonly Photo[] = [
  { img: 'beacon-villa', caption: 'The villas · developer’s render', alt: 'Developer’s render of a villa at Beacon Point, with glass balconies and timber screens' },
  { img: 'beacon-group', caption: 'The terraces · developer’s render', alt: 'Developer’s render of the homes at Beacon Point, with glass balconies and garden terraces' },
  { img: 'beacon-poolday', caption: 'The communal pool · developer’s render', alt: 'Developer’s render of the communal pool at Beacon Point, with palms and townhouses around it' },
];

export const GUN_WHARF: readonly Photo[] = [
  { img: 'gunwharf-arch', caption: 'Gun Wharf · the iron roof, restored', alt: 'Stone arch and repainted iron roof trusses at Gun Wharf' },
  { img: 'gunwharf-roof', caption: 'Gun Wharf · beneath the trusses', alt: 'The iron roof at Gun Wharf seen from inside, with the roof lights open to the sky' },
  { img: 'lgfs-a', caption: 'Gun Wharf · new light-gauge steel framing', alt: 'New light-gauge steel framing standing inside the Gun Wharf building' },
  { img: 'lgfs-b', caption: 'Gun Wharf · steel studs in place', alt: 'A corridor of light-gauge steel studs inside Gun Wharf' },
];

/* photographs from ProSeal sites that are not tied to a named project */
export interface PhotoSet {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly features?: readonly Feature[];
  readonly photos: readonly Photo[];
}

export const SITE_PHOTOS: readonly PhotoSet[] = [
  {
    id: 'new-build-housing',
    title: 'New-build housing',
    text: 'These timber-frame houses rise from the slab inside scaffolding, with every stage of construction visible along one street.',
    features: [
      { icon: 'frame', text: 'Timber-frame construction' },
      { icon: 'layers', text: 'Every stage on one street' },
    ],
    photos: [
      { img: 'site-view', caption: 'The site from above', alt: 'A ProSeal housing site seen from above, with the Bay of Gibraltar behind' },
      { img: 'rock', caption: 'Beneath the Rock', alt: 'A timber-frame house under scaffolding, with the Rock of Gibraltar behind' },
      { img: 'terrace', caption: 'One street, every stage', alt: 'A row of new houses at different stages of construction along the same street' },
      { img: 'frame-1', caption: 'Timber frames going up', alt: 'Two timber-frame houses rising inside scaffolding, with a worker on the roof' },
      { img: 'frame-2', caption: 'Materials lifted to the roof', alt: 'A lorry-mounted crane lifting materials to a roof as it is boarded' },
      { img: 'frame-3', caption: 'Under scaffolding', alt: 'A three-storey house under scaffolding' },
    ],
  },
  {
    id: 'roofing',
    title: 'Roofing and waterproofing',
    text: 'We lay natural slate by hand and install waterproofing systems from our partner manufacturers in Germany and the UK.',
    features: [
      { icon: 'tiles', text: 'Natural slate laid by hand' },
      { icon: 'drop', text: 'Waterproofing systems from Germany and the UK' },
    ],
    photos: [
      { img: 'slates', caption: 'Slate laid by hand', alt: 'A roofer laying slate around roof windows already in place, with the bay behind' },
      { img: 'membrane', caption: 'Liquid membrane on a roof edge', alt: 'A grey liquid waterproofing membrane covering a roof edge, with scaffolding beside it' },
    ],
  },
];

/* further work without photographs on the site */
export const ALSO_BUILT: readonly string[] = ['The Island', 'The Sails', 'Beaulieu House', '1 Rosia Parade', 'Rock Cottage'];
