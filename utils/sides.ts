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

// Mirrors the per-side --surface-color values defined in TheCube.vue styles
export const SIDE_COLORS: Record<SideType, string> = {
  front: '#3973cc',
  back: '#e05a5a',
  left: '#e09c36',
  right: '#36b374',
  top: '#36b0c2',
  bottom: '#9b6bc2',
};

// Routes map sides to /1../6 by their position in SIDES
export const getSideFromRouteParam = (param: string | string[] | undefined): SideType => {
  const rawParam = Array.isArray(param) ? param[0] : param;
  const sideIndex = Number(rawParam) - 1;
  const side = SIDES[sideIndex];

  return side ?? 'front';
};

export const getRoutePathFromSide = (side: SideType): string => `/${SIDES.indexOf(side) + 1}`;
