export enum FontStyle {
  bold = 1,
  italic = 2,
  underlined = 4,
}

export namespace FontStyle {
  export function isBold(fontStyle: FontStyle) {
    return (fontStyle & FontStyle.bold) === FontStyle.bold
  }

  export function isItalic(fontStyle: FontStyle) {
    return (fontStyle & FontStyle.italic) === FontStyle.italic
  }

  export function isUnderlined(fontStyle: FontStyle) {
    return (fontStyle & FontStyle.underlined) === FontStyle.underlined
  }
}
