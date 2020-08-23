import React, { useEffect, useState } from 'react'
import X6Editor from '@/x6Editor'
import {
  ReloadOutlined,
  SaveOutlined,
  PrinterOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import styles from './index.less'

interface HistoryStatus {
  canUndo: boolean,
  canRedo: boolean
}
enum CMD {
  CLEAR = 'clear',
  SAVE = 'save',
  PRINT = 'print',
  UNDO = 'undo',
  REDO = 'redo',
}

export default function() {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  useEffect(() => {
    const {canUndo, canRedo} = X6Editor.getInstance().getHistoryStatus()
    setCanUndo(canUndo)
    setCanRedo(canRedo)
    X6Editor.getInstance().on('history:change', (payload: HistoryStatus) => {
      setCanUndo(payload.canUndo)
      setCanRedo(payload.canRedo)
    })
  }, [])

  const toolList = [
    {
      id: 0,
      icon: <ReloadOutlined />,
      cmd: CMD.CLEAR,
      disabled: false,
    }, {
      id: 1,
      icon: <SaveOutlined />,
      cmd: CMD.SAVE,
      disabled: false,
    }, {
      id: 2,
      icon: <PrinterOutlined />,
      cmd: CMD.PRINT,
      disabled: false,
    },{
      id: 3,
      icon: <UndoOutlined />,
      cmd: CMD.UNDO,
      disabled: !canUndo,
    },{
      id: 4,
      icon: <RedoOutlined />,
      cmd: CMD.REDO,
      disabled: !canRedo,
    },
  ]

  const handleClick = (cmd: CMD, disabled: boolean) => {
    if (disabled) {
      return
    }
    switch(cmd) {
      case CMD.CLEAR:
        X6Editor.getInstance().clear()
        break
      case CMD.SAVE:
        X6Editor.getInstance().save()
        break
      case CMD.PRINT:
        X6Editor.getInstance().print()
        break
      case CMD.UNDO:
        X6Editor.getInstance().undo()
        break
      case CMD.REDO:
        X6Editor.getInstance().redo()
        break
      default:
        break
    }
  }

  return (
    <div className={styles.tools}>
      {toolList.map(tool => (
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