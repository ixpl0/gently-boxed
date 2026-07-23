export const SIDES = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

export type SideType = typeof SIDES[number];

export const SIDE_LABELS: Record<SideType, string> = {
  front: 'Profile',
  back: 'Contacts',
  left: 'Experience',
  right: 'Projects',
  top: 'How I work',
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

// Mirrors the per-side SparklesSparkles types rendered inside TheCube.vue
export const SIDE_SPARKLE_TYPES = {
  front: 'star',
  back: 'cross',
  left: 'plus',
  right: 'star',
  top: 'diamond',
  bottom: 'cross',
} as const satisfies Record<SideType, string>;

// Mirrors the per-side --side-accent values defined in TheCube.vue styles
export const SIDE_COLORS: Record<SideType, string> = {
  front: '#5173ab',
  back: '#c25b53',
  left: '#af8a4b',
  right: '#4f9e66',
  top: '#45939c',
  bottom: '#7867b0',
};

// Routes map sides to /1../6 by their position in SIDES
export const getSideFromRouteParam = (param: string | string[] | undefined): SideType => {
  const rawParam = Array.isArray(param) ? param[0] : param;
  const sideIndex = Number(rawParam) - 1;
  const side = SIDES[sideIndex];

  return side ?? 'front';
};

export const getRoutePathFromSide = (side: SideType): string => `/${SIDES.indexOf(side) + 1}`;
