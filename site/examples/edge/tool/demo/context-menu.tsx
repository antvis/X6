import { Edge, Graph, Shape } from '@antv/x6'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'

// 如果项目中使用的是 antd@4，使用方式参考：https://codesandbox.io/s/contextmenu-z8gpq3

// 2.x的使用可以参考2.x文档： https://x6-v2.antv.vision/examples/edge/tool/#context-menu


Shape.Rect.config({
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      in: { position: { name: 'top' } },
      out: { position: { name: 'bottom' } },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
      attrs: {
        r: 5,
        magnet: true,
        stroke: '#31d0c6',
        fill: '#fff',
        strokeWidth: 2,
      },
    },
  ],
})

const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 3,
    attrs: {
      strokeWidth: 3,
      stroke: '#52c41a',
    },
  },
}

// 工具函数：检查点击是否在 dropdown 内
const isClickInDropdown = (target: HTMLElement): boolean => {
  const checkElement = (el: HTMLElement | null): boolean => {
    if (!el || el === document.body) return false

    const className = el.className?.toString() || ''

    if (
      className.includes('ant-dropdown') ||
      className.includes('ant-dropdown-menu')
    ) {
      return true
    }

    return checkElement(el.parentElement)
  }

  return checkElement(target)
}

// 右键菜单组件
interface ContextMenuProps {
  x: number
  y: number
  cell: Edge
  onClose: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, cell, onClose }) => {
  const [visible, setVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // 关闭菜单
  const handleClose = useCallback(() => {
    setVisible(false)
    // 异步调用 onClose，避免同步 unmount
    Promise.resolve().then(onClose)
  }, [onClose])

  // 处理菜单项点击
  const handleMenuClick: MenuProps['onClick'] = useCallback(({ key }) => {
    const actions: Record<string, () => void> = {
      'color-blue': () => cell.setAttrs({ line: { stroke: '#1890ff' } }),
      'color-green': () => cell.setAttrs({ line: { stroke: '#52c41a' } }),
      'color-red': () => cell.setAttrs({ line: { stroke: '#ff4d4f' } }),
      'style-solid': () => cell.setAttrs({ line: { strokeDasharray: '' } }),
      'style-dashed': () => cell.setAttrs({ line: { strokeDasharray: '5 5' } }),
      'delete': () => cell.remove(),
    }

    actions[key]?.()
    handleClose()
  }, [cell, handleClose])

  // 监听外部点击
  useEffect(() => {
    if (!visible) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInContainer = containerRef.current?.contains(target)
      const isInDropdown = isClickInDropdown(target)

      if (!isInContainer && !isInDropdown) {
        handleClose()
      }
    }

    // 延迟添加监听器，避免立即触发
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true)
    }, 200)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [visible, handleClose])

  // 菜单配置
  const menuItems: MenuProps['items'] = [
    {
      key: 'changeColor',
      label: '修改颜色',
      children: [
        { key: 'color-blue', label: '蓝色' },
        { key: 'color-green', label: '绿色' },
        { key: 'color-red', label: '红色' },
      ],
    },
    {
      key: 'changeStyle',
      label: '修改样式',
      children: [
        { key: 'style-solid', label: '实线' },
        { key: 'style-dashed', label: '虚线' },
      ],
    },
    { type: 'divider' },
    { key: 'delete', label: '删除', danger: true },
  ]

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 9999,
      }}
    >
      <Dropdown
        open={visible}
        onOpenChange={(open) => !open && handleClose()}
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={[]}
        getPopupContainer={() => document.body}
      >
        <span style={{ display: 'inline-block', width: 0, height: 0 }} />
      </Dropdown>
    </div>
  )
}

// Graph 配置
const graph = new Graph({
  container: document.getElementById('container')!,
  grid: true,
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    allowNode: false,
    highlight: true,
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group') !== 'in'
    },
    validateConnection({ sourceMagnet, targetMagnet }) {
      if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
        return false
      }
      if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }
      return true
    },
  },
})

// 添加节点和边
const source = graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  ports: [{ id: 'out-2', group: 'out' }],
})

const target = graph.addNode({
  x: 140,
  y: 240,
  width: 100,
  height: 40,
  ports: [{ id: 'in-1', group: 'in' }],
})

graph.addEdge({
  source: { cell: source.id, port: 'out-2' },
  target: { cell: target.id, port: 'in-1' },
})

// 菜单管理器
class MenuManager {
  private root: Root | null = null
  private container: HTMLDivElement | null = null
  private isCleaningUp = false

  cleanup = () => {
    if (this.isCleaningUp) return
    this.isCleaningUp = true

    requestAnimationFrame(() => {
      try {
        this.root?.unmount()
        this.container?.parentNode?.removeChild(this.container)
      } catch (error) {
        console.error('Error cleaning up menu:', error)
      } finally {
        this.root = null
        this.container = null
        this.isCleaningUp = false
      }
    })
  }

  show = (x: number, y: number, cell: Edge) => {
    this.cleanup()

    requestAnimationFrame(() => {
      this.container = document.createElement('div')
      document.body.appendChild(this.container)

      this.root = createRoot(this.container)
      this.root.render(
        <ContextMenu x={x} y={y} cell={cell} onClose={this.cleanup} />
      )
    })
  }
}

const menuManager = new MenuManager()

// 监听边的右键菜单事件
graph.on('edge:contextmenu', ({ cell, e }: { cell: Edge; e: MouseEvent }) => {
  e.preventDefault()
  e.stopPropagation()
  menuManager.show(e.clientX, e.clientY, cell)
})
