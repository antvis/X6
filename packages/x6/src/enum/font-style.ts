export enum FontStyle {
  bold = 1,
  italic = 2,
  underlined = 4,
}

export namespace FontStyle {
  export function isBold(fontStyle?: FontStyle | null) {
    return fontStyle != null && (fontStyle & FontStyle.bold) === FontStyle.bold
  }

  export function isItalic(fontStyle?: FontStyle | null) {
    return (
      fontStyle != null && (fontStyle & FontStyle.italic) === FontStyle.italic
    )
  }

  export function isUnderlined(fontStyle?: FontStyle | null) {
    return (
      fontStyle != null &&
      (fontStyle & FontStyle.underlined) === FontStyle.underlined
    )
  }
}
