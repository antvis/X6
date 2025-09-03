import type { EdgeAnchorDefinition } from './index'

export interface RatioEndpointOptions {
  ratio?: number
}

export const ratio: EdgeAnchorDefinition<RatioEndpointOptions> = (
  view,
  magnet,
  ref,
  options,
) => {
  let ratio = options.ratio != null ? options.ratio : 0.5
  if (ratio > 1) {
    ratio /= 100
  }
  return view.getPointAtRatio(ratio)!
}
