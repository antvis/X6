import { ObjectExt } from '@/common'

describe('object', () => {
  class Parent {
    public name: string
    public age: number

    constructor(name: string, age: number) {
      this.name = name
      this.age = age
    }

    static hello() {
      return 'hello'
    }

    public sayName() {
      return this.name
    }
  }

  describe('createClass', () => {
    it('should create class extend parent', () => {
      const cls = ObjectExt.createClass('Test', Parent)
      expect(Object.getPrototypeOf(cls) === Parent).toBeTruthy()
    })
  })
})
