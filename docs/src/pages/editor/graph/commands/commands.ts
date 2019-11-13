import { Graph, FontStyle, detector, DomEvent, Geometry } from '../../../../../../src'
import { UndoManager } from '../../../../../../src/addon/undomanager'
import { Clipboard } from '../../../../../../src/addon/clipboard'
import { GuideOptions } from '../../../../../../src/handler/guide/option'
import { Command } from './command'
import {
  autosize,
  wordWrap,
  formattedText,
  fitPage,
  fitTwoPages,
  fitPageWidth,
  toggleFontStyle,
} from './util'

export class Commands {
  public readonly graph: Graph
  public readonly undoManager: UndoManager
  public readonly ctrlKey = detector.IS_MAC ? 'Cmd' : 'Ctrl'
  public readonly commands: { [name: string]: Command } = {}

  get model() {
    return this.graph.model
  }

  get view() {
    return this.graph.view
  }

  constructor(graph: Graph) {
    this.graph = graph
    this.undoManager = UndoManager.create(graph)
    Commands.getCommandList().forEach((item) => { this.add(item) })
  }

  add(cmd: Command): Command
  add(options: Command.Options): Command
  add(cmd: Command | Command.Options): Command {
    const result = cmd instanceof Command
      ? cmd
      : new Command(cmd)

    if (result.shortcut) {
      let callback = (e: KeyboardEvent) => {
        e.preventDefault()
        result.handler(this.graph)
        return false
      }
      if (result.name === 'undo' || result.name === 'redo') {
        callback = (e: KeyboardEvent) => {
          e.preventDefault()
          result.handler(this.graph, this.undoManager)
          return false
        }
      }

      this.graph.keyboardHandler.bind(
        result.shortcut
          .replace('Delete', 'backspace')
          .replace('Cmd', 'command')
          .toLowerCase(),
        callback,
      )
    }

    this.commands[result.name] = result

    return result
  }

  get(name: string) {
    return this.commands[name]
  }
}

export namespace Commands {
  export const ctrlKey = detector.IS_MAC ? 'Cmd' : 'Ctrl'

  const deleteCells = (graph: Graph, includeEdges: boolean = true) => {
    graph.deleteCells(undefined, includeEdges)
  }

  const list: Command.Options[] = [
    // #region edit

    {
      name: 'undo',
      shortcut: `${ctrlKey}+Z`,
      handler: (graph: Graph, undoManager: UndoManager) => { undoManager.undo() },
    },
    {
      name: 'redo',
      handler: (graph: Graph, undoManager: UndoManager) => { undoManager.redo() },
      shortcut: `${ctrlKey}+Shift+Z`,
    },
    {
      name: 'copy',
      shortcut: `${ctrlKey}+C`,
      handler: (graph: Graph) => { Clipboard.copy(graph) },
    },
    {
      name: 'cut',
      shortcut: `${ctrlKey}+X`,
      handler: (graph: Graph) => { Clipboard.cut(graph) },
    },
    {
      name: 'paste',
      shortcut: `${ctrlKey}+V`,
      handler: (graph: Graph) => { Clipboard.paste(graph) },
    },
    {
      name: 'copySize',
      shortcut: 'Alt+Shit+X',
      handler: (graph: Graph) => { Clipboard.copySize(graph) },
    },
    {
      name: 'pasteSize',
      shortcut: 'Alt+Shit+V',
      handler: (graph: Graph) => { Clipboard.pasteSize(graph) },
    },
    {
      name: 'delete',
      shortcut: 'Delete',
      handler: (graph: Graph, e?: KeyboardEvent) => {
        deleteCells(graph, e != null ? DomEvent.isShiftDown(e) : true)
      },
    },
    {
      name: 'deleteAll',
      shortcut: `${ctrlKey}+Delete`,
      handler: (graph: Graph) => deleteCells(graph),
    },
    {
      name: 'duplicate',
      shortcut: `${ctrlKey}+D`,
      handler: (graph: Graph) => graph.duplicateCells(),
    },
    {
      name: 'edit',
      shortcut: 'F2/Enter',
      handler: (graph: Graph) => graph.isEnabled() && graph.startEditingAtCell(),
    },
    {
      name: 'turn',
      shortcut: `${ctrlKey}+R`,
      handler: (graph: Graph) => graph.turnCells(),
    },
    {
      name: 'selectNodes',
      shortcut: `${ctrlKey}+Shift+I`,
      handler: (graph: Graph) => graph.selectNodes(),
    },
    {
      name: 'selectEdges',
      shortcut: `${ctrlKey}+Shift+E`,
      handler: (graph: Graph) => graph.selectEdges(),
    },
    {
      name: 'selectAll',
      shortcut: `${ctrlKey}+A`,
      handler: (graph: Graph) => graph.selectAll(),
    },
    {
      name: 'selectNone',
      shortcut: `${ctrlKey}+Shift+A`,
      handler: (graph: Graph) => graph.clearSelection(),
    },
    {
      name: 'lockUnlock',
      shortcut: `${ctrlKey}+L`,
      handler: (graph: Graph) => graph.toggleCellsLocked(),
    },

    // #endregion

    // #region navigation

    {
      name: 'home',
      shortcut: 'Home',
      handler: (graph: Graph) => graph.home(),
    },
    {
      name: 'exitGroup',
      shortcut: `${ctrlKey}+Shift+Home`,
      handler: (graph: Graph) => graph.exitGroup(),
    },
    {
      name: 'enterGroup',
      shortcut: `${ctrlKey}+Shift+End`,
      handler: (graph: Graph) => graph.enterGroup(),
    },
    {
      name: 'collapse',
      shortcut: `${ctrlKey}+Home`,
      handler: (graph: Graph) => graph.foldCells(true),
    },
    {
      name: 'expand',
      shortcut: `${ctrlKey}+End`,
      handler: (graph: Graph) => graph.foldCells(false),
    },

    // #endregion

    // #region arrange

    {
      name: 'toFront',
      shortcut: `${ctrlKey}+Shift+F`,
      handler: (graph: Graph) => graph.orderCells(false),
    },
    {
      name: 'toBack',
      shortcut: `${ctrlKey}+Shift+B`,
      handler: (graph: Graph) => graph.orderCells(true),
    },
    {
      name: 'group',
      shortcut: `${ctrlKey}+G`,
      handler: (graph: Graph) => graph.selectCell(graph.groupCells()),
    },
    {
      name: 'ungroup',
      shortcut: `${ctrlKey}+Shift+U`,
      handler: (graph: Graph) => graph.selectCells(graph.ungroups()),
    },
    {
      name: 'removeFromGroup',
      handler: (graph: Graph) => graph.removeCellsFromParent(),
    },

    // #endregion

    {
      name: 'fillColor',
      handler: (graph: Graph, color: string) => graph.updateCellsStyle('fill', color),
    },
    {
      name: 'gradientColor',
      handler: (graph: Graph, color: string) => graph.updateCellsStyle('gradientColor', color),
    },
    {
      name: 'lineColor',
      handler: (graph: Graph, color: string) => graph.updateCellsStyle('stroke', color),
    },
    {
      name: 'shadow',
      handler: (graph: Graph, shadow: boolean = true) => graph.toggleCellsStyle('shadow', shadow)
    },
    {
      name: 'opacity',
      handler: (graph: Graph, opacity?: number) => graph.updateCellsStyle('opacity', opacity)
    },
    {
      name: 'strokeColor',
      handler: (graph: Graph, color?: string) => graph.updateCellsStyle('stroke', color)
    },
    {
      name: 'strokeWidth',
      handler: (graph: Graph, strokeWidth?: number) => graph.updateCellsStyle('strokeWidth', strokeWidth)
    },
    {
      name: 'strokeDashed',
      handler: (graph: Graph, dashed: boolean = true) => graph.toggleCellsStyle('dashed', dashed)
    },
    {
      name: 'autosize',
      shortcut: `${ctrlKey}+Shift+Y`,
      handler: (graph: Graph) => autosize(graph),
    },
    {
      name: 'wordWrap',
      handler: (graph: Graph) => wordWrap(graph),
    },
    {
      name: 'formattedText',
      handler: (graph: Graph) => formattedText(graph),
    },

    {
      name: 'updateGeometry',
      handler: (graph: Graph, geom: Geometry) => {
        graph.batchUpdate(() => {
          graph.getSelectedCells().forEach((cell) => {
            graph.model.setGeometry(cell, geom)
          })
        })
      }
    },

    {
      name: 'rotate',
      handler: (graph: Graph, rotate?: number) => graph.updateCellsStyle('rotation', rotate)
    },
    {
      name: 'flipH',
      handler: (graph: Graph, v: boolean = true) => graph.toggleCellsStyle('flipH', v)
    },
    {
      name: 'flipV',
      handler: (graph: Graph, v: boolean = true) => graph.toggleCellsStyle('flipV', v)
    },

    {
      name: 'fontFamily',
      handler: (graph: Graph, fontFamily?: string) => graph.updateCellsStyle('fontFamily', fontFamily)
    },
    {
      name: 'fontColor',
      handler: (graph: Graph, fontColor?: string) => graph.updateCellsStyle('fontColor', fontColor)
    },
    {
      name: 'fontSize',
      handler: (graph: Graph, fontSize?: number) => graph.updateCellsStyle('fontSize', fontSize)
    },
    {
      name: 'labelBorderColor',
      handler: (graph: Graph, color?: string) => graph.updateCellsStyle('labelBorderColor', color)
    },
    {
      name: 'labelBackgroundColor',
      handler: (graph: Graph, color?: string) => graph.updateCellsStyle('labelBackgroundColor', color)
    },
    {
      name: 'align',
      handler: (graph: Graph, align?: string) => graph.updateCellsStyle('align', align)
    },
    {
      name: 'valign',
      handler: (graph: Graph, valign?: string) => graph.updateCellsStyle('verticalAlign', valign)
    },
    {
      name: 'labelPosition',
      handler: (graph: Graph, position?: string) => {
        if (position != null) {
          const arr = position.split(' ')
          if (arr.length === 2) {
            graph.updateCellsStyle('labelPosition', arr[1])
            graph.updateCellsStyle('labelVerticalPosition', arr[0])
          } else if (arr.length === 1) {
            if (arr[0] === 'top' || arr[0] === 'bottom') {
              graph.updateCellsStyle('labelPosition')
              graph.updateCellsStyle('labelVerticalPosition', arr[0])
            } else {
              graph.updateCellsStyle('labelPosition', arr[0])
              graph.updateCellsStyle('labelVerticalPosition')
            }
          }
        } else {
          graph.updateCellsStyle('labelPosition', 'center')
          graph.updateCellsStyle('labelVerticalPosition')
        }
      }
    },

    // #region view

    {
      name: 'resetView',
      shortcut: `${ctrlKey}+H`,
      handler: (graph: Graph) => graph.zoomTo(1),
    },
    {
      name: 'zoomIn',
      shortcut: `${ctrlKey} + =`,
      handler: (graph: Graph) => {
        let scale = graph.view.scale
        if (scale >= 8) {
          scale += 8
        } else if (scale >= 4) {
          scale += 4
        } else if (scale >= 2) {
          scale += 1
        } else if (scale >= 1.5) {
          scale += 0.5
        } else if (scale >= 1) {
          scale += 0.25
        } else if (scale >= 0.7) {
          scale += 0.15
        } else if (scale >= 0.4) {
          scale += 0.1
        } else if (scale >= 0.15) {
          scale += 0.05
        } else if (scale >= 0.01) {
          scale += 0.01
        }
        graph.zoomTo(scale)
      }
    },
    {
      name: 'zoomOut',
      shortcut: `${ctrlKey} + -`,
      handler: (graph: Graph) => {
        let scale = graph.view.scale
        if (scale <= 0.15) {
          scale -= 0.01
        } else if (scale <= 0.4) {
          scale -= 0.05
        } else if (scale <= 0.7) {
          scale -= 0.1
        } else if (scale <= 1) {
          scale -= 0.15
        } else if (scale <= 1.5) {
          scale -= 0.25
        } else if (scale <= 2) {
          scale -= 0.5
        } else if (scale <= 4) {
          scale -= 1
        } else if (scale <= 8) {
          scale -= 4
        } else if (scale <= 16) {
          scale -= 8
        }
        graph.zoomTo(scale)
      },
    },
    {
      name: 'fitWindow',
      shortcut: `${ctrlKey}+Shift+H`,
      handler: (graph: Graph) => graph.fit(),
    },
    {
      name: 'fitPage',
      shortcut: `${ctrlKey}+J`,
      handler: (graph: Graph) => fitPage(graph),
    },
    {
      name: 'fitTwoPages',
      shortcut: `${ctrlKey}+Shift+J`,
      handler: (graph: Graph) => fitTwoPages(graph),
    },
    {
      name: 'fitPageWidth',
      handler: (graph: Graph) => fitPageWidth(graph),
    },
    {
      name: 'customZoom',
      handler: (graph: Graph, scale: number) => {
        if (!isNaN(scale) && scale > 0) {
          graph.zoomTo(scale)
        }
      },
    },
    {
      name: 'pageScale',
      handler: (graph: Graph, val: number) => {
        if (!isNaN(val) && val > 0) {
          graph.updatePageScale(val / 100)
        }
      },
    },

    // #endregion

    // #region options

    {
      name: 'grid',
      shortcut: `${ctrlKey}+Shift+G`,
      handler: (graph: Graph) => graph.toggleGrid(),
      isSwitch: true,
      isChecked: (graph: Graph) => graph.isGridEnabled(),
    },
    {
      name: 'guide',
      handler: (graph: Graph) => {
        const options = graph.options.guide as GuideOptions
        options.enabled = !options.enabled
      },
      isSwitch: true,
      isChecked: (graph: Graph) => {
        const options = graph.options.guide as GuideOptions
        return !!options.enabled
      },
    },

    // #endregion

    // #region font-style
    {
      name: 'bold',
      shortcut: `${ctrlKey}+B`,
      handler: (graph: Graph) => toggleFontStyle(graph, FontStyle.bold),
    },
    {
      name: 'italic',
      shortcut: `${ctrlKey}+I`,
      handler: (graph: Graph) => toggleFontStyle(graph, FontStyle.italic),
    },
    {
      name: 'underline',
      shortcut: `${ctrlKey}+U`,
      handler: (graph: Graph) => toggleFontStyle(graph, FontStyle.underlined),
    },

    // #endregion
  ]

  const map: { [name: string]: Command.Options } = {}
  list.forEach(item => (map[item.name] = item))

  export function getCommandList() {
    return list
  }

  export function getCommandMap() {
    return map
  }
}
