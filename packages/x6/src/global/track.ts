import { Config } from './config'
import { version } from './version'

function track() {
  if (Config.trackable) {
    const host = 'https://kcart.alipay.com/web/bi.do'
    const img = new Image()
    const metadata = {
      ...Config.trackInfo,
      version,
      pg: document.URL,
      r: new Date().getTime(),
      x6: true,
      page_type: 'syslog',
    }
    const data = encodeURIComponent(JSON.stringify([metadata]))
    img.src = `${host}?BIProfile=merge&d=${data}`
  }
}

if (process.env.NODE_ENV !== 'development' && Config.trackable) {
  setTimeout(track, 3000)
}
