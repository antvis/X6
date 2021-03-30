import { Obj } from '../../util/obj'
import { TextExtension as TextpathExtension } from './textpath-ext'
import { TextExtension as TspanExtension } from './tspan-ext'
import { Text } from './text'

declare module './text' {
  interface Text<TSVGTextElement extends SVGTextElement | SVGTextPathElement>
    extends TextpathExtension<TSVGTextElement>,
      TspanExtension<TSVGTextElement> {}
}

Obj.applyMixins(Text, TspanExtension, TextpathExtension)
