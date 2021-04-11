import { Base } from '../common/base'
import { Style } from './style'

export class ElementExtension<
  TSVGElement extends SVGElement = SVGElement
> extends Base<TSVGElement> {
  style(
    selector: string,
    style?: Record<string | number, string | number>,
  ): Style {
    return new Style().addRule(selector, style).appendTo(this)
  }

  fontFace(
    name: string,
    source: string,
    parameters: Record<string | number, string | number>,
  ): Style {
    return new Style().addFont(name, source, parameters).appendTo(this)
  }
}
