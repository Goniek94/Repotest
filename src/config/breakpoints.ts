export const SCREENS = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  x2l: 1536,
} as const;

export const mq = {
  up: (px: number) => `(min-width: ${px}px)`,
  down: (px: number) => `(max-width: ${px}px)`,
  between: (a: number, b: number) => `(min-width: ${a}px) and (max-width: ${b}px)`,
};

export type ScreenKey = keyof typeof SCREENS;
