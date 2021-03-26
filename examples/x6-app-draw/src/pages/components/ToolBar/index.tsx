import React, { useEffect, useState } from 'react'
import { Toolbar } from '@antv/x6-react-components'
import FlowGraph from '../../Graph'
import { DataUri } from '@antv/x6'
import {
  ClearOutlined,
  SaveOutlined,
  PrinterOutlined,
  UndoOutlined,
  RedoOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'
import '@antv/x6-react-components/es/toolbar/style/index.css'

const Item = Toolbar.Item
const Group = Toolbar.Group

export default function () {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const copy = () => {
    const { graph } = FlowGraph
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  }

  const cut = () => {
    const { graph } = FlowGraph
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  }

  const paste = () => {
    const { graph } = FlowGraph
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  }

  useEffect(() => {
    const { graph } = FlowGraph
    const { history } = graph
    setCanUndo(history.canUndo())
    setCanRedo(history.canRedo())
    history.on('change', () => {
      setCanUndo(history.canUndo())
      setCanRedo(history.canRedo())
    })

    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (history.canUndo()) {
        history.undo()
      }
      return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+y'], () => {
      if (history.canRedo()) {
        history.redo()
      }
      return false
    })
    graph.bindKey(['meta+d', 'ctrl+d'], () => {
      graph.clearCells()
      return false
    })
    graph.bindKey(['meta+s', 'ctrl+s'], () => {
      graph.toPNG((datauri: string) => {
        DataUri.downloadDataUri(datauri, 'chart.png')
      })
      return false
    })
    graph.bindKey(['meta+p', 'ctrl+p'], () => {
      graph.printPreview()
      return false
    })
    graph.bindKey(['meta+c', 'ctrl+c'], copy)
    graph.bindKey(['meta+v', 'ctrl+v'], paste)
    graph.bindKey(['meta+x', 'ctrl+x'], cut)
  }, [])

  const handleClick = (name: string) => {
    const { graph } = FlowGraph
    switch (name) {
      case 'undo':
        graph.history.undo()
        break
      case 'redo':
        graph.history.redo()
        break
      case 'delete':
        graph.clearCells()
        break
      case 'save':
        graph.toPNG((datauri: string) => {
          DataUri.downloadDataUri(datauri, 'chart.png')
        })
        break
      case 'print':
        graph.printPreview()
        break
      case 'copy':
        copy()
        break
      case 'cut':
        cut()
        break
      case 'paste':
        paste()
        break
      default:
        break
    }
  }

  return (
    <div>
      <Toolbar hoverEffect={true} size="small" onClick={handleClick}>
        <Group>
          <Item
            name="delete"
            icon={<ClearOutlined />}
            tooltip="Clear (Cmd + D, Ctrl + D)"
          />
        </Group>
        <Group>
          <Item
            name="undo"
            tooltip="Undo (Cmd + Z, Ctrl + Z)"
            icon={<UndoOutlined />}
            disabled={!canUndo}
          />
          <Item
            name="redo"
            tooltip="Redo (Cmd + Shift + Z, Ctrl + Y)"
            icon={<RedoOutlined />}
            disabled={!canRedo}
          />
        </Group>
        <Group>
          <Item name="copy" tooltip="Copy (Cmd + C, Ctrl + C)" icon={<CopyOutlined />} />
          <Item name="cut" tooltip="Cut (Cmd + X, Ctrl + X)" icon={<ScissorOutlined />} />
          <Item
            name="paste"
            tooltip="Paste (Cmd + V, Ctrl + V)"
            icon={<SnippetsOutlined />}
          />
        </Group>
        <Group>
          <Item name="save" icon={<SaveOutlined />} tooltip="Save (Cmd + S, Ctrl + S)" />
          <Item
            name="print"
            icon={<PrinterOutlined />}
            tooltip="Print (Cmd + P, Ctrl + P)"
          />
        </Group>
      </Toolbar>
    </div>
  )
}
