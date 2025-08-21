import sinon from 'sinon'
import { Dom } from '../../dom'
import { Core } from '../../dom/event/core'
// import { Hook } from './hook'

describe('EventDom', () => {
  describe('events', () => {
    const tree = `
      <div>
        <div class="one common"></div>
        <div class="two common"></div>
        <div class="three">
          <div class="four"></div>
        </div>
      </div>
      `
    class EventDom {
      public node: Element

      constructor(elem?: HTMLElement) {
        if (!elem) {
          this.node = document.createElement('div')
        } else {
          this.node = elem
        }
      }

      on(p1: any, p2?: any, p3?: any, p4?: any) {
        Dom.Event.on(this.node, p1, p2, p3, p4)
        return this
      }

      once(p1: any, p2?: any, p3?: any, p4?: any) {
        Dom.Event.once(this.node, p1, p2, p3, p4)
        return this
      }

      off(p1?: any, p2?: any, p3?: any) {
        Dom.Event.off(this.node, p1, p2, p3)
        return this
      }

      trigger(p1: any, p2?: any, p3?: any) {
        Dom.Event.trigger(this.node, p1, p2, p3)
        return this
      }

      findOne(selector: string) {
        const one = this.node.querySelector(selector) as HTMLElement
        return new EventDom(one)
      }

      appendTo(container: HTMLElement) {
        if (this.node) {
          container.appendChild(this.node)
        }
        return this
      }

      remove() {
        if (this.node && this.node.parentNode) {
          this.node.parentNode.removeChild(this.node)
        }
      }
    }

    describe('on()', () => {
      it('should bind single event', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.on('click', spy)
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
        div.trigger('click')
        expect(spy.callCount).toEqual(2)
      })

      it('should bind events with event-handler object', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        div.on({
          click: spy1,
          dblclick: spy2,
        })
        div.trigger('click')
        div.trigger('dblclick')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        div.trigger('click')
        div.trigger('dblclick')
        expect(spy1.callCount).toEqual(2)
        expect(spy2.callCount).toEqual(2)
      })

      it('should bind event with handler object', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.on('click', { handler: spy })
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
        div.trigger('click')
        expect(spy.callCount).toEqual(2)
      })

      it('should not bind event on invalid target', () => {
        const text = document.createTextNode('foo') as any
        const spy = sinon.spy()
        Dom.Event.on(text, 'click', spy)
        Dom.Event.trigger(text, 'click')
        expect(spy.callCount).toEqual(0)
      })

      it('should delegate event', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy = sinon.spy()
        container.on('click', '.one', spy)
        const child = container.findOne('.one')!

        child.trigger('click')
        expect(spy.callCount).toEqual(1)

        child.trigger('click')
        expect(spy.callCount).toEqual(2)
      })

      // it('should throw an error when delegating with invalid selector', () => {
      //   const div = document.createElement('div')
      //   div.innerHTML = tree
      //   const container = new EventDom(div)
      //   const spy = sinon.spy()
      //   expect(() => container.on('click', '.unknown', spy)).toThrowError()
      // })

      it('should support data', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.on('click', { foo: 'bar' }, spy)
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
        div.trigger('click')
        expect(spy.callCount).toEqual(2)

        const e1 = spy.args[0][0]
        const e2 = spy.args[1][0]
        expect(e1.data).toEqual({ foo: 'bar' })
        expect(e2.data).toEqual({ foo: 'bar' })
      })

      it('should bind false as event handler', () => {
        const div = new EventDom()
        expect(() => div.on('click', false)).not.toThrow()
      })

      it('should ignore invalid handler', () => {
        const div = new EventDom()
        expect(() => div.on('click', null as any)).not.toThrow()
      })

      it('should not no attaching namespace-only handlers', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        expect(() => div.on('.ns', spy)).not.toThrow()
      })
    })

    describe('once()', () => {
      it('should bind single event', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.once('click', spy)
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
      })

      it('should bind event with namespace', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.once('click.ns', spy)
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
        div.trigger('click')
        expect(spy.callCount).toEqual(1)
      })
    })

    describe('off()', () => {
      it('should unbind single event', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        div.on('click', spy1)
        div.on('click', spy2)
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        div.off('click', spy1)
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(2)
      })

      it('should unbind events by the given event type', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        div.on('click', spy1)
        div.on('click', spy2)
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        div.off('click')
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
      })

      it('should unbind events by the given namespace', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        div.on('click.ns', spy1)
        div.on('click.ns', spy2)
        div.on('click', spy3)
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
        div.off('.ns')
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(2)
      })

      it('should unbind events with event-handler object', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        div.on('click.ns', spy1)
        div.on('click.ns', spy2)
        div.on('click', spy3)
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
        div.off({ 'click.ns': spy1, click: spy3 })
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(2)
        expect(spy3.callCount).toEqual(1)
      })

      it('should unbind delegated events', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy = sinon.spy()
        container.on('click', '.one', spy)
        const child = container.findOne('.one')!

        child.trigger('click')
        expect(spy.callCount).toEqual(1)

        container.off('click', '.one')
        child.trigger('click')
        expect(spy.callCount).toEqual(1)
      })

      it('should unbind delegated events with "**" selector', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy = sinon.spy()
        container.on('click', '.one', spy)
        const child = container.findOne('.one')!

        child.trigger('click')
        expect(spy.callCount).toEqual(1)

        container.off('click', '**')
        child.trigger('click')
        expect(spy.callCount).toEqual(1)
      })

      it('should unbind "false" event handler', () => {
        const div = new EventDom()
        expect(() => div.off('click', false)).not.toThrowError()
      })

      it('should do nothing for elem which do not bind any events', () => {
        const div = new EventDom()
        expect(() => div.off()).not.toThrowError()
      })

      it('should do nothing for unexist event', () => {
        const div = new EventDom()
        div.on('whatever', () => {})
        expect(() => div.off('unexist')).not.toThrowError()
      })
    })

    describe('trigger()', () => {
      it('should trigger event with namespace', () => {
        const div = new EventDom().appendTo(document.body)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        div.on('click.ns', spy1)
        div.on('click.ns', spy2)
        div.on('click', spy3)
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
        div.trigger('click.ns')
        expect(spy1.callCount).toEqual(2)
        expect(spy2.callCount).toEqual(2)
        expect(spy3.callCount).toEqual(1)
        div.remove()
      })

      it('should also trigger inline binded event', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy(() => false)
        div.on('click', spy1)
        const node = div.node as HTMLDivElement
        node.onclick = spy2
        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
      })

      it('should trigger event with EventObject', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        div.on('click.ns', spy1)
        div.on('click.ns', spy2)
        div.on('click', spy3)

        div.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)

        div.trigger(new Dom.EventObject('click', { namespace: 'ns' }))
        expect(spy1.callCount).toEqual(2)
        expect(spy2.callCount).toEqual(2)
        expect(spy3.callCount).toEqual(1)
      })

      it('should trigger event with EventObject created with native event', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        div.on('click.ns', spy1)
        div.on('click.ns', spy2)
        div.on('click', spy3)

        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        evt.preventDefault()
        div.trigger(new Dom.EventObject(evt))
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
      })

      it('should trigger event with EventLikeObject', () => {
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        div.on('click.ns', spy1)
        div.on('click.ns', spy2)
        div.on('click', spy3)

        div.trigger({ type: 'click' })
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
      })

      it('should trigger custom event', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.on('foo', spy)
        div.trigger('foo')
        expect(spy.callCount).toEqual(1)
      })

      it('should bind and trigger event on any object', () => {
        const obj = {}
        const spy = sinon.spy()
        Core.on(obj, 'foo', spy)
        Core.trigger('foo', [], obj)
        expect(spy.callCount).toEqual(1)
      })

      it('should trggier event with the given args', () => {
        const div = new EventDom()
        const spy = sinon.spy()
        div.on('click', spy)

        div.trigger('click')
        expect(spy.callCount).toEqual(1)

        div.trigger('click', 1)
        expect(spy.callCount).toEqual(2)
        expect(spy.args[1][1]).toEqual(1)

        div.trigger('click', [1, { foo: 'bar' }])
        expect(spy.callCount).toEqual(3)
        expect(spy.args[2][1]).toEqual(1)
        expect(spy.args[2][2]).toEqual({ foo: 'bar' })
      })

      it('should stop propagation when handler return `false`', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy(() => false)
        container.on('click', spy1)
        container.on('click', '.one', spy2)
        const child = container.findOne('.one')!

        child.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(0)

        container.off('click', '.one', spy2)
        container.on('click', '.one', spy3)
        child.trigger('click')
        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
      })

      it('should stopImmediatePropagation 1', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy((e: Dom.EventObject) => {
          e.stopImmediatePropagation()
        })
        const spy3 = sinon.spy()
        const spy4 = sinon.spy()
        container.on('click', spy1)
        container.on('click', '.one', spy2)
        container.on('click', '.two', spy3)
        container.on('click', '.three', spy4)

        container.findOne('.one')!.trigger('click')

        expect(spy1.callCount).toEqual(0)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(0)
        expect(spy4.callCount).toEqual(0)
      })

      it('should stopImmediatePropagation 2', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy((e: Dom.EventObject) => {
          e.stopImmediatePropagation()
        })
        const spy3 = sinon.spy()
        const spy4 = sinon.spy()
        container.on('click', spy1)
        container.on('click', '.one', spy2)
        container.on('click', '.two', spy3)
        container.on('click', '.three', spy4)

        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        const node = container.findOne('.one')!.node as HTMLDivElement
        node.dispatchEvent(evt)

        expect(spy1.callCount).toEqual(0)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(0)
        expect(spy4.callCount).toEqual(0)
      })

      it('should prevent default action', (done) => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        container
          .on('click', (e: any) => {
            expect(e.isDefaultPrevented()).toBeTrue()
            done()
          })
          .findOne('.three')!
          .on('click', (e: any) => {
            e.preventDefault()
          })

        container.findOne('.four')?.trigger('click')
      })

      it('should do the default action', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        const spy4 = sinon.spy((e: Dom.EventObject) => {
          e.stopPropagation()
        })

        container.on('click', spy1)
        container.on('click', '.one', spy2)
        const child = container.findOne('.one')!
        const node = child.node as HTMLDivElement
        node.onclick = spy3
        child.on('click', spy4)

        node.dispatchEvent(new Event('click'))
        expect(spy1.callCount).toEqual(0)
        expect(spy2.callCount).toEqual(0)
        expect(spy3.callCount).toEqual(1)
        expect(spy4.callCount).toEqual(1)
      })

      it('should not propagation when `onlyHandlers` is `true`', () => {
        const div = document.createElement('div')
        div.innerHTML = tree
        const container = new EventDom(div)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        container.on('click', spy1)
        container.on('click', '.one', spy2)
        const child = container.findOne('.one')!
        child.on('click', spy3)

        child.trigger('click', [], true)
        expect(spy1.callCount).toEqual(0)
        expect(spy2.callCount).toEqual(0)
        expect(spy3.callCount).toEqual(1)
      })
    })

    describe('hooks', () => {
      it('should get event properties on natively-triggered event', (done) => {
        const a = document.createElement('a')
        const lk = new EventDom(a)
          .appendTo(document.body)
          .on('click', function (e: any) {
            expect('detail' in e).toBeTrue()
            expect('cancelable' in e).toBeTrue()
            expect('bubbles' in e).toBeTrue()
            expect(e.clientX).toEqual(10)
            done()
          })
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        lk.trigger(new Dom.EventObject(evt, { clientX: 10 }))
        lk.remove()
      })

      it('should get event properties added by `addProperty`', (done) => {
        const div = new EventDom().on('click', (e: any) => {
          expect(typeof e.clientX === 'number').toBeTrue()
          done()
        })
        const node = div.node as HTMLDivElement
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click')
        node.dispatchEvent(evt)
      })

      it('shoud add custom event property with `addProperty`', (done) => {
        Dom.EventObject.addProperty('testProperty', () => 42)

        const div = new EventDom().on('click', (e: any) => {
          expect(e.testProperty).toEqual(42)
          done()
        })
        const node = div.node as HTMLDivElement
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click')
        node.dispatchEvent(evt)
      })

      it('should apply hook to prevent triggered `image.load` events from bubbling to `window.load`', () => {
        const div = new EventDom()
        const win = new EventDom(window as any)
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        div.on('load', spy1)
        win.on('load', spy2)

        const node = div.node as HTMLElement
        node.dispatchEvent(new Event('load'))

        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(0)
      })

      // it('should apply hook to prevent window to unload', () => {
      //   const win = new EventDom(window as any)
      //   const spy1 = sinon.spy(() => {
      //     return false
      //   })
      //   const spy2 = sinon.spy()
      //   win.on('beforeunload', spy1)
      //   win.on('unload', spy2)
      //   const node = win.node as HTMLElement
      //   node.dispatchEvent(new Event('beforeunload'))
      //   expect(spy1.callCount).toEqual(1)
      //   expect(spy2.callCount).toEqual(0)
      // })

      it('should call hooks', () => {
        const addHook = sinon.spy()
        const removeHook = sinon.spy()
        const setupHook = sinon.spy()
        const teardownHook = sinon.spy()
        const handleHook = sinon.spy()
        const triggerHook = sinon.spy()
        const preDispatchHook = sinon.spy()
        const postDispatchHook = sinon.spy()

        Dom.EventHook.register('dblclick', {
          add: addHook,
          remove: removeHook,
          setup: setupHook,
          teardown: teardownHook,
          handle: handleHook,
          trigger: triggerHook,
          preDispatch: preDispatchHook,
          postDispatch: postDispatchHook,
        })
        const div = new EventDom()
        const spyHandler = sinon.spy()
        div.on('dblclick', spyHandler)
        div.trigger('dblclick')
        div.off('dblclick')

        expect(addHook.callCount).toEqual(1)
        expect(removeHook.callCount).toEqual(1)
        expect(setupHook.callCount).toEqual(1)
        expect(teardownHook.callCount).toEqual(1)
        expect(handleHook.callCount).toEqual(1)
        expect(triggerHook.callCount).toEqual(1)
        expect(preDispatchHook.callCount).toEqual(1)
        expect(postDispatchHook.callCount).toEqual(1)
        Dom.EventHook.unregister('dblclick')
      })

      it('should not trigger event when `preDispatch` hook return `false`', () => {
        const preDispatchHook = sinon.spy(() => false)
        Dom.EventHook.register('dblclick', {
          preDispatch: preDispatchHook as any,
        })
        const div = new EventDom()
        const spyHandler = sinon.spy()
        div.on('dblclick', spyHandler)
        div.trigger('dblclick')
        Dom.EventHook.unregister('dblclick')
        expect(spyHandler.callCount).toEqual(0)
      })

      it('should not trigger event when `trigger` hook return `false`', () => {
        const hook = sinon.spy(() => false)
        Dom.EventHook.register('dblclick', {
          trigger: hook as any,
        })
        const div = new EventDom()
        const spyHandler = sinon.spy()
        div.on('dblclick', spyHandler)
        div.trigger('dblclick')
        Dom.EventHook.unregister('dblclick')
        expect(spyHandler.callCount).toEqual(0)
      })

      it('should not prevent default when `preventDefault` hook return `false`', () => {
        const hook = sinon.spy(() => false)
        Dom.EventHook.register('click', {
          preventDefault: hook as any,
        })
        const div = new EventDom()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        const node = div.node as HTMLDivElement

        node.click = spy1
        node.onclick = spy2
        div.on('click', spy3)
        div.trigger('click')
        Dom.EventHook.unregister('click')

        expect(spy1.callCount).toEqual(1)
        expect(spy2.callCount).toEqual(1)
        expect(spy3.callCount).toEqual(1)
      })
    })
  })
})
