import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Graph, Shape, Stencil } from '../../src'
import { ClassNames } from '../../src/plugin/stencil'
import { createTestGraph } from '../utils/graph-helpers'
import { createDivElement } from '../utils/dom'
import { sleep } from '../utils/sleep'
import sinon from 'sinon'
import { Dom } from '../../src/common/dom'
import { grid } from '../../src/plugin/stencil/grid'

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
        items: [{ id: 'p1', group: 'r' }],
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

    vi.mock('../../src/common/dom.ts')
    const spy = vi.spyOn(Dom, 'toggleClass')
    await sleep(500)
    groupTitleEle?.click()
    expect(spy).toHaveBeenCalled()
    vi.unmock('../../src/common/dom.ts')

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

  const createLayoutSpy = (lOptions?: any) => {
    const layoutSpy = sinon.spy()

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
        layoutSpy(model, group)
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

    return layoutSpy
  }

  it('when columnWidth option is compact', async () => {
    const layoutSpy = createLayoutSpy({ columnWidth: 'compact' })
    const modelNodes = layoutSpy.args[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[1].position()).toEqual({ x: 95, y: 30 })
  })

  it('when columnWidth option is unset', async () => {
    const layoutSpy = createLayoutSpy()
    const modelNodes = layoutSpy.args[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[1].position()).toEqual({ x: 110, y: 30 })
  })

  it('when columnWidth option is auto', async () => {
    const layoutSpy = createLayoutSpy({ columnWidth: 'auto' })
    const modelNodes = layoutSpy.args[0][0].getNodes()

    expect(modelNodes.length).toBe(4)
    expect(modelNodes[1].position()).toEqual({ x: 95, y: 30 })
  })
})
