import type { JSX } from 'react';

/* Line icons for the project fact sheets, drawn on a 24 grid in the same thin navy stroke as the site's drawings. */
const PATHS = {
  villa: 'M3 20h18M5 20V10h14v10M3 10h18M9 20v-5h6v5M15 7h4v3',
  house: 'M3 20h18M5 20v-9l7-6 7 6v9M10 20v-5h4v5',
  estate: 'M2 20h20M4 20v-7l4-3 4 3v7M12 20v-9l4-3 4 3v9M7 20v-3h2v3M15 20v-3h2v3',
  bank: 'M4 9h16L12 4zM6 9v8M10 9v8M14 9v8M18 9v8M3 17h18M3 20h18',
  clinic: 'M4 20V6h16v14M2 20h20M12 9v6M9 12h6',
  heritage: 'M2 20h20M4 20V11a8 8 0 0 1 16 0v9M8 20v-8a4 4 0 0 1 8 0v8',
  pin: 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zM12 8a2 2 0 1 0 0 4 2 2 0 1 0 0-4z',
  crane: 'M7 21V3M4 21h7M7 3h13M7 7l4-4M18 3v5M16 8h4v3h-4z',
  tools: 'M14.5 4.5l5 5-2.5 2.5-5-5zM12 7l-8 8a2.1 2.1 0 0 0 3 3l8-8',
  history: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4M12 8v4l3 2',
  bed: 'M3 19V7M3 14h18v5M21 14v-2a3 3 0 0 0-3-3h-7v5M7 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3z',
  bath: 'M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2',
  pool: 'M3 18c2 0 2-1.5 4.5-1.5S10 18 12 18s2-1.5 4.5-1.5S19 18 21 18M9 14V5M15 14V5M9 8h6M9 11h6',
  cinema: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM10 9v6l5-3z',
  sauna: 'M4 20h16M5 16h14M7 16v4M17 16v4M9 12c-1-1.5 1-2.5 0-4s1-2.5 0-4M13 12c-1-1.5 1-2.5 0-4s1-2.5 0-4',
  gym: 'M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12',
  apartments: 'M6 21V3h12v18M3 21h18M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2',
  townhouse: 'M3 21h18M4 21V9l4-3 4 3 4-3 4 3v12M12 9v12M7 21v-4h2v4M15 21v-4h2v4',
  parking: 'M4 3h16v18H4zM10 17V7h3a3 3 0 0 1 0 6h-3',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  open: 'M4 21V4h11v17M2 21h20M15 4l5 2v15M12 12v1',
  roller: 'M5 4h12v5H5zM17 6h2v5h-7v3M11 14h2v7h-2z',
  bricks: 'M3 6h18v12H3zM3 10h18M3 14h18M9 6v4M15 6v4M6 10v4M12 10v4M18 10v4M9 14v4M15 14v4',
  newhouse: 'M3 20h18M5 20v-8l7-6 7 6v8M12 11v5M9.5 13.5h5',
  cross: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
  scan: 'M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM4 21h16',
  rooms: 'M3 3h18v18H3zM3 12h18M12 3v18',
  truss: 'M2 18h20M3 18l9-10 9 10M12 8v10M7.5 13l4.5 5M16.5 13L12 18',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  studs: 'M5 3v18M10 3v18M15 3v18M20 3v18M3 3h19M3 21h19',
  tiles: 'M3 6h18M3 12h18M3 18h18M7 6v6M13 6v6M19 6v6M5 12v6M11 12v6M17 12v6',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  frame: 'M3 21h18M5 21V10l7-6 7 6v11M5 10h14M9 21V10M15 21V10M5 15h14',
  render: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  sea: 'M3 15c2 0 2-1.5 4.5-1.5S10 15 12 15s2-1.5 4.5-1.5S19 15 21 15M3 19c2 0 2-1.5 4.5-1.5S10 19 12 19s2-1.5 4.5-1.5S19 19 21 19M8 11l4-7 4 7',
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name }: { readonly name: IconName }): JSX.Element {
  return (
    <svg className="ico-l" viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
