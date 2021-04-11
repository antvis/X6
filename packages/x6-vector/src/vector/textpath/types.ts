import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGTextPathAttributes
  extends SVGCommonAttributes<SVGTextPathElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes,
    SVGXLinkAttributes {
  href?: string
  lengthAdjust?: 'spacing' | 'spacingAndGlyphs'
  method?: 'align' | 'stretch'
  path?: string
  side?: 'left' | 'right'
  spacing?: 'auto' | 'exact'
  startOffset?: string | number
  textLength?: string | number
}
