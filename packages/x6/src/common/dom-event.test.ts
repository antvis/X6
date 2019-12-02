import sinon from 'sinon'
import { DomEvent } from './dom-event'

function simulate(component: HTMLElement, eventName: string, eventData: any) {
  const event = new MouseEvent(eventName, eventData)
  component.dispatchEvent(event)
}

describe('DomEvent', () => {
  describe('#addListener', () => {
    it('shoule add event on element', () => {
      const spy1 = sinon.spy()
      const spy2 = sinon.spy()
      const container = document.createElement('div')
      document.body.appendChild(container)
      DomEvent.addListener(container, DomEvent.CLICK, spy1)
      DomEvent.addListener(container, DomEvent.CLICK, spy2)
      container.click()

      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.calledOnce).toBeTruthy()
      expect(spy1.args[0][0]).toBeInstanceOf(Event)

      container.click()
      expect(spy1.callCount).toEqual(2)
      expect(spy2.callCount).toEqual(2)
      expect(spy1.args[0][0]).toBeInstanceOf(Event)
    })
  })

  describe('#removeListener', () => {
    it('should remove specified event on element', () => {
      const spy = sinon.spy()
      const container = document.createElement('div')
      document.body.appendChild(container)
      DomEvent.addListener(container, DomEvent.CLICK, spy)
      container.click()
      expect(spy.calledOnce).toBeTruthy()
      expect(spy.args[0][0]).toBeInstanceOf(Event)

      DomEvent.removeListener(container, DomEvent.CLICK, spy)

      container.click()
      expect(spy.calledOnce).toBeTruthy()
      expect(spy.args[0][0]).toBeInstanceOf(Event)
    })
  })

  describe('#removeAllListeners', () => {
    it('should remove all listener on element', () => {
      const spy1 = sinon.spy()
      const spy2 = sinon.spy()
      const container = document.createElement('div')
      document.body.appendChild(container)
      DomEvent.addListener(container, DomEvent.CLICK, spy1)
      DomEvent.addListener(container, DomEvent.CLICK, spy2)
      container.click()

      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.calledOnce).toBeTruthy()
      expect(spy1.args[0][0]).toBeInstanceOf(Event)

      DomEvent.removeAllListeners(container)

      container.click()

      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.calledOnce).toBeTruthy()
    })
  })

  describe('#addMouseListeners', () => {
    it('should add mouseDown, mouseMove and mouseUp event', () => {
      const spy1 = sinon.spy()
      const spy2 = sinon.spy()
      const spy3 = sinon.spy()
      const container = document.createElement('div')
      document.body.appendChild(container)
      DomEvent.addMouseListeners(container, spy1, spy2, spy3)
      simulate(container, 'mousedown', { clientX: 10, clientY: 10 })
      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.called).toBeFalsy()
      expect(spy3.called).toBeFalsy()

      simulate(container, 'mousemove', { clientX: 10, clientY: 10 })
      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.calledOnce).toBeTruthy()
      expect(spy3.called).toBeFalsy()

      simulate(container, 'mouseup', { clientX: 10, clientY: 10 })
      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.calledOnce).toBeTruthy()
      expect(spy3.calledOnce).toBeTruthy()

      DomEvent.removeMouseListeners(container, spy1, spy2, spy3)
      simulate(container, 'mousedown', { clientX: 10, clientY: 10 })
      simulate(container, 'mousemove', { clientX: 10, clientY: 10 })
      simulate(container, 'mouseup', { clientX: 10, clientY: 10 })
      expect(spy1.calledOnce).toBeTruthy()
      expect(spy2.calledOnce).toBeTruthy()
      expect(spy3.calledOnce).toBeTruthy()
    })
  })
})
