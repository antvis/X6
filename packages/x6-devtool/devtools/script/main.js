/**
 * global instance and flag
 */

var panelInstance
var itv

function createPanelInstance() {
  if (panelInstance) {
    return
  }

  chrome.devtools.inspectedWindow.eval(
    `!!(window.__x6_instances__ && window.__x6_instances__.length)`,
    function (connected, err) {
      if (!connected) {
        return
      }

      clearInterval(itv)

      panelInstance = chrome.devtools.panels.create(
        'AntV X6',
        'icons/32.png',
        'panel.html',
        function (panel) {
          panel.onHidden.addListener(function () {
            chrome.devtools.inspectedWindow.eval(`(function() {
          var elements = document.getElementsByClassName('g_devtool_rect');
          [].forEach.apply(elements, [function (e) {
            e.remove();
          }])
        })()`)
          })
        },
      )

      chrome.runtime.sendMessage({
        isAntVX6: true,
        disabled: false,
      })
    },
  )
}

chrome.devtools.network.onNavigated.addListener(function () {
  // createPanelIfReactLoaded();
})

createPanelInstance()

itv = setInterval(createPanelInstance, 1000)
