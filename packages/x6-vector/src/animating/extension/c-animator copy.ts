// import { Point } from '../../struct/point'
// import { Morphable } from '../morpher/morphable'
// import { MorphableUnitNumber } from '../morpher/morphable-unit-number'
// import { Morpher } from '../morpher/morpher'
// import type { VectorElement } from '../../element'
// import { HTMLAnimator } from './html-animator'
// import { Box } from '../../struct/box'
// import { MorphableBox } from '../morpher/morphable-box'

// export class VectorAnimator<
//   TTarget extends VectorElement = VectorElement
// > extends VectorAnimator<TTarget> {

//   update(o) {
//     if (typeof o !== 'object') {
//       return this.update({
//         offset: arguments[0],
//         color: arguments[1],
//         opacity: arguments[2],
//       })
//     }

//     if (o.opacity != null) this.attr('stop-opacity', o.opacity)
//     if (o.color != null) this.attr('stop-color', o.color)
//     if (o.offset != null) this.attr('offset', o.offset)

//     return this
//   }
// }
