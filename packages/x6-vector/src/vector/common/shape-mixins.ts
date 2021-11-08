import { applyMixins } from '../../util/mixin'

import { ContainerExtension as AnimateExtension } from '../animate/exts'
import { ContainerExtension as AnimateMotionExtension } from '../animate-motion/exts'
import { ContainerExtension as AnimateTransformExtension } from '../animate-transform/exts'

import { Shape } from './shape'

declare module './shape' {
  interface Shape<TSVGGraphicsElement extends SVGGraphicsElement>
    extends AnimateExtension<TSVGGraphicsElement>,
      AnimateMotionExtension<TSVGGraphicsElement>,
      AnimateTransformExtension<TSVGGraphicsElement> {}
}

applyMixins(
  Shape,
  AnimateExtension,
  AnimateMotionExtension,
  AnimateTransformExtension,
)
