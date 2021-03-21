import { inherit, createClass } from './inherit'

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

  class Child {
    public name: string
    public age: number
    public gender: string

    constructor(name: string, age: number, gender: string) {
      this.name = name
      this.age = age
      this.gender = gender
    }
  }

  describe('inherit', () => {
    it('should access the parent function and static function', () => {
      inherit(Child, Parent)
      const c = new Child('cat', 25, 'male')
      expect(c.name).toBe('cat')
      expect(c.age).toBe(25)
      expect(c.gender).toBe('male')
      expect((c as any).sayName()).toBe('cat')
      expect((Child as any).hello()).toBe('hello')
    })
  })

  describe('createClass', () => {
    it('should create class extend parent', () => {
      const cls = createClass('Test', Parent)
      expect(Object.getPrototypeOf(cls) === Parent).toBeTruthy()
    })
  })
})
