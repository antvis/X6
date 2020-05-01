import { EdgeAnchor } from './index'

export interface RatioAnchorOptions {
  ratio?: number
}

export const ratio: EdgeAnchor.Definition<RatioAnchorOptions> = function(
  view,
  magnet,
  ref,
  options,
) {
  const ratio = options.ratio != null ? options.ratio : 0.5
  return view.getPointAtRatio(ratio)!
}
