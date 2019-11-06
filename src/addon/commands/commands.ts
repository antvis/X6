import { detector, DomEvent } from '../../common'
import { Graph } from '../../core'
import { UndoManager } from '../undomanager'
import { Clipboard } from '../clipboard'
import { Command } from './command'
import { GuideOptions } from '../../handler/guide/option'
import { FontStyle } from '../../struct'
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

    const { list } = Commands.getDefaults(graph)

    list.forEach((item) => {
      const options: Command.Options = {
        ...item,
        handler: () => item.handler(graph),
      }
      this.add(options)
    })
  }

  add(cmd: Command): Command
  add(options: Command.Options): Command
  add(cmd: Command | Command.Options): Command {
    if (cmd instanceof Command) {
      this.commands[cmd.name] = cmd
      return cmd
    }

    const result = new Command(cmd)
    this.commands[result.name]
    return result
  }

  get(name: string) {
    return this.commands[name]
  }
}

export namespace Commands {
  export const ctrlKey = detector.IS_MAC ? 'Cmd' : 'Ctrl'
  export function getDefaults(graph: Graph) {

    const deleteCells = (includeEdges: boolean = true) => {
      graph.deleteCells(undefined, includeEdges)
    }

    const undoManager = UndoManager.create(graph)
    const list: Command.Options[] = [
      // #region edit

      {
        name: 'undo',
        shortcut: `${ctrlKey}+Z`,
        handler: () => { undoManager.undo() },
      },
      {
        name: 'redo',
        handler: () => { undoManager.redo() },
        shortcut: detector.IS_WINDOWS
          ? `${ctrlKey}+Shift+Z`
          : `${ctrlKey}+Y`,
      },
      {
        name: 'copy',
        shortcut: `${ctrlKey}+C`,
        handler: () => { Clipboard.copy(graph) },
      },
      {
        name: 'cut',
        shortcut: `${ctrlKey}+X`,
        handler: () => { Clipboard.cut(graph) },
      },
      {
        name: 'paste',
        shortcut: `${ctrlKey}+V`,
        handler: () => { Clipboard.paste(graph) },
      },
      {
        name: 'copySize',
        shortcut: 'Alt+Shit+X',
        handler: () => { Clipboard.copySize(graph) },
      },
      {
        name: 'pasteSize',
        shortcut: 'Alt+Shit+V',
        handler: () => { Clipboard.pasteSize(graph) },
      },
      {
        name: 'delete',
        shortcut: 'Delete',
        handler: (e?: KeyboardEvent) => {
          deleteCells(e != null && DomEvent.isShiftDown(e))
        },
      },
      {
        name: 'deleteAll',
        shortcut: `${ctrlKey}+Delete`,
        handler: () => deleteCells(),
      },
      {
        name: 'duplicate',
        shortcut: `${ctrlKey}+D`,
        handler: () => graph.duplicateCells(),
      },
      {
        name: 'edit',
        shortcut: 'F2/Enter',
        handler: () => graph.isEnabled() && graph.startEditingAtCell(),
      },
      {
        name: 'turn',
        shortcut: `${ctrlKey}+R`,
        handler: () => graph.turnCells(),
      },
      {
        name: 'selectNodes',
        shortcut: `${ctrlKey}+Shift+I`,
        handler: () => graph.selectNodes(),
      },
      {
        name: 'selectEdges',
        shortcut: `${ctrlKey}+Shift+E`,
        handler: () => graph.selectEdges(),
      },
      {
        name: 'selectAll',
        shortcut: `${ctrlKey}+A`,
        handler: () => graph.selectAll(),
      },
      {
        name: 'selectNone',
        shortcut: `${ctrlKey}+Shift+A`,
        handler: () => graph.clearSelection(),
      },
      {
        name: 'lockUnlock',
        shortcut: `${ctrlKey}+L`,
        handler: () => graph.toggleCellsLocked(),
      },

      // #endregion

      // #region navigation

      {
        name: 'home',
        shortcut: 'Home',
        handler: () => graph.home(),
      },
      {
        name: 'exitGroup',
        shortcut: `${ctrlKey}+Shift+Home`,
        handler: () => graph.exitGroup(),
      },
      {
        name: 'enterGroup',
        shortcut: `${ctrlKey}+Shift+End`,
        handler: () => graph.enterGroup(),
      },
      {
        name: 'collapse',
        shortcut: `${ctrlKey}+Home`,
        handler: () => graph.foldCells(true),
      },
      {
        name: 'expand',
        shortcut: `${ctrlKey}+End`,
        handler: () => graph.foldCells(false),
      },

      // #endregion

      // #region arrange

      {
        name: 'toFront',
        shortcut: `${ctrlKey}+Shift+F`,
        handler: () => graph.orderCells(false),
      },
      {
        name: 'toBack',
        shortcut: `${ctrlKey}+Shift+B`,
        handler: () => graph.orderCells(true),
      },
      {
        name: 'group',
        shortcut: `${ctrlKey}+G`,
        handler: () => graph.selectCell(graph.groupCells()),
      },
      {
        name: 'ungroup',
        shortcut: `${ctrlKey}+Shift+U`,
        handler: () => graph.selectCells(graph.ungroups()),
      },
      {
        name: 'removeFromGroup',
        handler: () => graph.removeCellsFromParent(),
      },

      // #endregion

      {
        name: 'autosize',
        shortcut: `${ctrlKey}+Shift+Y`,
        handler: () => autosize(graph),
      },
      {
        name: 'wordWrap',
        handler: () => wordWrap(graph),
      },
      {
        name: 'formattedText',
        handler: () => formattedText(graph),
      },

      // #region view

      {
        name: 'resetView',
        shortcut: `${ctrlKey}+H`,
        handler: () => graph.zoomTo(1),
      },
      {
        name: 'zoomIn',
        shortcut: `${ctrlKey} + (Numpad) / Alt+Mousewheel`,
        handler: () => graph.zoomIn(),
      },
      {
        name: 'zoomOut',
        shortcut: `${ctrlKey} - (Numpad) / Alt+Mousewheel`,
        handler: () => graph.zoomOut(),
      },
      {
        name: 'fitWindow',
        shortcut: `${ctrlKey}+Shift+H`,
        handler: () => graph.fit(),
      },
      {
        name: 'fitPage',
        shortcut: `${ctrlKey}+J`,
        handler: () => fitPage(graph),
      },
      {
        name: 'fitTwoPages',
        shortcut: `${ctrlKey}+Shift+J`,
        handler: () => fitTwoPages(graph),
      },
      {
        name: 'fitPageWidth',
        handler: () => fitPageWidth(graph),
      },
      {
        name: 'customZoom',
        handler: (val: number) => {
          if (!isNaN(val) && val > 0) {
            graph.zoomTo(val / 100)
          }
        },
      },
      {
        name: 'pageScale',
        handler: (val: number) => {
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
        handler: () => graph.toggleGrid(),
        isSwitch: true,
        isChecked: (graph: Graph) => graph.isGridEnabled(),
      },
      {
        name: 'guide',
        handler: () => {
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
        handler: () => toggleFontStyle(graph, FontStyle.bold),
      },
      {
        name: 'italic',
        shortcut: `${ctrlKey}+I`,
        handler: () => toggleFontStyle(graph, FontStyle.italic),
      },
      {
        name: 'underline',
        shortcut: `${ctrlKey}+U`,
        handler: () => toggleFontStyle(graph, FontStyle.underlined),
      },

      // #endregion
    ]

    const map: { [name: string]: Command.Options } = {}
    list.forEach(cmd => (map[cmd.name] = cmd))

    return {
      map,
      list,
      undoManager,
    }
  }
}
