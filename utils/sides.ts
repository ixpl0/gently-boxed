export const SIDES = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

export type SideType = typeof SIDES[number];

// Routes map sides to /1../6 by their position in SIDES
export const getSideFromRouteParam = (param: string | string[] | undefined): SideType => {
  const rawParam = Array.isArray(param) ? param[0] : param;
  const sideIndex = Number(rawParam) - 1;
  const side = SIDES[sideIndex];

  return side ?? 'front';
};

export const getRoutePathFromSide = (side: SideType): string => `/${SIDES.indexOf(side) + 1}`;
