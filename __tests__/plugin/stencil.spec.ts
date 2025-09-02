import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Graph, Shape, Stencil } from '../../src'
import { Dom } from '../../src/common/dom'
import { ClassNames } from '../../src/plugin/stencil'
import { grid } from '../../src/plugin/stencil/grid'
import { createDivElement } from '../utils/dom'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from '../utils/sleep'

describe('plugin/stencil', () => {
  it('default options', () => {
    const { graph, cleanup } = createTestGraph()

    graph.use(
      new Stencil({
        target: graph,
      }),
    )
    const stencil = graph.getPlugin('stencil') as Stencil

    expect(stencil.options).toMatchObject(Stencil.defaultOptions)
    expect(stencil.name).toBe('stencil')

    cleanup()
  })

  it('stencil load groups', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()

    const stencil = new Stencil({
      target: graph,
      collapsable: true,
      groups: [
        {
          name: 'group1',
        },
        {
          name: 'group2',
        },
      ],
    })

    const rect1 = graph.addNode({
      id: 'n1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const rect2 = graph.addNode({
      id: 'n2',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p2', group: 'r' }],
      },
    })

    stencil.load([rect1, rect2], 'group1')
    div.appendChild(stencil.container)

    await sleep(500)

    await expect(div).toMatchFileSnapshot('./__snapshots__/stencil-1.html')

    stencil.addClass('test-class')
    await expect(div).toMatchFileSnapshot('./__snapshots__/stencil-2.html')

    stencil.removeClass('test-class')
    await expect(div).toMatchFileSnapshot('./__snapshots__/stencil-1.html')

    stencil.unload([rect2], 'group1')

    await sleep(500)
    await expect(div).toMatchFileSnapshot('./__snapshots__/stencil-3.html')

    cleanup()
    destroy()
  })

  it('api of stencil', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()

    const stencil = new Stencil({
      target: graph,
      collapsable: true,
      groups: [
        {
          name: 'group1',
        },
        {
          name: 'group2',
        },
      ],
    })

    const rect1 = graph.addNode({
      id: 'n1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const rect2 = graph.addNode({
      id: 'n2',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p2', group: 'r' }],
      },
    })

    stencil.load([rect1, rect2], 'group1')
    div.appendChild(stencil.container)

    expect(stencil.isGroupCollapsable('group1')).toBe(true)

    expect(stencil.isGroupCollapsed('group1')).toBe(false)

    stencil.collapseGroup('group1')
    expect(stencil.isGroupCollapsed('group1')).toBe(true)

    stencil.expandGroup('group1')
    expect(stencil.isGroupCollapsed('group1')).toBe(false)

    stencil.collapseGroups()
    expect(stencil.isGroupCollapsed('group1')).toBe(true)
    expect(stencil.isGroupCollapsed('group2')).toBe(true)

    stencil.expandGroups()
    expect(stencil.isGroupCollapsed('group1')).toBe(false)
    expect(stencil.isGroupCollapsed('group2')).toBe(false)

    stencil.toggleGroup('group1')
    expect(stencil.isGroupCollapsed('group1')).toBe(true)

    stencil.toggleGroup('group1')
    expect(stencil.isGroupCollapsed('group1')).toBe(false)

    stencil.addGroup({ name: 'group3' })
    expect(stencil.options.groups?.length).toBe(3)
    expect(stencil.options.groups).toEqual(
      expect.arrayContaining([{ name: 'group3' }]),
    )

    stencil.addGroup([{ name: 'group4' }, { name: 'group5' }])
    expect(stencil.options.groups?.length).toBe(5)
    expect(stencil.options.groups).toEqual(
      expect.arrayContaining([{ name: 'group4' }, { name: 'group5' }]),
    )

    stencil.removeGroup('group3')
    expect(stencil.options.groups?.length).toBe(4)

    stencil.removeGroup(['group4', 'group5'])
    expect(stencil.options.groups?.length).toBe(2)

    cleanup()
    destroy()
  })

  it('stencil element events', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()

    const stencil = new Stencil({
      target: graph,
      collapsable: true,
      search(cell, keyword) {
        return cell.id.indexOf(keyword) !== -1
      },
      groups: [
        {
          name: 'group1',
        },
      ],
    })

    const rect1 = graph.addNode({
      id: 'n1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const rect2 = graph.addNode({
      id: 'n2',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p2', group: 'r' }],
      },
    })

    stencil.load([rect1, rect2], 'group1')
    div.appendChild(stencil.container)

    const titleEle = document.querySelector(
      `.${stencil.prefixClassName(ClassNames.title)}`,
    ) as HTMLElement
    const collapseSpy = vi.spyOn(stencil, 'collapseGroups')
    await sleep(500)
    titleEle?.click()
    expect(collapseSpy).toHaveBeenCalled()

    const expandSpy = vi.spyOn(stencil, 'expandGroups')
    await sleep(500)
    titleEle?.click()
    expect(expandSpy).toHaveBeenCalled()

    const groupTitleEle = document.querySelector(
      `.${stencil.prefixClassName(ClassNames.groupTitle)}`,
    ) as HTMLElement

    expect(Dom.hasClass(stencil.container, 'collapsed')).toBe(false)

    await sleep(200)
    groupTitleEle?.click()
    expect(Dom.hasClass(stencil.container, 'collapsed')).toBe(true)

    await sleep(200)
    groupTitleEle?.click()
    expect(Dom.hasClass(stencil.container, 'collapsed')).toBe(false)

    cleanup()
    destroy()
  })
})

describe('plugin/stencil/search', () => {
  it('when function filter', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()
    const layoutFn = vi.fn()

    const stencil = new Stencil({
      target: graph,
      collapsable: true,
      search(cell, keyword) {
        return cell.id.indexOf(keyword) !== -1
      },
      groups: [
        {
          name: 'group1',
        },
      ],
      layout: layoutFn,
    })

    const rect1 = graph.addNode({
      id: 'n1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const rect2 = graph.addNode({
      id: 'n2',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p2', group: 'r' }],
      },
    })

    stencil.load([rect1, rect2], 'group1')
    div.appendChild(stencil.container)

    const originNodes = layoutFn.mock.calls?.[0][0].getNodes()
    expect(originNodes.length).toBe(2)

    const searchTextEle = document.querySelector(
      `.${stencil.prefixClassName(ClassNames.searchText)}`,
    ) as HTMLInputElement
    searchTextEle.value = 'n1'
    searchTextEle?.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(1000)
    const filteredNodes = layoutFn.mock.lastCall?.[0].getNodes()
    expect(filteredNodes.length).toBe(1)
    expect(filteredNodes[0].id).toBe('n1')

    cleanup()
    destroy()
  })

  it('when shape filter', async () => {
    const { div, destroy } = createDivElement()
    const { graph, cleanup } = createTestGraph()
    const layoutFn = vi.fn()

    const stencil = new Stencil({
      target: graph,
      collapsable: true,
      search: { circle: true },
      groups: [
        {
          name: 'group1',
        },
      ],
      layout: layoutFn,
    })

    const rect1 = graph.addNode({
      id: 'n1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const circle1 = graph.addNode({
      shape: 'circle',
      id: 'c1',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p2', group: 'r' }],
      },
    })

    stencil.load([rect1, circle1], 'group1')
    div.appendChild(stencil.container)

    const originNodes = layoutFn.mock.calls?.[0][0].getNodes()
    expect(originNodes.length).toBe(2)

    const searchTextEle = document.querySelector(
      `.${stencil.prefixClassName(ClassNames.searchText)}`,
    ) as HTMLInputElement
    searchTextEle.value = 'any search text'
    searchTextEle?.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(1000)
    const filteredNodes = layoutFn.mock.lastCall?.[0].getNodes()
    expect(filteredNodes.length).toBe(1)
    expect(filteredNodes[0].id).toBe('c1')

    cleanup()
    destroy()
  })
})

describe('plugin/stencil/grid', () => {
  let div: HTMLDivElement
  let graph: Graph
  let destroy: () => void
  let cleanup: () => void

  beforeEach(() => {
    div = createDivElement().div
    destroy = createDivElement().destroy
    graph = createTestGraph().graph
    cleanup = createTestGraph().cleanup
  })

  afterEach(() => {
    destroy()
    cleanup()
  })

  const createLayoutFn = (
    lOptions?: any,
    sOptions?: Partial<Stencil.Options>,
  ) => {
    const layoutFn = vi.fn()

    const stencil = new Stencil({
      target: graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: 'group1',
        },
        {
          name: 'group2',
        },
      ],
      layout(model, group) {
        layoutFn(model, group)
        const options = {
          columnWidth: (this.options.stencilGraphWidth as number) / 2 - 10,
          columns: 2,
          rowHeight: 80,
          resizeToFit: false,
          dx: 10,
          dy: 10,
        }

        grid(model, {
          ...options,
          ...this.options.layoutOptions,
          ...(group ? group.layoutOptions : {}),
          ...lOptions,
        })
      },
      ...sOptions,
    })

    div.appendChild(stencil.container)

    const r = new Shape.Rect({
      position: { x: 10, y: 10 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c = new Shape.Circle({
      position: { x: 100, y: 10 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#FE854F', 'stroke-width': 8, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const c2 = new Shape.Circle({
      position: { x: 10, y: 70 },
      size: { width: 70, height: 40 },
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 8, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const r2 = new Shape.Rect({
      position: { x: 100, y: 70 },
      size: { width: 70, height: 40 },
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', 'stroke-width': 8 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    stencil.load([r, c, c2, r2.clone()], 'group1')

    return layoutFn
  }

  it('when columnWidth option is unset', async () => {
    const layoutSpy = createLayoutFn()
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[1].position()).toEqual({ x: 110, y: 30 })
  })

  it('when columnWidth option is compact', async () => {
    const layoutSpy = createLayoutFn({ columnWidth: 'compact' })
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[1].position()).toEqual({ x: 95, y: 30 })
  })

  it('when columnWidth option is auto', async () => {
    const layoutSpy = createLayoutFn({ columnWidth: 'auto' })
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[1].position()).toEqual({ x: 95, y: 30 })
  })

  it('when rowHeight option is unset', async () => {
    const layoutSpy = createLayoutFn()
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[2].position()).toEqual({ x: 20, y: 110 })
  })

  it('when rowHeight option is compact', async () => {
    const layoutSpy = createLayoutFn({ rowHeight: 'compact' })
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[2].position()).toEqual({ x: 20, y: 65 })
  })

  it('when rowHeight option is auto', async () => {
    const layoutSpy = createLayoutFn({ rowHeight: 'auto' })
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[2].position()).toEqual({ x: 20, y: 65 })
  })

  it('when resizeToFit option is unset', async () => {
    const layoutSpy = createLayoutFn({}, { stencilGraphWidth: 300 })
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes[1].size()).toEqual({ width: 70, height: 40 })
  })

  it('when resizeToFit option is true', async () => {
    const layoutSpy = createLayoutFn(
      { resizeToFit: true },
      { stencilGraphWidth: 300 },
    )
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes[1].size()).toEqual({
      width: 120,
      height: 68.57142857142857,
    })
  })

  it('when resizeToFit option is false', async () => {
    const layoutSpy = createLayoutFn({}, { stencilGraphWidth: 300 })
    const modelNodes = layoutSpy.mock.calls[0][0].getNodes()

    expect(modelNodes[1].size()).toEqual({ width: 70, height: 40 })
  })
})
