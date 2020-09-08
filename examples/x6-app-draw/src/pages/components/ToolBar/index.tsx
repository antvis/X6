import React, { useEffect, useState } from 'react'
import X6Editor from '@/x6Editor'
import { DataUri } from '@antv/x6'
import {
  ReloadOutlined,
  SaveOutlined,
  PrinterOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import styles from './index.less'

enum CMD {
  CLEAR,
  SAVE,
  PRINT,
  UNDO,
  REDO,
  ZOOMIN,
  ZOOMOUT,
}

export default function () {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const { history } = X6Editor.getInstance().graph
    setCanUndo(history.canUndo())
    setCanRedo(history.canRedo())
    history.on('change', () => {
      setCanUndo(history.canUndo())
      setCanRedo(history.canRedo())
    })
  }, [])

  const toolList = [
    {
      id: 0,
      icon: <ReloadOutlined />,
      cmd: CMD.CLEAR,
      disabled: false,
    },
    {
      id: 1,
      icon: <SaveOutlined />,
      cmd: CMD.SAVE,
      disabled: false,
    },
    {
      id: 2,
      icon: <PrinterOutlined />,
      cmd: CMD.PRINT,
      disabled: false,
    },
    {
      id: 3,
      icon: <UndoOutlined />,
      cmd: CMD.UNDO,
      disabled: !canUndo,
    },
    {
      id: 4,
      icon: <RedoOutlined />,
      cmd: CMD.REDO,
      disabled: !canRedo,
    },
    {
      id: 5,
      icon: <ZoomOutOutlined />,
      cmd: CMD.ZOOMOUT,
      disabled: zoom <= 0.25,
    },
    {
      id: 6,
      icon: <ZoomInOutlined />,
      cmd: CMD.ZOOMIN,
      disabled: zoom >= 3,
    },
  ]

  const handleClick = (cmd: CMD, disabled: boolean) => {
    if (disabled) {
      return
    }
    const { graph } = X6Editor.getInstance()
    switch (cmd) {
      case CMD.CLEAR:
        graph.model.resetCells([])
        break
      case CMD.SAVE:
        graph.toPNG((datauri: string) => {
          DataUri.downloadDataUri(datauri, 'chart.png')
        })
        break
      case CMD.PRINT:
        graph.printPreview()
        break
      case CMD.UNDO:
        graph.history.undo()
        break
      case CMD.REDO:
        graph.history.redo()
        break
      case CMD.ZOOMIN:
        graph.zoomTo(graph.zoom() + 0.25)
        setZoom(graph.zoom())
        break
      case CMD.ZOOMOUT:
        graph.zoomTo(graph.zoom() - 0.25)
        setZoom(graph.zoom())
        break
      default:
        break
    }
  }

  return (
    <div className={styles.tools}>
      {toolList.map((tool) => (
        <div
          key={tool.id}
          className={`${styles.item} ${tool.disabled ? styles.disabled : ''}`}
          onClick={() => handleClick(tool.cmd, tool.disabled)}
        >
          {tool.icon}
        </div>
      ))}
    </div>
  )
}
