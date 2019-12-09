import * as util from '../util'
import { View } from '../core/view'
import { Model } from '../core/model'
import { Renderer } from '../core/renderer'
import { detector, DomEvent } from '../common'
import { GraphOptions, getOptions } from '../option'
import { hook } from './decorator'
import { IHooks } from './hook'
import { Selection } from './selection'
import { BaseGraph } from './base-graph'
import { RetrievalAccessor } from './retrieval-accessor'
import { OverlayAccessor } from './overlay-accessor'
import { ConnectionAccessor } from './connection-accessor'
import { TooltipAccessor } from './tooltip-accessor'
import { RubberbandAccessor } from './rubberband-accessor'
import { CollapseAccessor } from './collapse-accessor'
import { KeyboardAccessor } from './keyboard-accessor'
import { GuideAccessor } from './guide-accessor'
import { GridAccessor } from './grid-accessor'
import { PageBreakAccessor } from './pagebreak-accessor'
import { PanningAccessor } from './panning-accessor'
import { SelectionAccessor } from './selection-accessor'
import { CreationAccessor } from './creation-accessor'
import { GroupAccessor } from './group-accessor'
import { ValidationAccessor } from './validation-accessor'
import { StyleAccessor } from './style-accessor'
import { EventLoopAccessor } from './eventloop-accessor'
import { ZoomAccessor } from './zoom-accessor'
import { ViewportAccessor } from './viewport-accessor'
import { SizeAccessor } from './size-accessor'
import { EditingAccessor } from './editing-accessor'
import { CommonAccessor } from './common-accessor'
import { MovingAccessor } from './moving-accessor'

export class Graph extends BaseGraph implements IHooks {
  constructor(container: HTMLElement, options: Graph.Options = {}) {
    super()

    this.options = getOptions(options)
    this.container = container
    this.model = options.model || this.createModel()
    this.view = this.createView()
    this.renderer = this.createRenderer()
    this.selection = this.createSelection()

    super.createManagers()
    super.createHandlers()

    if (container != null) {
      this.init(container)
    }

    this.view.revalidate()
  }

  protected init(container: HTMLElement) {
    this.view.init()
    this.sizeDidChange()

    if (detector.IS_IE) {
      DomEvent.addListener(container, 'selectstart', (e: MouseEvent) => {
        return (
          this.isEditing() ||
          (!this.eventloopManager.isMouseDown && !DomEvent.isShiftDown(e))
        )
      })
    }

    return this
  }

  @hook()
  createModel() {
    return new Model()
  }

  @hook()
  createView() {
    return new View(this)
  }

  @hook()
  createRenderer() {
    return new Renderer()
  }

  @hook()
  createSelection() {
    return new Selection(this)
  }
}

export namespace Graph {
  export interface Options extends GraphOptions {
    model?: Model
  }
}

export interface Graph
  extends CommonAccessor,
    SizeAccessor,
    ZoomAccessor,
    GridAccessor,
    GuideAccessor,
    GroupAccessor,
    StyleAccessor,
    MovingAccessor,
    PanningAccessor,
    EditingAccessor,
    OverlayAccessor,
    TooltipAccessor,
    CreationAccessor,
    CollapseAccessor,
    KeyboardAccessor,
    ViewportAccessor,
    EventLoopAccessor,
    PageBreakAccessor,
    SelectionAccessor,
    RetrievalAccessor,
    ConnectionAccessor,
    ValidationAccessor,
    RubberbandAccessor {}

util.applyMixins(
  Graph,
  CommonAccessor,
  SizeAccessor,
  ZoomAccessor,
  GridAccessor,
  GuideAccessor,
  GroupAccessor,
  StyleAccessor,
  MovingAccessor,
  PanningAccessor,
  EditingAccessor,
  OverlayAccessor,
  TooltipAccessor,
  CreationAccessor,
  CollapseAccessor,
  KeyboardAccessor,
  ViewportAccessor,
  EventLoopAccessor,
  PageBreakAccessor,
  SelectionAccessor,
  RetrievalAccessor,
  ConnectionAccessor,
  ValidationAccessor,
  RubberbandAccessor,
)
