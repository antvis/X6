import React from 'react'
import classnames from 'classnames'
import { App } from '../index'
import './menu.less'

export class Menu extends React.Component<Menu.Props, Menu.State> {
  onLoadFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    const target = e.currentTarget as HTMLDivElement
    const input = target.querySelector('input') as HTMLInputElement
    target.blur()
    input.click()
  }

  onFileChanged = (e: React.ChangeEvent) => {
    const input = e.target as HTMLInputElement
    const file = input.files && input.files[0]

    if (!file) {
      return
    }

    new Response(file).text().then((data) => {
      this.props.onFileChanged({
        data,
        name: file.name,
      })
    })
  }

  onMarkupChanged = (e: React.ChangeEvent) => {
    const input = e.target as HTMLInputElement
    const val = input.value.trim()
    if (val.includes('</svg>')) {
      input.value = ''
      input.blur()
      this.props.onFileChanged({
        data: val,
        name: 'image.svg',
      })
    }
  }

  onLoadDemo = () => {
    const demos = [
      'cart',
      'cash',
      'chat',
      'circle',
      'cloud',
      'email',
      'flash',
      'heart',
      'home',
      'medal',
      'panorama',
      'settings',
      'start',
      'store',
    ]
    const index = Math.floor(Math.random() * demos.length)
    const file = `${demos[index]}.svg`
    fetch(`/images/${file}`)
      .then((res) => res.text())
      .then((data) => {
        console.log(data)
        this.props.onFileChanged({
          data,
          name: file,
        })
      })
  }

  render() {
    return (
      <div className={classnames('menu', { hidden: !this.props.visible })}>
        <div className="menu-overlay" onClick={this.props.onHideMenu}></div>
        <nav className="menu-wrap">
          <ul>
            <li>
              <div
                tabIndex={0}
                role="button"
                className="menu-item menu-item-file"
                onClick={this.onLoadFile}
              >
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"></path>
                </svg>
                <span className="text">Open SVG</span>
                <input
                  type="file"
                  accept=".svg"
                  onChange={this.onFileChanged}
                />
              </div>
            </li>
            <li>
              <div className="menu-item menu-item-input">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M19 2h-4.2C14.4.8 13.3 0 12 0c-1.3 0-2.4.8-2.8 2H5C4 2 3 3 3 4v16c0 1 1 2 2 2h14c1 0 2-1 2-2V4c0-1-1-2-2-2zm-7 0c.6 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path>
                </svg>
                <div className="input-wrap">
                  <textarea onChange={this.onMarkupChanged}></textarea>
                  <span className="placeholder">Paste markup</span>
                </div>
              </div>
            </li>
            <li>
              <div
                tabIndex={0}
                role="button"
                className="menu-item menu-item-demo"
                onClick={this.onLoadDemo}
              >
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.2.42-1.42 1L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"></path>
                </svg>
                <span className="text">Demo</span>
              </div>
            </li>
            <li>
              <a
                href="https://github.com/antvis/X6/tree/master/sites/x6-svg-to-shape"
                className="menu-item"
              >
                <svg viewBox="0 0 24 24" className="icon">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                </svg>
                <span className="text">About</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export namespace Menu {
  export interface Props {
    visible: boolean
    onHideMenu: () => void
    onFileChanged: (file: App.File) => void
  }

  export interface State {}
}
