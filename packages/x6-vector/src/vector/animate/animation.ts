import { Base } from '../common/base'
import {
  SVGAnimationValueCalcMode,
  SVGAnimationTimingRestartMode,
  SVGAnimationTimingRepeatCount,
  SVGAnimationTimingRepeatDuration,
  SVGAnimationTimingFillMode,
  AnimationAttributeTargetAttributeType,
  SVGAnimationAdditionAttributeAdditive,
  SVGAnimationAdditionAttributeAccumulate,
} from '../types'

export class Animation<
  TSVGAnimationElement extends
    | SVGAnimateElement
    | SVGAnimateMotionElement
    | SVGAnimateTransformElement,
> extends Base<TSVGAnimationElement> {
  // #region SVGAnimationValueAttributes

  from(): string | number
  from(v: string | number | null): this
  from(v?: string | number | null) {
    return this.attr('from', v)
  }

  to(): string | number
  to(v: string | number | null): this
  to(v?: string | number | null) {
    return this.attr('to', v)
  }

  by(): string | number
  by(v: string | number | null): this
  by(v?: string | number | null) {
    return this.attr('by', v)
  }

  calcMode(): SVGAnimationValueCalcMode
  calcMode(mode: SVGAnimationValueCalcMode | null): this
  calcMode(mode?: SVGAnimationValueCalcMode | null) {
    return this.attr('calcMode', mode)
  }

  values(): string
  values(v: string | null): this
  values(v?: string | null) {
    return this.attr('values', v)
  }

  keyTimes(): string
  keyTimes(v: string | null): this
  keyTimes(v?: string | null) {
    return this.attr('keyTimes', v)
  }

  keySplines(): string
  keySplines(v: string | null): this
  keySplines(v?: string | null) {
    return this.attr('keySplines', v)
  }

  // #endregion

  // #region SVGAnimationTimingAttributes

  begin(): string
  begin(v: string | null): this
  begin(v?: string | null) {
    return this.attr('begin', v)
  }

  end(): string
  end(v: string | null): this
  end(v?: string | null) {
    return this.attr('end', v)
  }

  dur(): string
  dur(v: string | null): this
  dur(v?: string | null) {
    return this.attr('dur', v)
  }

  min(): string
  min(v: string | null): this
  min(v?: string | null) {
    return this.attr('min', v)
  }

  max(): string
  max(v: string | null): this
  max(v?: string | null) {
    return this.attr('max', v)
  }

  repeatCount(): SVGAnimationTimingRepeatCount
  repeatCount(v: SVGAnimationTimingRepeatCount | null): this
  repeatCount(v?: SVGAnimationTimingRepeatCount | null) {
    return this.attr('repeatCount', v)
  }

  repeatDur(): SVGAnimationTimingRepeatDuration
  repeatDur(v: SVGAnimationTimingRepeatDuration | null): this
  repeatDur(v?: SVGAnimationTimingRepeatDuration | null) {
    return this.attr('repeatDur', v)
  }

  restartMode(): SVGAnimationTimingRestartMode
  restartMode(v: SVGAnimationTimingRestartMode | null): this
  restartMode(v?: SVGAnimationTimingRestartMode | null) {
    return this.attr('restart', v)
  }

  fillMode(): SVGAnimationTimingFillMode
  fillMode(v: SVGAnimationTimingFillMode | null): this
  fillMode(v?: SVGAnimationTimingFillMode | null) {
    return this.attr('fill', v)
  }

  // #endregion

  // #region SVGAnimationAdditionAttributes

  additive(): SVGAnimationAdditionAttributeAdditive
  additive(v: SVGAnimationAdditionAttributeAdditive | null): this
  additive(v?: SVGAnimationAdditionAttributeAdditive | null) {
    return this.attr('additive', v)
  }

  accumulate(): SVGAnimationAdditionAttributeAccumulate
  accumulate(v: SVGAnimationAdditionAttributeAccumulate | null): this
  accumulate(v?: SVGAnimationAdditionAttributeAccumulate | null) {
    return this.attr('accumulate', v)
  }

  // #endregion

  // #region AnimationAttributeTargetAttributes

  attributeName(): string
  attributeName(name: string | null): this
  attributeName(name?: string | null) {
    return this.attr('attributeName', name)
  }

  attributeType(): AnimationAttributeTargetAttributeType
  attributeType(type: AnimationAttributeTargetAttributeType | null): this
  attributeType(type?: AnimationAttributeTargetAttributeType | null) {
    return this.attr('attributeType', type)
  }

  // #endregion
}

export namespace Animation {}
