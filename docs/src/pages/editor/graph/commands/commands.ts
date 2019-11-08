import { Graph, FontStyle, detector, DomEvent } from '../../../../../../src'
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
      shortcut: detector.IS_WINDOWS
        ? `${ctrlKey}+Shift+Z`
        : `${ctrlKey}+Y`,
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
        deleteCells(graph, e != null && DomEvent.isShiftDown(e))
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

    // #region view

    {
      name: 'resetView',
      shortcut: `${ctrlKey}+H`,
      handler: (graph: Graph) => graph.zoomTo(1),
    },
    {
      name: 'zoomIn',
      shortcut: `${ctrlKey} + (Numpad) / Alt+Mousewheel`,
      handler: (graph: Graph) => graph.zoomIn(),
    },
    {
      name: 'zoomOut',
      shortcut: `${ctrlKey} - (Numpad) / Alt+Mousewheel`,
      handler: (graph: Graph) => graph.zoomOut(),
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
      handler: (graph: Graph, val: number) => {
        if (!isNaN(val) && val > 0) {
          graph.zoomTo(val / 100)
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
