//
// script execute function
//

// execute raw script in inspect window
var executeScriptInInspectWindow = function (script) {
  return new Promise(function (resolve, reject) {
    chrome.devtools.inspectedWindow.eval(script, function (result, exception) {
      if (exception) {
        reject(exception)
      } else {
        resolve(result)
      }
    })
  })
}

// execute function in anynomous code block
var executeFuntionInInspectWindow = function (func, args) {
  return executeScriptInInspectWindow(
    `(${func.toString()}).apply(window, ${JSON.stringify(args)})`,
  )
}

//
// these are the function that execute in inspect window
//

function doFPSThings() {
  if (window.__x6_fps) {
    cancelAnimationFrame(window.__x6_fps)
  }
  let lastCalledTime
  let fps
  let delta

  function requestAnimFrame() {
    if (!lastCalledTime) {
      lastCalledTime = performance.now()
      fps = 0
    } else {
      delta = (performance.now() - lastCalledTime) / 1000
      lastCalledTime = performance.now()
      fps = 1 / delta
    }
    window.__x6_fps_value = Math.round(fps)
    window.__x6_fps = requestAnimationFrame(requestAnimFrame)
  }

  requestAnimFrame()
}

// get global X6 Graph structure
function getGlobalInstances() {
  var instances = window.__x6_instances__
  var gmap = {}
  var getGraphRootGroup = function (graph) {
    // 使用model中的引用直接获取元素
    return graph.model.collection.cells
  }
  window.__x6_instances__.globalMap = gmap
  var gInfo = []
  function getX6Instance(instance) {
    const ga = {}
    // antv/g 实现了getChildren可以递归获取，x6不行
    // if (instance.getChildren && instance.getChildren()) {
    //   ga.children = instance.getChildren().map(function (p) {
    //     return getX6Instance(p);
    //   });
    // }

    if (!instance.__dev_hash) {
      ga.hash = Math.random().toString(16).slice(-8)
      instance.__dev_hash = ga.hash
    } else {
      ga.hash = instance.__dev_hash
    }

    gmap[ga.hash] = instance
    ga.id = instance.id
    ga.name = instance.name || instance.prop('shape') || instance.prop('label')
    ga.type = instance.prop('shape')
    return ga
  }

  if (instances && instances.length) {
    gInfo = instances.map(function (instance) {
      const hash = instance.hash || Math.random().toString(16).slice(-8)
      var ga = {
        type: 'svg',
        name: 'Graph',
        nodeName: 'graph',
        hash,
        children: getGraphRootGroup(instance).map((e) => getX6Instance(e)),
        memory: window.performance.memory.usedJSHeapSize,
        fps: window.__x6_fps_value,
      }
      instance.hash = ga.hash
      gmap[ga.hash] = instance
      return ga
    })
  } else {
    gInfo.length = 0
  }

  return gInfo
}

function checkGraphByHash(hash) {
  return !!window.__x6_instances__.map((e) => e.hash).includes(hash)
}

function createBoxUsingId(bbox, id, color) {
  var el = document.createElement('div')
  window[id] = el
  el.classList.add('x6_devtool_rect')
  document.body.appendChild(el)
  el.style.position = 'absolute'
  el.style.width = `${bbox.width}px`
  el.style.height = `${bbox.height}px`
  el.style.top = `${bbox.top}px`
  el.style.left = `${bbox.left}px`
  el.style.background = color || 'rgba(135, 59, 244, 0.5)'
  el.style.border = '2px dashed rgb(135, 59, 244)'
  el.style.boxSizing = 'border-box'
}

function removeBoxUsingId(id) {
  if (window[id]) {
    window[id].remove()
  }
}

function removeAllBox() {
  var elements = document.getElementsByClassName('x6_devtool_rect')
  ;[].forEach.apply(elements, [
    function (e) {
      e.remove()
    },
  ])
}

function getElemetBBoxByHash(hash) {
  var targetEl = window.__x6_instances__.globalMap[hash]
  if (targetEl) {
    return targetEl.getContentBBox
      ? targetEl.getContentBBox()
      : targetEl.getBBox()
  }
  return {}
}

function getElementAttrByHash(hash) {
  const instance = window.__x6_instances__.globalMap[hash]
  if (instance) {
    return instance.coord
      ? { ...instance.options, container: undefined }
      : instance.prop()
  }
  return {}
}

function setElementAttrByHash(hash, name, value) {
  // return window.__x6_instances__.globalMap[hash].attr(name, value);
}

function setGElementByHash(hash) {
  window.$gElemet = hash ? window.__x6_instances__.globalMap[hash] : undefined
}

function consoleElementByHash(hash, desc) {
  window.console.log(
    desc || '<Click To Expand>',
    window.__x6_instances__.globalMap[hash],
  )
}

//
// these are the functions that run in devtools panel
//

function setRect(bbox, id, color) {
  executeFuntionInInspectWindow(removeBoxUsingId, [id]).finally(() => {
    executeFuntionInInspectWindow(createBoxUsingId, [bbox, id, color])
  })
}

function cleanRect(id) {
  executeFuntionInInspectWindow(removeBoxUsingId, [id])
}

function showRect(hash, id, color) {
  executeFuntionInInspectWindow(getElemetBBoxByHash, [hash]).then((bbox) => {
    setRect(bbox, id, color)
  })
}

function cleanAllRect() {
  executeFuntionInInspectWindow(removeAllBox)
}

function getAttrs(hash) {
  if (hash) {
    executeFuntionInInspectWindow(setGElementByHash, [hash])
    return executeFuntionInInspectWindow(getElementAttrByHash, [hash])
  }
  return executeFuntionInInspectWindow(setGElementByHash, [])
}

function updateAttrs(hash, name, attrs) {
  return executeFuntionInInspectWindow(setElementAttrByHash, [
    hash,
    name,
    attrs,
  ])
}

function consoleEl(hash, desc) {
  return executeFuntionInInspectWindow(consoleElementByHash, [hash, desc])
}

function checkGraphAlive(hash) {
  return executeFuntionInInspectWindow(checkGraphByHash, [hash]).then((res) => {
    if (res) {
      return true
    } else {
      return false
    }
  })
}

function getNowGraphData() {
  return executeFuntionInInspectWindow(getGlobalInstances)
}
function startFPSMonitor() {
  return executeFuntionInInspectWindow(doFPSThings)
}

getNowGraphData().then(function (data) {
  const container = document.getElementById('container')
  mount(data, container, {
    showRect,
    getAttrs,
    cleanRect,
    updateAttrs,
    consoleEl,
    checkGraphAlive,
    getNowGraphData,
    cleanAllRect,
    startFPSMonitor,
  })
})

startFPSMonitor()
