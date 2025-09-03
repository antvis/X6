import { describe, expect, it, vi } from 'vitest'
import { Rectangle } from '../../src'
import { PortManager } from '../../src/model/port'
import { portLayoutRegistry } from '../../src/registry'

describe('Port', () => {
  describe('constructor', () => {
    it('should initialize ports and groups to empty objects', () => {
      const data = { items: [] }
      const portManager = new PortManager(data)
      expect(portManager.ports).toEqual([])
      expect(portManager.groups).toEqual({})
    })

    it('should initialize ports and groups from the provided data', () => {
      const data = {
        groups: {
          group1: {
            label: {
              position: 'right',
            },
            position: 'top',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
        ],
      }
      const portManager = new PortManager(data)
      expect(portManager.ports.length).toBe(1)
      expect(portManager.groups).toHaveProperty('group1')
    })

    it('should clone the input data to avoid modifying the original data', () => {
      const data = {
        groups: {
          group1: {
            label: {
              position: 'right',
            },
            position: 'top',
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
        ],
      }
      const clonedData = structuredClone(data)
      const portManager = new PortManager(data)
      expect(data).toEqual(clonedData)
    })
  })

  describe('getPorts', () => {
    it('should return the ports array', () => {
      const data = { items: [{ id: 'port1' }, { id: 'port2' }] }
      const portManager = new PortManager(data)
      const ports = portManager.getPorts()
      expect(ports).toEqual(portManager.ports)
    })
  })

  describe('getGroup', () => {
    it('should return the group with the given name', () => {
      const data = {
        groups: {
          group1: { label: { position: 'right' }, position: 'top' },
        },
        items: [],
      }
      const portManager = new PortManager(data)
      const group = portManager.getGroup('group1')
      expect(group).toEqual(portManager.groups.group1)
    })

    it('should return null if the group with the given name does not exist', () => {
      const data = { items: [] }
      const portManager = new PortManager(data)
      const group = portManager.getGroup('group1')
      expect(group).toBeUndefined()
    })

    it('should return null if the groupName is null or undefined', () => {
      const data = {
        groups: {
          group1: { label: { position: 'right' }, position: 'top' },
        },
        items: [],
      }
      const portManager = new PortManager(data)
      expect(portManager.getGroup(null)).toBeNull()
      expect(portManager.getGroup(undefined)).toBeNull()
    })
  })

  describe('getPortsByGroup', () => {
    it('should return the ports in the given group', () => {
      const data = {
        items: [
          { id: 'port1', group: 'group1' },
          { id: 'port2', group: 'group2' },
          { id: 'port3', group: 'group1' },
        ],
      }
      const portManager = new PortManager(data)
      const ports = portManager.getPortsByGroup('group1')
      expect(ports.length).toBe(2)
      expect(ports.map((p) => p.id)).toEqual(['port1', 'port3'])
    })

    it('should return an empty array if no ports are in the given group', () => {
      const data = {
        items: [
          { id: 'port1', group: 'group1' },
          { id: 'port2', group: 'group2' },
          { id: 'port3', group: 'group1' },
        ],
      }
      const portManager = new PortManager(data)
      const ports = portManager.getPortsByGroup('group3')
      expect(ports.length).toBe(0)
    })

    it('should return ports without a group if groupName is null or undefined', () => {
      const data = {
        items: [
          { id: 'port1', group: 'group1' },
          { id: 'port2' },
          { id: 'port3', group: 'group1' },
          { id: 'port4' },
        ],
      }
      const portManager = new PortManager(data)
      const ports1 = portManager.getPortsByGroup(null)
      const ports2 = portManager.getPortsByGroup(undefined)

      expect(ports1.length).toBe(2)
      expect(ports1.map((p) => p.id)).toEqual(['port2', 'port4'])
      expect(ports2.length).toBe(2)
      expect(ports2.map((p) => p.id)).toEqual(['port2', 'port4'])
    })
  })

  describe('getPortsLayoutByGroup', () => {
    it('should return the layout results for the ports in the given group', () => {
      const data = {
        groups: {
          group1: { position: 'left' },
        },
        items: [
          { id: 'port1', group: 'group1' },
          { id: 'port2', group: 'group2' },
          { id: 'port3', group: 'group1' },
        ],
      }
      const portManager = new PortManager(data)
      const elemBBox = new Rectangle(0, 0, 100, 100)
      const layouts = portManager.getPortsLayoutByGroup('group1', elemBBox)
      expect(layouts.length).toBe(2)
      expect(layouts.map((l) => l.portId)).toEqual(['port1', 'port3'])
    })

    it('should use the default layout if the group has no position defined', () => {
      const data = {
        items: [
          { id: 'port1' },
          { id: 'port2', group: 'group2' },
          { id: 'port3' },
        ],
      }
      const portManager = new PortManager(data)
      const elemBBox = new Rectangle(0, 0, 100, 100)
      const layouts = portManager.getPortsLayoutByGroup(undefined, elemBBox)
      expect(layouts.length).toBe(2)
      expect(layouts.map((l) => l.portId)).toEqual(['port1', 'port3'])
    })

    it('should call portLayoutRegistry.onNotFound if the layout function is not found', () => {
      const data = {
        groups: {
          group1: {
            position: {
              name: 'invalid-layout',
            },
          },
        },
        items: [{ id: 'port1', group: 'group1' }],
      }
      const portManager = new PortManager(data)
      const elemBBox = new Rectangle(0, 0, 100, 100)
      const onNotFoundSpy = vi.spyOn(portLayoutRegistry, 'onNotFound')

      onNotFoundSpy.mockImplementation(() => {})

      portManager.getPortsLayoutByGroup('group1', elemBBox)
      expect(onNotFoundSpy).toHaveBeenCalledWith('invalid-layout')
    })
  })
})
