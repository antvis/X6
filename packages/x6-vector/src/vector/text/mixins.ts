import { TextExtension as TextpathExtension } from '../textpath/exts'
import { TextExtension as TspanExtension } from '../tspan/exts'
import { Text } from './text'

declare module './text' {
  interface Text<TSVGTextElement extends SVGTextElement | SVGTextPathElement>
    extends TextpathExtension<TSVGTextElement>,
      TspanExtension<TSVGTextElement> {}
}

Text.mixin(TspanExtension, TextpathExtension)
