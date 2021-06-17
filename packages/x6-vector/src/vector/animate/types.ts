import {
  SVGCoreAttributes,
  SVGXLinkAttributes,
  SVGConditionalProcessingAttributes,
  SVGAnimationValueAttributes,
  SVGAnimationTimingAttributes,
  SVGAnimationAdditionAttributes,
  AnimationAttributeTargetAttributes,
} from '../types/attributes-core'

export interface SVGAnimateAttributes
  extends SVGCoreAttributes<SVGAnimateElement>,
    SVGConditionalProcessingAttributes,
    SVGXLinkAttributes,
    SVGAnimationValueAttributes,
    SVGAnimationTimingAttributes,
    SVGAnimationAdditionAttributes,
    AnimationAttributeTargetAttributes {}
