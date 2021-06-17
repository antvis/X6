import {
  SVGCoreAttributes,
  SVGConditionalProcessingAttributes,
  SVGXLinkAttributes,
  SVGAnimationValueAttributes,
  SVGAnimationTimingAttributes,
  SVGAnimationAdditionAttributes,
  AnimationAttributeTargetAttributes,
} from '../types/attributes-core'

export interface SVGAnimateMotionAttributes
  extends SVGCoreAttributes<SVGAnimateMotionElement>,
    SVGConditionalProcessingAttributes,
    SVGXLinkAttributes,
    SVGAnimationValueAttributes,
    SVGAnimationTimingAttributes,
    SVGAnimationAdditionAttributes,
    AnimationAttributeTargetAttributes {
  /**
   * This attribute defines the path of the motion, using the same syntax as
   * the `d` attribute.
   */
  path?: string
  /**
   * This attribute indicate, in the range `[0,1]`, how far is the object
   * along the path for each keyTimes associated values.
   */
  keyPoints?: string
  /**
   * This attribute defines a rotation applied to the element animated along
   * a path, usually to make it pointing in the direction of the animation.
   */
  rotate?: number | 'auto' | 'auto-reverse'
}
