import JQuery from 'jquery'
import 'jquery-mousewheel'
import { Platform } from '../platform'

if (Platform.SUPPORT_PASSIVE) {
  JQuery.event.special.touchstart = {
    setup(data, ns, handle) {
      this.addEventListener('touchstart', handle as any, {
        passive: true,
      })
    },
  }

  const hook = JQuery.event.special.mousewheel as any
  if (hook) {
    const setup = hook.setup
    hook.setup = function (this: EventTarget) {
      const addEventListener = this.addEventListener
      this.addEventListener = (name: string, handler: any) => {
        addEventListener.call(this, name, handler, { passive: true })
      }
      setup.call(this)
      this.addEventListener = addEventListener
    }
  }
}

// compatible with NodeList.prototype.forEach() before chrome 51
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach as any
}

// compatible with ParentNode.append() before chrome 54
// https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function (arr) {
  arr.forEach((item) => {
    if (item.hasOwnProperty('append')) {
      return
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        const argArr = Array.prototype.slice.call(arguments)
        const docFrag = document.createDocumentFragment()
        
        argArr.forEach((argItem: any) => {
          const isNode = argItem instanceof Node
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)))
        })
        
        this.appendChild(docFrag)
      }
    })
  })
})([Element.prototype, Document.prototype, DocumentFragment.prototype])
