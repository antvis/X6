import React from 'react'
import { Graph, Node } from '@antv/x6-next'

export type ReactShapeConfig = Node.Properties & {
  shape: string
  effect?: (keyof Node.Properties)[]
  inherit?: string
}

export const shapeMaps: Record<
  string,
  {
    component: React.ComponentType
    effect?: (keyof Node.Properties)[]
  }
> = {}

export function register(
  componentOrFC: React.ComponentType,
  config: ReactShapeConfig,
) {
  const { shape, effect, inherit, ...others } = config
  if (!shape) {
    throw new Error('should specify shape in config')
  }
  shapeMaps[shape] = {
    component: componentOrFC,
    effect,
  }

  Graph.registerNode(
    shape,
    {
      inherit: inherit || 'react-shape',
      ...others,
    },
    true,
  )
}
