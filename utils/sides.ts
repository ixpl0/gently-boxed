export const SIDES = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

export type SideType = typeof SIDES[number];

export const SIDE_LABELS: Record<SideType, string> = {
  front: 'Profile',
  back: 'How I work',
  left: 'Experience',
  right: 'Projects',
  top: 'Contacts',
  bottom: '???',
};

export type DirectionType = 'left' | 'right' | 'up' | 'down';

// Which face lies in each screen direction for every fixed orientation in TheCube.vue,
// derived from the per-side rotation matrices — spinning toward a direction shows that face
export const SIDE_NEIGHBORS: Record<SideType, Record<DirectionType, SideType>> = {
  front: {
    left: 'left',
    right: 'right',
    up: 'top',
    down: 'bottom',
  },
  back: {
    left: 'top',
    right: 'bottom',
    up: 'left',
    down: 'right',
  },
  left: {
    left: 'front',
    right: 'back',
    up: 'bottom',
    down: 'top',
  },
  right: {
    left: 'bottom',
    right: 'top',
    up: 'front',
    down: 'back',
  },
  top: {
    left: 'back',
    right: 'front',
    up: 'right',
    down: 'left',
  },
  bottom: {
    left: 'right',
    right: 'left',
    up: 'back',
    down: 'front',
  },
};

// Mirrors the per-side SparklesSparkles types rendered inside TheCube.vue; front,
// back and bottom carry dedicated ambience components instead of sparkles and
// keep placeholder entries only to satisfy the per-side map shape
export const SIDE_SPARKLE_TYPES = {
  front: 'star',
  back: 'cross',
  left: 'plus',
  right: 'star',
  top: 'diamond',
  bottom: 'cross',
} as const satisfies Record<SideType, string>;

// Per-side accents for UI outside the cube (navigation dots); the hex values live
// once in the :root palette in assets/css/global.css, shared with TheCube's faces
export const SIDE_COLORS: Record<SideType, string> = {
  front: 'var(--color-accent-front)',
  back: 'var(--color-back-yellow)',
  left: 'var(--color-accent-left)',
  right: 'var(--color-accent-right)',
  top: 'var(--color-accent-top)',
  bottom: 'var(--color-accent-bottom)',
};

// Per-side page backgrounds behind the cube; .main-page crossfades between them in
// sync with the spin. Sides without their own color yet keep the shared dark ink base
export const SIDE_BACKGROUNDS: Record<SideType, string> = {
  front: 'var(--color-page-front)',
  back: 'var(--color-page-back)',
  left: 'var(--color-ink)',
  right: 'var(--color-ink)',
  top: 'var(--color-ink)',
  bottom: 'var(--color-ink)',
};

// Wheel navigation walks the route order /1../6 as a ring: scrolling past either
// end wraps around to the other, so bottom -> front and front -> bottom
export const getAdjacentSide = (side: SideType, step: 1 | -1): SideType => {
  const adjacentIndex = (SIDES.indexOf(side) + step + SIDES.length) % SIDES.length;

  return SIDES[adjacentIndex] ?? side;
};

// Routes map sides to /1../6 by their position in SIDES
export const getSideFromRouteParam = (param: string | string[] | undefined): SideType => {
  const rawParam = Array.isArray(param) ? param[0] : param;
  const sideIndex = Number(rawParam) - 1;
  const side = SIDES[sideIndex];

  return side ?? 'front';
};

export const getRoutePathFromSide = (side: SideType): string => `/${SIDES.indexOf(side) + 1}`;
