import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

export type In =
  | 'SourceGraphic'
  | 'SourceAlpha'
  | 'BackgroundImage'
  | 'BackgroundAlpha'
  | 'FillPaint'
  | 'StrokePaint'

export interface SVGFEBlendAttributes
  extends SVGCoreAttributes<SVGFEBlendElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  in2?: In | string
  mode?: BlendMode
}
