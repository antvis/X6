import { Config } from './config'
import { version } from './version'

if (process.env.NODE_ENV !== 'development' && Config.trackable) {
  setTimeout(() => {
    const host = 'https://kcart.alipay.com/web/bi.do'
    const image = new Image()
    const meta = {
      ...Config.trackInfo,
      version,
      pg: document.URL,
      r: new Date().getTime(),
      x6: true,
      page_type: 'syslog',
    }
    const d = encodeURIComponent(JSON.stringify([meta]))
    image.src = `${host}?BIProfile=merge&d=${d}`
  }, 3000)
}
