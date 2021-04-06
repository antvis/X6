export type Definition = (t: number) => number
export type Names = keyof typeof presets

export const presets = {
  linear: (t: number) => t,
  easeOut: (t: number) => Math.sin((t * Math.PI) / 2),
  easeIn: (t: number) => -Math.cos((t * Math.PI) / 2) + 1,
  easeInOut: (t: number) => -Math.cos(t * Math.PI) / 2 + 0.5,
}
