import {
  SVGCoreAttributes,
  SVGConditionalProcessingAttributes,
  SVGXLinkAttributes,
  SVGAnimationValueAttributes,
  SVGAnimationTimingAttributes,
  SVGAnimationAdditionAttributes,
  AnimationAttributeTargetAttributes,
} from '../types/attributes-core'

export interface SVGAnimateTransformAttributes
  extends SVGCoreAttributes<SVGAnimateTransformElement>,
    SVGConditionalProcessingAttributes,
    SVGXLinkAttributes,
    SVGAnimationValueAttributes,
    SVGAnimationTimingAttributes,
    SVGAnimationAdditionAttributes,
    AnimationAttributeTargetAttributes {
  /**
   * The `type` attribute defines the type of transformation, whose values
   * change over time.
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
   */
  type?: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY'
}
