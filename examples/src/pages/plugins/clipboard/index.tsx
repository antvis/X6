import { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { Graph, Keyboard, Clipboard, Selection } from '@antv/x6'
import '../../index.less'

export const ClipboardExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<Selection | null>(null)
  const clipboardRef = useRef<Clipboard | null>(null)

  const onCopy = () => {
    const selection = selectionRef.current
    const clipboard = clipboardRef.current
    if (selection && clipboard) {
      const cells = selection.getSelectedCells()
      if (cells && cells.length) {
        clipboard.copy(cells)
      }
    }
  }

  const onPaste = () => {
    const clipboard = clipboardRef.current
    if (clipboard && !clipboard.isEmpty()) {
      clipboard.paste()
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
      grid: true,
    })
    const clipboard = new Clipboard()
    const selection = new Selection({
      rubberband: true,
      multiple: true,
      strict: true,
    })
    const keyboard = new Keyboard()

    graph.use(clipboard)
    graph.use(selection)
    graph.use(keyboard)

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    keyboard.bindKey('meta+c', (e) => {
      e.preventDefault()
      onCopy()
    })

    keyboard.bindKey('meta+v', (e) => {
      e.preventDefault()
      onPaste()
    })

    clipboard.on('clipboard:changed', ({ cells }) => {
      console.log(cells)
    })

    selectionRef.current = selection
    clipboardRef.current = clipboard
  }, [])

  return (
    <div className="x6-graph-wrap">
      <div className="x6-graph-tools">
        <Button onClick={onCopy} style={{ marginRight: 8 }}>
          Copy
        </Button>
        <Button onClick={onPaste}>Paste</Button>
      </div>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
