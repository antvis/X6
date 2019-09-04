import { Rectangle } from '.'

export namespace PageFormat {
  export const A4_PORTRAIT = new Rectangle(0, 0, 827, 1169)
  export const A4_LANDSCAPE = new Rectangle(0, 0, 1169, 827)
  export const LETTER_PORTRAIT = new Rectangle(0, 0, 850, 1100)
  export const LETTER_LANDSCAPE = new Rectangle(0, 0, 1100, 850)
}
