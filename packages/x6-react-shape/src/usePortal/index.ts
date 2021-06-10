import React, { useState, useCallback, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import type { Graph, Cell } from '@antv/x6'
import { NodeView } from '@antv/x6'
import type { ReactShape } from '../node'
import { Wrap } from '../wrap'

interface Payload {
  id: string
  portal: React.ReactPortal
}

const action: any = 'react'

export function createPortal(uniqViewId: string): {
  Portal: React.FC<Record<string, any>>
  setGraph: (graph: Graph) => void
} {
  const setGraphRef: { current: (graph: Graph) => void } = { current: () => {} }
  const setGraph = (graph: Graph) => {
    setGraphRef.current(graph)
  }

  let add: (payload: Payload) => void
  let remove: (id: string) => void

  function connect(id: string, portal: React.ReactPortal) {
    add({ id, portal })
  }

  function disconnect(id: string) {
    remove(id)
  }

  const Portal: React.FC<Record<string, any>> = () => {
    const [items, setItems] = useState<Payload[]>([])
    const [graph, setGraphInstance] = useState<Graph | undefined>()
    const pendingAddIdsRef = useRef<string[]>([])
    const pendingAddItemsRef = useRef<Payload[]>([])
    setGraphRef.current = setGraphInstance

    const addItem = useCallback((payload: Payload) => {
      const { id } = payload
      if (pendingAddIdsRef.current.includes(id)) {
        // if in pendingAddIds queue
        const itms = pendingAddItemsRef.current
        const matchIndex = itms.findIndex((item) => item.id === id)
        if (matchIndex > -1) {
          itms[matchIndex] = payload
        } else {
          itms.push(payload)
        }
        pendingAddItemsRef.current = itms
      } else {
        // if not in pendingAddIds queue
        setItems((prevItems) => {
          const nextItems = [...prevItems]
          const matchIndex = nextItems.findIndex((item) => item.id === id)
          if (matchIndex > -1) {
            nextItems[matchIndex] = payload
          } else {
            nextItems.push(payload)
          }
          return nextItems
        })
      }
    }, [])
    add = addItem

    const removeItem = useCallback((id: string) => {
      if (pendingAddIdsRef.current.includes(id)) {
        pendingAddIdsRef.current = pendingAddIdsRef.current.filter(
          (cId) => cId !== id,
        )
      }
      if (pendingAddItemsRef.current.map((c) => c.id).includes(id)) {
        pendingAddItemsRef.current = pendingAddItemsRef.current.filter(
          (c) => c.id !== id,
        )
      }
      setItems((itms) => itms.filter((item) => item.id !== id))
    }, [])
    remove = removeItem

    const startBatch = useCallback(
      (args: { name: string; data: { cells: Cell[] } }) => {
        const { name, data } = args
        const { cells = [] } = data || {}
        if (name === 'add') {
          const cellIds = cells
            .filter((cell) => cell.isNode())
            .map((cell) => cell.id)
          pendingAddIdsRef.current = Array.from(
            new Set([...pendingAddIdsRef.current, ...cellIds]),
          )
        }
      },
      [],
    )

    const stopBatch = useCallback(({ name }: { name: string }) => {
      if (name === 'add') {
        const pendingAdds: Payload[] = pendingAddItemsRef.current
        if (pendingAdds.length) {
          const currentPendingAddIds = pendingAdds.map(
            (pendingAddItem) => pendingAddItem.id,
          )
          pendingAddIdsRef.current = pendingAddIdsRef.current.filter(
            (id) => !currentPendingAddIds.includes(id),
          )
          pendingAddItemsRef.current = []
          setItems((prevItems) => {
            const nextItems = [...prevItems]
            pendingAdds.forEach((pendingAddItem) => {
              const matchIndex = nextItems.findIndex(
                (item) => item.id === pendingAddItem.id,
              )
              if (matchIndex > -1) {
                nextItems[matchIndex] = pendingAddItem
              } else {
                nextItems.push(pendingAddItem)
              }
            })
            return nextItems
          })
        }
      }
    }, [])

    useLayoutEffect(() => {
      if (graph) {
        graph.on('batch:start', startBatch)
        graph.on('batch:stop', stopBatch)
      }
      return () => {
        if (graph) {
          graph.off('batch:start', startBatch)
          graph.off('batch:stop', stopBatch)
          setItems([])
          pendingAddIdsRef.current = []
          pendingAddItemsRef.current = []
        }
      }
    }, [graph, startBatch, stopBatch])

    return React.createElement(
      React.Fragment,
      null,
      ...items.map((item) => item.portal),
    )
  }

  class ReactShapeView extends NodeView<ReactShape> {
    protected init() {
      super.init()
      this.cell.on('removed', () => {
        disconnect(this.cell.id)
      })
    }

    getComponentContainer() {
      return this.cell.prop('useForeignObject') === false
        ? (this.selectors.content as SVGElement)
        : (this.selectors.foContent as HTMLDivElement)
    }

    confirmUpdate(flag: number) {
      const ret = super.confirmUpdate(flag)
      return this.handleAction(ret, action, () => this.renderReactComponent())
    }

    protected renderReactComponent() {
      this.unmountReactComponent()
      const root = this.getComponentContainer()
      const node = this.cell
      const graph = this.graph

      if (root) {
        const component = this.graph.hook.getReactComponent(node)
        const elem = React.createElement(Wrap, { graph, node, component })
        connect(this.cell.id, ReactDOM.createPortal(elem, root))
      }
    }

    protected unmountReactComponent() {
      const root = this.getComponentContainer()
      if (root) {
        ReactDOM.unmountComponentAtNode(root)
      }
      return root
    }

    onMouseDown(e: any, x: number, y: number) {
      const target = e.target as Element
      const tagName = target.tagName.toLowerCase()
      if (tagName === 'input') {
        const type = target.getAttribute('type')
        if (
          type == null ||
          [
            'text',
            'password',
            'number',
            'email',
            'search',
            'tel',
            'url',
          ].includes(type)
        ) {
          return
        }
      }

      super.onMouseDown(e, x, y)
    }

    @NodeView.dispose()
    dispose() {
      disconnect(this.cell.id)
      this.unmountReactComponent()
    }
  }

  ReactShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register(uniqViewId, ReactShapeView, true)

  return { Portal, setGraph }
}

export function usePortal(
  uniqViewId: string,
): [React.FC<Record<string, any>>, (graph: Graph) => void] {
  const initializedRef = useRef<boolean>(false)
  const [PortalContainer] = useState<ReturnType<typeof createPortal>>(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      return createPortal(uniqViewId)
    }
    return {} as any // won't be used
  })
  return [PortalContainer.Portal, PortalContainer.setGraph]
}
