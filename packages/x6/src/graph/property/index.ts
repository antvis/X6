import { applyMixins } from '../../util'
import { GraphBase } from './base'
import { GraphGrid } from './grid'
import { GraphFolding } from './folding'
import { GraphPageBreak } from './pagebreak'

export class GraphProperty extends GraphBase {}

export interface GraphProperty
  extends GraphGrid,
    GraphPageBreak,
    GraphFolding {}

applyMixins(GraphProperty, [GraphGrid, GraphPageBreak, GraphFolding])
