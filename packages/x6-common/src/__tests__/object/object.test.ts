import { ObjectExt } from '../../object'

describe('Object', () => {
  const obj = {
    name: 'x6',
    age: 1,
    gender: null,
    tall: true,
  }

  describe('#getValue', () => {
    it('should return a value of a object', () => {
      expect(ObjectExt.getValue<string>(obj, 'name')).toBe('x6')
      expect(ObjectExt.getValue<number>(obj, 'age')).toBe(1)
      expect(ObjectExt.getValue<any>(obj, 'gender')).toBe(null)
      expect(ObjectExt.getValue<any>(obj, 'count')).toBe(undefined)
    })

    it('should return a defaultValue of a object', () => {
      expect(ObjectExt.getValue(obj, 'gender', 'male')).toBe('male')
      expect(ObjectExt.getValue(obj, 'count', 100)).toBe(100)
    })
  })

  describe('#getNumber', () => {
    it('should return a number value of a object', () => {
      expect(ObjectExt.getNumber(obj, 'age', 2)).toBe(1)
    })

    it('should return a defaultValue of a object', () => {
      expect(ObjectExt.getNumber(obj, 'name', 10)).toBe(10)
      expect(ObjectExt.getNumber(obj, 'count', 20)).toBe(20)
    })
  })

  describe('#getBoolean', () => {
    it('should return a boolean value of a object', () => {
      expect(ObjectExt.getBoolean(obj, 'tall', false)).toBe(true)
      expect(ObjectExt.getBoolean(obj, 'name', false)).toBe(true)
      expect(ObjectExt.getBoolean(obj, 'age', false)).toBe(true)
    })

    it('should return a defaultValue of a object', () => {
      expect(ObjectExt.getBoolean(obj, 'gender', false)).toBe(false)
      expect(ObjectExt.getBoolean(obj, 'count', true)).toBe(true)
    })
  })

  describe('#getByPath#setByPath', () => {
    const project = {
      name: 'x6',
      version: ['0.1', '0.2', '0.3'],
      attr: {
        node: {
          fontSize: 14,
        },
        edge: {
          color: 'red',
        },
      },
    }
    it('should set or get object value by path', () => {
      expect(ObjectExt.getByPath(project, 'version/1')).toBe('0.2')
      expect(ObjectExt.getByPath(project, 'attr/node/fontSize')).toBe(14)
      expect(ObjectExt.getByPath(project, 'attr/node/color')).toBe(undefined)

      ObjectExt.setByPath(project, 'version/1', '0.8')
      ObjectExt.setByPath(project, 'attr/node/fontSize', 16)
      ObjectExt.setByPath(project, 'attr/node/color', 'green')

      expect(ObjectExt.getByPath(project, 'version/1')).toBe('0.8')
      expect(ObjectExt.getByPath(project, 'attr/node/fontSize')).toBe(16)
      expect(ObjectExt.getByPath(project, 'attr/node/color')).toBe('green')

      ObjectExt.unsetByPath(project, 'version/1')
      ObjectExt.unsetByPath(project, 'attr/node/fontSize')

      expect(ObjectExt.getByPath(project, 'version/1')).toBe(undefined)
      expect(ObjectExt.getByPath(project, 'attr/node/fontSize')).toBe(undefined)
    })
  })

  describe('#flatten', () => {
    const project = {
      name: 'x6',
      version: ['0.1', '0.2', '0.3'],
      attr: {
        node: {
          fontSize: 14,
        },
        edge: {
          color: 'red',
        },
      },
    }
    it('should return flatten object', () => {
      expect(ObjectExt.flatten(project)).toEqual({
        name: 'x6',
        'version/0': '0.1',
        'version/1': '0.2',
        'version/2': '0.3',
        'attr/node/fontSize': 14,
        'attr/edge/color': 'red',
      })
    })
  })
})
