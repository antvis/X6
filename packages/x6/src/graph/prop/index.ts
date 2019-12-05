import { applyMixins } from '../../util'
import { GraphBase } from './base'
import { GraphGrid } from './grid'
import { GraphFolding } from './folding'
import { GuidBehaviour } from './guide'
import { GraphPageBreak } from './pagebreak'
import { TooltipBehaviour } from './tooltip'
import { PanningBehaviour } from './panning'
import { KeyboardBehaviour } from './keyboard'
import { ConnectionBehaviour } from './connection'
import { RubberbandBehaviour } from './rubberband'

export class GraphProp extends GraphBase {}

export interface GraphProp
  extends GraphGrid,
    GraphPageBreak,
    GraphFolding,
    GuidBehaviour,
    TooltipBehaviour,
    PanningBehaviour,
    KeyboardBehaviour,
    RubberbandBehaviour,
    ConnectionBehaviour {}

applyMixins(GraphProp, [
  GraphGrid,
  GraphPageBreak,
  GraphFolding,
  GuidBehaviour,
  TooltipBehaviour,
  PanningBehaviour,
  KeyboardBehaviour,
  RubberbandBehaviour,
  ConnectionBehaviour,
])
