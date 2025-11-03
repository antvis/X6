import { describe, expect, it, vi } from 'vitest'
import { Export } from '../../src'
import { DataUri } from '../../src/common'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from '../utils/sleep'

describe('plugin/export', () => {
  it('graph api of export', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())

    graph.addNode({
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

    const instance = graph.getPlugin('export') as Export
    expect(instance).toBeInstanceOf(Export)

    await sleep(300)

    expect(await graph.toSVGAsync({ copyStyles: false })).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink" class="x6-graph-svg" viewBox="60 60 80 40"><defs/><g class="x6-graph-svg-viewport"><g class="x6-graph-svg-primer"/><g class="x6-graph-svg-stage"><g data-cell-id="n1" data-shape="rect" class="x6-cell x6-node" transform="translate(60,60)"><rect fill="#ffffff" stroke="#333333" stroke-width="2" width="80" height="40"/><text font-size="14" fill="#000000" text-anchor="middle" text-vertical-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,40,20)"/><g class="x6-port x6-port-r" transform="matrix(1,0,0,1,80,20)"><circle r="10" fill="#FFFFFF" stroke="#000000" port="p1" port-group="r" class="x6-port-body"/></g></g><!--z-index:2--></g><g class="x6-graph-svg-decorator"/><g class="x6-graph-svg-overlay"/></g></svg>',
    )
    cleanup()
  })

  it('toSVG 默认 copyStyles 为 true 应包含内联样式', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())

    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    // 等待异步渲染完成，确保导出包含节点内容
    await sleep(300)

    const svg = await graph.toSVGAsync()

    // 基本结构校验
    expect(svg).toContain('class="x6-graph-svg"')
    expect(svg).toContain('viewBox="60 60 80 40"')

    // 样式拷贝校验
    expect(svg).toMatch(
      /<g[^>]*class="x6-graph-svg-stage"[^>]*style="[^"]*user-select: none;[^"]*"/,
    )
    expect(svg).toMatch(
      /<g[^>]*class="x6-cell x6-node"[^>]*style="[^"]*cursor: move;[^"]*"/,
    )
    cleanup()
  })

  it('toSVG preserveDimensions:true 会输出数值尺寸', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const svg = await graph.toSVGAsync({ preserveDimensions: true })
    expect(svg).toMatch(/<svg[^>]*width="80"/)
    expect(svg).toMatch(/<svg[^>]*height="40"/)
    cleanup()
  })

  it('toSVG preserveDimensions:Size 覆写尺寸', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const svg = await graph.toSVGAsync({
      preserveDimensions: { width: 200, height: 50 },
    })
    expect(svg).toMatch(/<svg[^>]*width="200"/)
    expect(svg).toMatch(/<svg[^>]*height="50"/)
    cleanup()
  })

  it('toSVG 支持注入 stylesheet', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const svg = await graph.toSVGAsync({ stylesheet: '.x6-node{opacity:0.5;}' })
    expect(svg).toContain('<style type="text/css"')
    expect(svg).toContain('opacity:0.5')
    cleanup()
  })

  it('toSVG beforeSerialize 钩子可修改导出的 SVG', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const svg = await graph.toSVGAsync({
      beforeSerialize(svgEl) {
        svgEl.setAttribute('data-test', 'yes')
      },
    })
    expect(svg).toMatch(/<svg[^>]*data-test="yes"/)
    cleanup()
  })

  it('toSVG 支持覆写 viewBox', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const svg = await graph.toSVGAsync({
      viewBox: { x: 0, y: 0, width: 100, height: 50 },
    })
    expect(svg).toContain('viewBox="0 0 100 50"')
    cleanup()
  })

  it('exportSVG 会调用 DataUri.downloadDataUri', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const spy = vi
      .spyOn(DataUri, 'downloadDataUri')
      .mockImplementation(() => {})
    graph.exportSVG('custom-file')
    // 等待异步序列化完成
    await sleep(10)
    expect(spy).toHaveBeenCalledTimes(1)
    const [dataUrl, fileName] = spy.mock.calls[0]
    expect(typeof dataUrl).toBe('string')
    expect(fileName).toBe('custom-file')
    spy.mockRestore()
    cleanup()
  })

  it('触发 before:export / after:export 事件', async () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Export())
    graph.addNode({ id: 'n1', x: 60, y: 60, width: 80, height: 40 })

    const beforeSpy = vi.fn()
    const afterSpy = vi.fn()
    graph.on('before:export', beforeSpy)
    graph.on('after:export', afterSpy)

    await graph.toSVGAsync({ copyStyles: false })

    expect(beforeSpy).toHaveBeenCalledTimes(1)
    expect(afterSpy).toHaveBeenCalledTimes(1)
    expect(beforeSpy.mock.calls[0][0]).toMatchObject({
      copyStyles: false,
      serializeImages: true,
    })
    expect(afterSpy.mock.calls[0][0]).toMatchObject({
      copyStyles: false,
      serializeImages: true,
    })
    cleanup()
  })
})
