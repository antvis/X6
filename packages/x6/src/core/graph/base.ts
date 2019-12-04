import { Model } from '../model'
import { View } from '../view'
import { Renderer } from '../renderer'
import { FullOptions } from '../../option'
import { IHooks } from './hook'
import { Disablable, Disposable } from '../../common'
import {
  CellEditor,
  TooltipHandler,
  CursorHandler,
  KeyboardHandler,
  ContextMenuHandler,
  PanningHandler,
  GuideHandler,
  SelectHandler,
  MovingHandler,
  SelectionHandler,
  ConnectionHandler,
  RubberbandHandler,
} from '../../handler'
import {
  ChangeManager,
  EventLoop,
  Selection,
  SelectionManager,
  ValidationManager,
  ViewportManager,
  CellManager,
} from '../../manager'

export class GraphBase extends Disablable {
  public options: GraphBase.Options
  public container: HTMLElement
  public model: Model
  public view: View
  public renderer: Renderer

  public cellEditor: CellEditor
  public changeManager: ChangeManager
  public eventloop: EventLoop
  public selection: Selection
  public selectionManager: SelectionManager
  public validator: ValidationManager
  public viewport: ViewportManager
  public cellManager: CellManager

  public keyboardHandler: KeyboardHandler
  public tooltipHandler: TooltipHandler
  public cursorHandler: CursorHandler
  public contextMenuHandler: ContextMenuHandler
  public guideHandler: GuideHandler
  public selectionHandler: SelectionHandler
  public connectionHandler: ConnectionHandler
  public panningHandler: PanningHandler
  public movingHandler: MovingHandler
  public selectHandler: SelectHandler
  public rubberbandHandler: RubberbandHandler
  panningManager: any

  getModel() {
    return this.model
  }

  getView() {
    return this.view
  }

  protected disposeManagers() {
    this.changeManager.dispose()
    this.eventloop.dispose()
    this.selection.dispose()
    this.selectionManager.dispose()
    this.validator.dispose()
    this.viewport.dispose()
    this.cellManager.dispose()
  }

  protected disposeHandlers() {
    this.tooltipHandler.dispose()
    this.panningHandler.dispose()
    this.contextMenuHandler.dispose()
    this.selectionHandler.dispose()
    this.movingHandler.dispose()
    this.connectionHandler.dispose()
  }

  @Disposable.aop()
  dispose() {
    this.disposeManagers()
    this.disposeHandlers()

    if (this.cellEditor != null) {
      this.cellEditor.dispose()
    }

    if (this.view != null) {
      this.view.dispose()
    }
  }
}

export namespace GraphBase {
  export interface Options extends Partial<IHooks>, FullOptions {}
}
