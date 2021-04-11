import * as CSS from './csstype'

export { CSS }

export interface CSSProperties extends CSS.Properties<string | number> {}

export type CSSPropertyName = keyof CSSProperties // Exclude<keyof CSSProperties, number>
