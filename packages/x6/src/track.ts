import { Globals } from './core/globals'
import { version } from './version'

const SERVER_URL = 'https://kcart.alipay.com/web/bi.do'

setTimeout(() => {
  if (Globals.trackable) {
    const image = new Image()
    const trackInfo = {
      ...Globals.trackInfo,
      version,
      pg: document.URL,
      r: new Date().getTime(),
      x6: true,
      page_type: 'syslog',
    }
    const d = encodeURIComponent(JSON.stringify([trackInfo]))
    image.src = `${SERVER_URL}?BIProfile=merge&d=${d}`
  }
}, 3000)
