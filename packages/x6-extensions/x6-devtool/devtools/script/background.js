chrome.runtime.onMessage.addListener((req, sender) => {
  if (req.isAntVX6 && sender && sender.tab) {
    if (req.disabled) {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: 'icons/48-disabled.png',
      })
    } else {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: {
          16: 'icons/16.png',
          32: 'icons/32.png',
          48: 'icons/48.png',
          128: 'icons/128.png',
        },
      })
    }
  }
})
