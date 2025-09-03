import type { EdgeAnchorDefinition } from './index'

export interface LengthEndpointOptions {
  length?: number
}

export const length: EdgeAnchorDefinition<LengthEndpointOptions> = (
  view,
  magnet,
  ref,
  options,
) => {
  const length = options.length != null ? options.length : 20
  return view.getPointAtLength(length)!
}
