import {
  Disposable,
  IDisposable,
  DisposableSet,
  DisposableDelegate,
} from './disposable'

class TestDisposable implements IDisposable {
  count = 0

  get disposed(): boolean {
    return this.count > 0
  }

  dispose(): void {
    this.count += 1
  }
}

class AOPTest extends Disposable {
  a = 1

  @Disposable.dispose()
  dispose() {
    this.a = 0
  }
}

describe('disposable', () => {
  describe('Disablable', () => {
    it('should be `false` before object is disposed', () => {
      const obj = new Disposable()
      expect(obj.disposed).toBe(false)
    })

    it('should be `true` after object is disposed', () => {
      const obj = new Disposable()
      obj.dispose()
      expect(obj.disposed).toBe(true)
    })

    // it('should add `unload` listener for ie', () => {
    //   const tmp = Platform as any
    //   tmp.IS_IE = true
    //   const obj = new Disposable()
    //   expect(obj.disposed).toBe(false)
    //   tmp.IS_IE = false
    //   window.dispatchEvent(new Event('unload'))
    //   expect(obj.disposed).toBe(true)
    // })

    it('shoule work with `aop`', () => {
      const obj = new AOPTest()
      expect(obj.disposed).toBe(false)
      expect(obj.a).toBe(1)
      obj.dispose()
      expect(obj.disposed).toBe(true)
      expect(obj.a).toBe(0)
      obj.dispose()
      expect(obj.disposed).toBe(true)
      expect(obj.a).toBe(0)
    })
  })

  describe('DisposableDelegate', () => {
    describe('#constructor', () => {
      it('should accept a callback', () => {
        const delegate = new DisposableDelegate(() => {})
        expect(delegate instanceof DisposableDelegate).toBeTruthy()
      })
    })

    describe('#disposed', () => {
      it('should be `false` before object is disposed', () => {
        const delegate = new DisposableDelegate(() => {})
        expect(delegate.disposed).toBe(false)
      })

      it('should be `true` after object is disposed', () => {
        const delegate = new DisposableDelegate(() => {})
        delegate.dispose()
        expect(delegate.disposed).toBe(true)
      })
    })

    describe('#dispose', () => {
      it('should invoke a callback when disposed', () => {
        let called = false
        const delegate = new DisposableDelegate(() => (called = true))
        expect(called).toBe(false)
        delegate.dispose()
        expect(called).toBe(true)
      })

      it('should ignore multiple calls to `dispose`', () => {
        let count = 0
        const delegate = new DisposableDelegate(() => (count += 1))
        expect(count).toBe(0)
        delegate.dispose()
        delegate.dispose()
        delegate.dispose()
        expect(count).toBe(1)
      })
    })
  })

  describe('DisposableSet', () => {
    describe('#constructor', () => {
      it('should accept no arguments', () => {
        const set = new DisposableSet()
        expect(set instanceof DisposableSet).toBeTruthy()
      })
    })

    describe('#disposed', () => {
      it('should be `false` before object is disposed', () => {
        const set = new DisposableSet()
        expect(set.disposed).toBe(false)
      })

      it('should be `true` after object is disposed', () => {
        const set = new DisposableSet()
        set.dispose()
        expect(set.disposed).toBe(true)
      })
    })

    describe('#dispose', () => {
      it('should dispose all items in the set', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = DisposableSet.from([item1, item2, item3])
        expect(item1.count).toBe(0)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(0)
        set.dispose()
        expect(item1.count).toBe(1)
        expect(item2.count).toBe(1)
        expect(item3.count).toBe(1)
      })

      it('should dipose items in the order they were added', () => {
        const values: number[] = []
        const item1 = new DisposableDelegate(() => values.push(0))
        const item2 = new DisposableDelegate(() => values.push(1))
        const item3 = new DisposableDelegate(() => values.push(2))
        const set = DisposableSet.from([item1, item2, item3])
        expect(values).toEqual([])
        set.dispose()
        expect(values).toEqual([0, 1, 2])
      })

      it('should ignore multiple calls to `dispose`', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = DisposableSet.from([item1, item2, item3])
        expect(item1.count).toBe(0)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(0)
        set.dispose()
        set.dispose()
        set.dispose()
        expect(item1.count).toBe(1)
        expect(item2.count).toBe(1)
        expect(item3.count).toBe(1)
      })
    })

    describe('#add', () => {
      it('should add items to the set', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = new DisposableSet()
        set.add(item1)
        set.add(item2)
        set.add(item3)
        expect(item1.count).toBe(0)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(0)
        set.dispose()
        expect(item1.count).toBe(1)
        expect(item2.count).toBe(1)
        expect(item3.count).toBe(1)
      })

      it('should maintain insertion order', () => {
        const values: number[] = []
        const item1 = new DisposableDelegate(() => values.push(0))
        const item2 = new DisposableDelegate(() => values.push(1))
        const item3 = new DisposableDelegate(() => values.push(2))
        const set = DisposableSet.from([item1])
        set.add(item2)
        set.add(item3)
        expect(values).toEqual([])
        set.dispose()
        expect(values).toEqual([0, 1, 2])
      })

      it('should ignore duplicate items', () => {
        const values: number[] = []
        const item1 = new DisposableDelegate(() => values.push(0))
        const item2 = new DisposableDelegate(() => values.push(1))
        const item3 = new DisposableDelegate(() => values.push(2))
        const set = DisposableSet.from([item1])
        set.add(item2)
        set.add(item3)
        set.add(item3)
        set.add(item2)
        set.add(item1)
        expect(values).toEqual([])
        set.dispose()
        expect(values).toEqual([0, 1, 2])
      })
    })

    describe('#contains', () => {
      it('should remove all items from the set after disposed', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = new DisposableSet()
        set.add(item1)
        set.add(item2)
        set.add(item3)
        expect(set.contains(item1)).toBe(true)
        expect(set.contains(item2)).toBe(true)
        expect(set.contains(item3)).toBe(true)

        set.dispose()

        expect(set.contains(item1)).toBe(false)
        expect(set.contains(item2)).toBe(false)
        expect(set.contains(item3)).toBe(false)
      })
    })

    describe('#remove', () => {
      it('should remove items from the set', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = DisposableSet.from([item1, item2, item3])
        expect(item1.count).toBe(0)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(0)
        set.remove(item2)
        set.dispose()
        expect(item1.count).toBe(1)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(1)
      })

      it('should maintain insertion order', () => {
        const values: number[] = []
        const item1 = new DisposableDelegate(() => values.push(0))
        const item2 = new DisposableDelegate(() => values.push(1))
        const item3 = new DisposableDelegate(() => values.push(2))
        const set = DisposableSet.from([item1, item2, item3])
        expect(values).toEqual([])
        set.remove(item1)
        set.dispose()
        expect(values).toEqual([1, 2])
      })

      it('should ignore missing items', () => {
        const values: number[] = []
        const item1 = new DisposableDelegate(() => values.push(0))
        const item2 = new DisposableDelegate(() => values.push(1))
        const item3 = new DisposableDelegate(() => values.push(2))
        const set = DisposableSet.from([item1, item2])
        expect(values).toEqual([])
        set.remove(item3)
        set.dispose()
        expect(values).toEqual([0, 1])
      })
    })

    describe('#clear', () => {
      it('should remove all items from the set', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = DisposableSet.from([item1, item2, item3])
        expect(item1.count).toBe(0)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(0)
        set.clear()
        set.dispose()
        expect(item1.count).toBe(0)
        expect(item2.count).toBe(0)
        expect(item3.count).toBe(0)
      })
    })

    describe('#from', () => {
      it('should accept an iterable of disposable items', () => {
        const item1 = new TestDisposable()
        const item2 = new TestDisposable()
        const item3 = new TestDisposable()
        const set = DisposableSet.from([item1, item2, item3])
        expect(set instanceof DisposableSet).toBeTruthy()
      })
    })
  })
})
