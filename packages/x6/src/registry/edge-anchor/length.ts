import { EdgeConnectionAnchor } from './index'

export interface LengthAnchorOptions {
  length?: number
}

export const length: EdgeConnectionAnchor.Definition<LengthAnchorOptions> = function (
  view,
  magnet,
  ref,
  options,
) {
  const length = options.length != null ? options.length : 20
  return view.getPointAtLength(length)!
}
