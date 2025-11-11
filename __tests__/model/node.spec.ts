import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Cell, Graph, Node } from '../../src'
import { Edge } from '../../src/model/edge'
import type { PortManager } from '../../src/model/port'
import { sleep } from '../utils/sleep'

describe('Model', () => {
  describe('Node', () => {
    let node: Node

    beforeEach(() => {
      node = new Node()
    })

    afterEach(() => {
      node.remove()
    })

    it('should be an instance of Node', () => {
      expect(node).toBeInstanceOf(Node)
    })

    it('should be a Cell', () => {
      expect(node).toBeInstanceOf(Cell)
    })

    describe('size()', () => {
      it('should get the size of the node', () => {
        expect(node.size()).toEqual({ width: 1, height: 1 })
        node.size(100, 50)
        expect(node.size()).toEqual({ width: 100, height: 50 })
      })

      it('should set the size of the node', () => {
        node.size(100, 50)
        expect(node.getSize()).toEqual({ width: 100, height: 50 })

        node.size({ width: 200, height: 100 })
        expect(node.getSize()).toEqual({ width: 200, height: 100 })
      })

      it('should trigger resize event', () => {
        const spy = vi.fn()
        node.on('change:size', spy)
        node.resize(100, 50)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    describe('position()', () => {
      it('should get the position of the node', () => {
        expect(node.position()).toEqual({ x: 0, y: 0 })
        node.position(100, 50)
        expect(node.position()).toEqual({ x: 100, y: 50 })
      })

      it('should set the position of the node', () => {
        node.position(100, 50)
        expect(node.getPosition()).toEqual({ x: 100, y: 50 })

        node.position({ x: 200, y: 100 })
        expect(node.getPosition()).toEqual({ x: 100, y: 50 })
      })

      it('should trigger position event', () => {
        const spy = vi.fn()
        node.on('change:position', spy)
        node.setPosition(100, 50)
        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should set position relative to parent', () => {
        const graph = new Graph({ container: document.body })
        const parent = new Node({ id: 'parent', position: { x: 100, y: 100 } })
        const child = new Node({ id: 'child', position: { x: 10, y: 10 } })
        graph.addNode(parent)
        graph.addNode(child)
        parent.embed(child)

        child.position(20, 20, { relative: true })
        expect(child.position()).toEqual({ x: 120, y: 120 })

        child.position({ x: 30, y: 30 }, { relative: true })
        expect(child.position()).toEqual({ x: 120, y: 120 })

        child.position(30, 30)
        expect(child.position()).toEqual({ x: 30, y: 30 })

        child.position({ relative: true })
        expect(child.position()).toEqual({ x: 30, y: 30 })

        parent.remove()
        child.remove()
        graph.dispose()
      })
    })

    describe('angle()', () => {
      it('should get the angle of the node', () => {
        expect(node.angle()).toBe(0)
        node.angle(45)
        expect(node.angle()).toBe(45)
      })

      it('should set the angle of the node', () => {
        node.angle(90)
        expect(node.getAngle()).toBe(90)
      })

      it('should trigger angle event', () => {
        const spy = vi.fn()
        node.on('change:angle', spy)
        node.rotate(45)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    describe('getBBox()', () => {
      it('should return the bounding box of the node', () => {
        node.position(10, 20)
        node.resize(30, 40)
        const bbox = node.getBBox()
        expect(bbox.x).toBe(10)
        expect(bbox.y).toBe(20)
        expect(bbox.width).toBe(30)
        expect(bbox.height).toBe(40)
      })

      it('should return the deep bounding box of the node', () => {
        const graph = new Graph({ container: document.body })
        const child = new Node({
          position: { x: 10, y: 10 },
          size: { width: 20, height: 20 },
        })
        node.embed(child)
        graph.addNode(node)
        node.position(5, 5)
        node.resize(50, 50)

        const bbox = node.getBBox({ deep: true })
        expect(bbox.x).toBe(5)
        expect(bbox.y).toBe(5)
        expect(bbox.width).toBe(50)
        expect(bbox.height).toBe(50)

        child.remove()
        node.remove()
        graph.dispose()
      })
    })

    describe('translate()', () => {
      it('should translate the node', () => {
        node.position(10, 20)
        node.translate(30, 40)
        expect(node.position()).toEqual({ x: 40, y: 60 })
      })

      it('should trigger translate event', () => {
        const spy = vi.fn()
        node.on('change:position', spy)
        node.translate(30, 40)
        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should translate the node with restrict', () => {
        node.position(10, 20)
        node.translate(30, 40, {
          restrict: { x: 0, y: 0, width: 100, height: 100 },
        })
        expect(node.position()).toEqual({ x: 40, y: 60 })

        node.position(90, 90)
        node.translate(30, 40, {
          restrict: { x: 0, y: 0, width: 100, height: 100 },
        })
        expect(node.position()).toEqual({ x: 99, y: 99 })
      })

      it('should translate the node with transition', async () => {
        const mockTimeline = {
          get currentTime() {
            return performance.now()
          },
        }
        Object.defineProperty(document, 'timeline', {
          writable: false,
          configurable: true,
          value: mockTimeline,
        })

        node.position(10, 20)
        node.translate(30, 40, { transition: true })
        await sleep(200)
        expect(node.position()).toEqual({ x: 40, y: 60 })
      })
    })

    describe('rotate()', () => {
      it('should rotate the node', () => {
        node.rotate(45)
        expect(node.angle()).toBe(45)
      })

      it('should rotate the node with absolute', () => {
        node.rotate(45)
        node.rotate(45, { absolute: true })
        expect(node.angle()).toBe(45)
      })
    })

    describe('ports', () => {
      it('should add a port', () => {
        const port: PortManager.PortMetadata = { id: 'port1' }
        node.addPort(port)
        expect(node.getPorts().length).toBe(1)
        expect(node.getPort('port1')).toEqual(port)
      })

      it('should add multiple ports', () => {
        const ports: PortManager.PortMetadata[] = [
          { id: 'port1' },
          { id: 'port2' },
        ]
        node.addPorts(ports)
        expect(node.getPorts().length).toBe(2)
        expect(node.getPort('port1')).toEqual(ports[0])
        expect(node.getPort('port2')).toEqual(ports[1])
      })

      it('should insert a port at a specific index', () => {
        const port1: PortManager.PortMetadata = { id: 'port1' }
        const port2: PortManager.PortMetadata = { id: 'port2' }
        node.addPort(port1)
        node.insertPort(0, port2)
        expect(node.getPorts().length).toBe(2)
        expect(node.getPortAt(0)).toEqual(port2)
        expect(node.getPortAt(1)).toEqual(port1)
      })

      it('should remove a port', () => {
        const port: PortManager.PortMetadata = { id: 'port1' }
        node.addPort(port)
        node.removePort(port)
        expect(node.getPorts().length).toBe(0)
        expect(node.getPort('port1')).toBeUndefined()
      })

      it('should remove a port by id', () => {
        const port: PortManager.PortMetadata = { id: 'port1' }
        node.addPort(port)
        node.removePort('port1')
        expect(node.getPorts().length).toBe(0)
        expect(node.getPort('port1')).toBeUndefined()
      })

      it('should remove a port at a specific index', () => {
        const port1: PortManager.PortMetadata = { id: 'port1' }
        const port2: PortManager.PortMetadata = { id: 'port2' }
        node.addPort(port1)
        node.addPort(port2)
        node.removePortAt(0)
        expect(node.getPorts().length).toBe(1)
        expect(node.getPort('port1')).toBeUndefined()
        expect(node.getPort('port2')).toEqual(port2)
      })

      it('should remove all ports', () => {
        const port1: PortManager.PortMetadata = { id: 'port1' }
        const port2: PortManager.PortMetadata = { id: 'port2' }
        node.addPort(port1)
        node.addPort(port2)
        node.removePorts()
        expect(node.getPorts().length).toBe(0)
      })

      it('should remove specified ports', () => {
        const port1: PortManager.PortMetadata = { id: 'port1' }
        const port2: PortManager.PortMetadata = { id: 'port2' }
        const port3: PortManager.PortMetadata = { id: 'port3' }
        node.addPort(port1)
        node.addPort(port2)
        node.addPort(port3)
        node.removePorts([port1, 'port3'])
        expect(node.getPorts().length).toBe(1)
        expect(node.getPort('port2')).toEqual(port2)
      })

      it('should get a port by id', () => {
        const port: PortManager.PortMetadata = { id: 'port1', group: 'a' }
        node.addPort(port)
        expect(node.getPort('port1')).toEqual(port)
      })

      it('should get a port at a specific index', () => {
        const port1: PortManager.PortMetadata = { id: 'port1' }
        const port2: PortManager.PortMetadata = { id: 'port2' }
        node.addPort(port1)
        node.addPort(port2)
        expect(node.getPortAt(1)).toEqual(port2)
      })

      it('should check if a node has ports', () => {
        expect(node.hasPorts()).toBe(false)
        node.addPort({ id: 'port1' })
        expect(node.hasPorts()).toBe(true)
      })

      it('should check if a node has a specific port', () => {
        node.addPort({ id: 'port1' })
        expect(node.hasPort('port1')).toBe(true)
        expect(node.hasPort('port2')).toBe(false)
      })

      it('should get the index of a port', () => {
        const port1: PortManager.PortMetadata = { id: 'port1' }
        const port2: PortManager.PortMetadata = { id: 'port2' }
        node.addPort(port1)
        node.addPort(port2)
        expect(node.getPortIndex('port1')).toBe(0)
        expect(node.getPortIndex(port2)).toBe(1)
        expect(node.getPortIndex('port3')).toBe(-1)
      })

      it('should get ports by group', () => {
        node.addPort({ id: 'port1', group: 'a' })
        node.addPort({ id: 'port2', group: 'b' })
        node.addPort({ id: 'port3', group: 'a' })

        const portsInGroupA = node.getPortsByGroup('a')
        expect(portsInGroupA.length).toBe(2)
        expect(portsInGroupA[0].id).toBe('port1')
        expect(portsInGroupA[1].id).toBe('port3')

        const portsInGroupB = node.getPortsByGroup('b')
        expect(portsInGroupB.length).toBe(1)
        expect(portsInGroupB[0].id).toBe('port2')

        const portsInGroupC = node.getPortsByGroup('c')
        expect(portsInGroupC.length).toBe(0)
      })

      it('should get and set port properties', () => {
        node.addPort({ id: 'port1', attrs: { label: { text: 'initial' } } })

        expect(node.portProp('port1', 'attrs/label/text')).toBe('initial')

        node.portProp('port1', 'attrs/label/text', 'updated')
        expect(node.portProp('port1', 'attrs/label/text')).toBe('updated')

        node.portProp('port1', { attrs: { label: { fontWeight: 'bold' } } })
        expect(node.portProp('port1', 'attrs/label/fontWeight')).toBe('bold')

        node.portProp('port1', 'attrs/label/fontWeight', null)
        expect(node.portProp('port1', 'attrs/label/fontWeight')).toBeUndefined()

        node.portProp('port1', 'attrs/label', null)
        expect(node.portProp('port1', 'attrs/label')).toBeUndefined()
      })

      it('should throw an error when trying to access a non-existent port', () => {
        expect(() =>
          node.portProp('nonExistentPort', 'attrs/label/text'),
        ).toThrowError('Unable to find port with id: "nonExistentPort"')
      })

      it('should set port properties using setPortProp', () => {
        node.addPort({ id: 'port1', attrs: { label: { text: 'initial' } } })

        node.setPortProp('port1', 'attrs/label/text', 'updated')
        expect(node.getPortProp('port1', 'attrs/label/text')).toBe('updated')

        node.setPortProp('port1', { attrs: { label: { fontWeight: 'bold' } } })
        expect(node.getPortProp('port1', 'attrs/label/fontWeight')).toBe('bold')
      })

      it('should remove port properties using removePortProp', () => {
        node.addPort({
          id: 'port1',
          attrs: { label: { text: 'initial', fontWeight: 'bold' } },
        })

        node.removePortProp('port1', 'attrs/label/fontWeight')
        expect(
          node.getPortProp('port1', 'attrs/label/fontWeight'),
        ).toBeUndefined()

        node.removePortProp('port1', 'attrs/label')
        expect(node.getPortProp('port1', 'attrs/label')).toBeUndefined()
      })
    })

    describe('port markup', () => {
      it('should set and get port container markup', () => {
        const markup = '<g><rect/></g>'
        node.setPortContainerMarkup(markup)
        expect(node.getPortContainerMarkup()).toEqual(markup)
      })

      it('should set and get port markup', () => {
        const markup = '<g><circle/></g>'
        node.setPortMarkup(markup)
        expect(node.getPortMarkup()).toEqual(markup)
      })

      it('should set and get port label markup', () => {
        const markup = '<text>label</text>'
        node.setPortLabelMarkup(markup)
        expect(node.getPortLabelMarkup()).toEqual(markup)
      })

      it('should get default port container markup', () => {
        const markup = node.getDefaultPortContainerMarkup()
        expect(markup).toBeDefined()
      })

      it('should get default port markup', () => {
        const markup = node.getDefaultPortMarkup()
        expect(markup).toBeDefined()
      })

      it('should get default port label markup', () => {
        const markup = node.getDefaultPortLabelMarkup()
        expect(markup).toBeDefined()
      })
    })

    describe('fit()', () => {
      it('should fit the node to its embeds', () => {
        const graph = new Graph({ container: document.body })
        const child = new Node({
          position: { x: 10, y: 10 },
          size: { width: 20, height: 20 },
        })
        node.embed(child)
        graph.addNode(node)
        node.fit()

        expect(node.position()).toEqual({ x: 0, y: 0 })
        expect(node.size()).toEqual({ width: 1, height: 1 })

        child.remove()
        node.remove()
        graph.dispose()
      })

      it('should fit the node to its embeds with padding', () => {
        const graph = new Graph({ container: document.body })
        const child = new Node({
          position: { x: 10, y: 10 },
          size: { width: 20, height: 20 },
        })
        node.embed(child)
        graph.addNode(node)
        node.fit({ padding: 10 })

        expect(node.position()).toEqual({ x: 0, y: 0 })
        expect(node.size()).toEqual({ width: 1, height: 1 })

        child.remove()
        node.remove()
        graph.dispose()
      })

      it('should fit the node to its embeds deeply', () => {
        const graph = new Graph({ container: document.body })
        const child = new Node({
          position: { x: 10, y: 10 },
          size: { width: 20, height: 20 },
        })
        const grandChild = new Node({
          position: { x: 5, y: 5 },
          size: { width: 10, height: 10 },
        })
        child.embed(grandChild)
        node.embed(child)
        graph.addNode(node)
        node.fit({ deep: true })

        expect(child.position()).toEqual({ x: 10, y: 10 })
        expect(child.size()).toEqual({ width: 20, height: 20 })
        expect(node.position()).toEqual({ x: 0, y: 0 })
        expect(node.size()).toEqual({ width: 1, height: 1 })

        grandChild.remove()
        child.remove()
        node.remove()
        graph.dispose()
      })
    })

    describe('getConnectionPoint()', () => {
      it('should return the center of the node if no port is specified', () => {
        const edge = new Edge()
        node.position(100, 100)
        node.resize(50, 50)
        const connectionPoint = node.getConnectionPoint(edge, 'target')
        expect(connectionPoint).toEqual({ x: 125, y: 125 })
      })

      it('should return the center of the node if the port does not exist', () => {
        const edge = new Edge({
          target: {
            cell: node,
            port: 'nonExistentPort',
          },
        })
        node.position(100, 100)
        node.resize(50, 50)
        const connectionPoint = node.getConnectionPoint(edge, 'target')
        expect(connectionPoint).toEqual({ x: 125, y: 125 })
      })

      it('should return the center of the node if the port has no group', () => {
        node.addPort({ id: 'port1' })
        const edge = new Edge({
          target: {
            cell: node,
            port: 'port1',
          },
        })
        node.position(100, 100)
        node.resize(50, 50)
        const connectionPoint = node.getConnectionPoint(edge, 'target')
        expect(connectionPoint).toEqual({ x: 125, y: 125 })
      })

      it('should return the connection point of the port', () => {
        node.addPort({ id: 'port1', group: 'a' })
        node.position(100, 100)
        node.resize(50, 50)
        const edge = new Edge({
          target: {
            cell: node,
            port: 'port1',
          },
        })

        const portLayoutSpy = vi
          .spyOn(node.port, 'getPortsLayoutByGroup')
          .mockImplementation(() => [
            {
              portId: 'port1',
              portLayout: {
                position: { x: 10, y: 20 },
                angle: 0,
              },
            },
          ])

        const connectionPoint = node.getConnectionPoint(edge, 'target')
        expect(connectionPoint).toEqual({ x: 110, y: 120 })
        portLayoutSpy.mockRestore()
      })
    })

    describe('Node.isNode()', () => {
      it('should return true if the instance is a Node', () => {
        expect(Node.isNode(node)).toBe(true)
      })

      it('should return false if the instance is not a Node', () => {
        expect(Node.isNode({})).toBe(false)
        expect(Node.isNode(null)).toBe(false)
        expect(Node.isNode(undefined)).toBe(false)
      })
    })

    describe('Node.define()', () => {
      it('should define a new node', () => {
        const CustomNode = Node.define({
          shape: 'custom-node',
          width: 100,
          height: 50,
        })

        expect(CustomNode).toBeDefined()
        expect(CustomNode.prototype).toBeInstanceOf(Node)

        const customNode = new CustomNode()
        expect(customNode).toBeInstanceOf(CustomNode)
        expect(customNode).toBeInstanceOf(Node)
        expect(customNode.size()).toEqual({ width: 100, height: 50 })
      })
    })

    describe('Node.create()', () => {
      it('should create a default node if shape is not defined', () => {
        const defaultNode = Node.create({})
        expect(defaultNode).toBeInstanceOf(Node)
      })
    })
  })
})
