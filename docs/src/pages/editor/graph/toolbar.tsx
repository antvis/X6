import React from 'react'
import { Toolbar, Icon, Menu } from '../../../components'
import { fetchEditor } from '..'
import { Editor } from '../editor'
import { Graph } from '../../../../../src'

const Item = Toolbar.Item
const Group = Toolbar.Group

export class GraphToolbar
  extends React.PureComponent<GraphToolbar.Props, GraphToolbar.State> {
  state: GraphToolbar.State = {
    scale: 1,
    editor: null,
    hasSelectedCell: false,
  }

  componentDidMount() {
    fetchEditor().then((editor) => {
      editor.graph.on(Graph.events.selectionChanged, () => {
        this.setState({ hasSelectedCell: editor.graph.hasSelectedCell() })
      })
      this.setState({ editor })
    })
  }

  handleClick = (name: string) => {
    const editor = this.state.editor!
    const graph = editor.graph
    const commands = editor.commands
    const cmd = commands.get(name)

    if (cmd) {
      if (name === 'redo' || name === 'undo') {
        cmd.handler(graph, commands.undoManager)
      } else {
        cmd.handler(graph)
      }
      if (
        name === 'resetView' ||
        name === 'zoomIn' ||
        name === 'zoomOut' ||
        name === 'fitWindow' ||
        name === 'fitPage' ||
        name === 'fitTwoPages' ||
        name === 'fitPageWidth'
      ) {
        this.setState({ scale: graph.view.scale })
      }


    } else if (
      name === '25' ||
      name === '50' ||
      name === '75' ||
      name === '100' ||
      name === '125' ||
      name === '150' ||
      name === '200' ||
      name === '300' ||
      name === '400'
    ) {
      const scale = parseInt(name, 10) / 100
      this.setState({ scale })
      const cmd = editor.commands.get('customZoom')
      if (cmd) {
        cmd.handler(graph, scale)
      }
    }
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item
    const Divider = Menu.Divider

    return (
      <Menu hasIcon={false}>
        <MenuItem name="resetView" hotkey="Cmd+H">Reset View</MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">Fit Window</MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    const editor = this.state.editor
    if (editor == null) {
      return null
    }

    const graph = editor.graph
    const commands = editor.commands
    const undoManager = commands.undoManager

    console.log(undoManager.canRedo())
    console.log(undoManager.canUndo())

    return (
      <Toolbar hoverEffect={true} size="small" onClick={this.handleClick}>
        <Group>
          <Item
            name="zoom"
            tooltipAsTitle={true}
            tooltip="Zoom (Alt+Mousewheel)"
            dropdown={this.renderZoomDropdown()}
          >
            <span
              style={{
                display: 'inline-block',
                width: 40,
                textAlign: 'right'
              }}
            >
              {(this.state.scale * 100).toFixed(0)}%
            </span>
          </Item>
        </Group>
        <Group>
          <Item
            name="zoomIn"
            tooltip="Zoom In (Cmd + (Numpad))"
            disabled={graph.view.scale === graph.maxScale}
            icon={<Icon icon={Icons.zoomIn} svg={true} />}
          />
          <Item
            name="zoomOut"
            tooltip="Zoom Out (Cmd - (Numpad))"
            disabled={graph.view.scale === graph.minScale}
            icon={<Icon icon={Icons.zoomOut} svg={true} />}
          />
        </Group>
        <Group>
          <Item
            name="undo"
            tooltip="Undo (Cmd+Z)"
            disabled={!undoManager.canUndo()}
            icon={<Icon icon={Icons.undo} svg={true} />}
          />
          <Item
            name="redo"
            tooltip="Redo (Cmd+Shift+Z)"
            disabled={!undoManager.canRedo()}
            icon={<Icon icon={Icons.redo} svg={true} />}
          />
        </Group>
        <Group>
          <Item
            name="delete"
            tooltip="Delete (Delete)"
            disabled={!this.state.hasSelectedCell}
            icon={<Icon icon={Icons.del} svg={true} />}
          />
        </Group>
        <Group>
          <Item
            name="toFront"
            tooltip="To Front (Cmd+Shift+F)"
            disabled={!this.state.hasSelectedCell}
            icon={<Icon icon={Icons.toFront} svg={true} />}
          />
          <Item
            name="toBack"
            tooltip="To Back (Cmd+Shift+B)"
            disabled={!this.state.hasSelectedCell}
            icon={<Icon icon={Icons.toBack} svg={true} />}
          />
        </Group>
        <Group>
          <Item
            name="fill"
            tooltip="Fill Color..."
            disabled={!this.state.hasSelectedCell}
            icon={<Icon icon={Icons.brush} svg={true} />}
          />
          <Item
            name="stroke"
            tooltip="Line Color..."
            disabled={!this.state.hasSelectedCell}
            icon={<Icon icon={Icons.pen} svg={true} />}
          />
          <Item
            name="shadow"
            tooltip="Shadow"
            disabled={!this.state.hasSelectedCell}
            icon={<Icon icon={Icons.shadow} svg={true} />}
          />
        </Group>
      </Toolbar>
    )
  }
}

export namespace GraphToolbar {
  export interface Props { }
  export interface State {
    scale: number
    editor: Editor | null
    hasSelectedCell: boolean
  }
}

namespace Icons {
  export const zoomIn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497.938 430.063l-112-112c-.313-.313-.637-.607-.955-.909C404.636 285.403 416 248.006 416 208 416 93.313 322.695 0 208 0S0 93.313 0 208s93.305 208 208 208c40.007 0 77.404-11.364 109.154-31.018.302.319.596.643.909.955l112 112C439.43 507.313 451.719 512 464 512c12.281 0 24.57-4.688 33.938-14.063 18.75-18.734 18.75-49.14 0-67.874zM64 208c0-79.406 64.602-144 144-144s144 64.594 144 144-64.602 144-144 144S64 287.406 64 208z"/><path d="M272 176h-32v-32c0-17.672-14.328-32-32-32s-32 14.328-32 32v32h-32c-17.672 0-32 14.328-32 32s14.328 32 32 32h32v32c0 17.672 14.328 32 32 32s32-14.328 32-32v-32h32c17.672 0 32-14.328 32-32s-14.328-32-32-32z"/></svg>`
  export const zoomOut = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497.938 430.063l-112-112c-.367-.367-.805-.613-1.18-.965C404.438 285.332 416 248.035 416 208 416 93.313 322.695 0 208 0S0 93.313 0 208s93.305 208 208 208c40.035 0 77.332-11.563 109.098-31.242.354.375.598.813.965 1.18l112 112C439.43 507.313 451.719 512 464 512c12.281 0 24.57-4.688 33.938-14.063 18.75-18.734 18.75-49.14 0-67.874zM64 208c0-79.406 64.602-144 144-144s144 64.594 144 144-64.602 144-144 144S64 287.406 64 208z"/><path d="M272 176H144c-17.672 0-32 14.328-32 32s14.328 32 32 32h128c17.672 0 32-14.328 32-32s-14.328-32-32-32z"/></svg>`
  export const undo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1023 498"><path d="M143 193c46-59.333 102.833-106.167 170.5-140.5S455.667.667 537 0c122 2.667 227.167 40.667 315.5 114S997.667 282 1023 398c-38.667-71.333-92.5-128-161.5-170S715 164.333 629 163c-71.333.667-136.833 15.833-196.5 45.5S322 278.667 280 330l127 127c4.667 4.667 7 10.333 7 17s-2.333 12.333-7 17-10.333 7-17 7H32c-9.333 0-17-3-23-9s-9-13.667-9-23V108c0-6.667 2.333-12.333 7-17s10.333-7 17-7 12.333 2.333 17 7l102 102z" fill-rule="nonzero"/></svg>`
  export const redo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1023 498"><path d="M999 84c-6.667 0-12.333 2.333-17 7L880 193C834 133.667 777.167 86.833 709.5 52.5S567.667.667 487 0C364.333 2.667 258.833 40.667 170.5 114S25.333 282 0 398c38.667-71.333 92.5-128 161.5-170S308 164.333 394 163c71.333.667 137 15.833 197 45.5S701.667 278.667 743 330L616 457c-4.667 4.667-7 10.333-7 17s2.333 12.333 7 17 10.333 7 17 7h358c9.333 0 17-3 23-9s9-13.667 9-23V108c0-6.667-2.333-12.333-7-17s-10.333-7-17-7z" fill-rule="nonzero"/></svg>`
  export const del = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 764 920"><path d="M666 280c-10.667 0-19.667 3.333-27 10-7.333 6.667-11.667 15.333-13 26l-47 476h-86l15-415c0-8.667-3-16.167-9-22.5-6-6.333-13.5-9.667-22.5-10-9-.333-16.667 2.333-23 8-6.333 5.667-9.5 13.167-9.5 22.5l-15 417h-95l-14-418c-.667-9.333-4.167-16.833-10.5-22.5-6.333-5.667-14-8.333-23-8-9 .333-16.333 3.667-22 10-5.667 6.333-8.5 13.833-8.5 22.5l14 416h-85l-47-476c-1.333-10.667-5.667-19.333-13-26-7.333-6.667-16.333-10-27-10h-3c-9.333 1.333-16.833 5.333-22.5 12-5.667 6.667-8.167 14.667-7.5 24l54 539c2 18.667 9.667 34 23 46s29.333 18.333 48 19h383c18.667-.667 34.667-7 48-19 13.333-12 21.333-27.333 24-46l53-542c0-9.333-3.167-17.167-9.5-23.5-6.333-6.333-13.833-9.5-22.5-9.5zm97-64l-7-55c-3.333-21.333-12.833-38.667-28.5-52-15.667-13.333-34.167-20.333-55.5-21H519l-3-29c-1.333-17.333-8-31.333-20-42C484 6.333 469.333.667 452 0H311c-17.333.667-31.833 6.333-43.5 17C255.833 27.667 249 41.667 247 59l-2 29H91c-21.333.667-39.667 7.667-55 21-15.333 13.333-24.667 30.667-28 52l-8 57c0 4.667 1.5 8.5 4.5 11.5S11.333 234 16 234h734c4-.667 7.333-2.667 10-6s3.667-7.333 3-12zM301 88l2-25c.667-4 3.333-6.333 8-7h142c4 .667 6.667 3 8 7l1 25H301z" fill-rule="nonzero"/></svg>`
  export const brush = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.143 9.667c-.733-1.392-1.914-3.05-3.617-4.753C14.549 1.936 12.048 1 10.741 1c-.414 0-.708.094-.86.246L8.52 2.606c-1.899-.236-3.42.106-4.294.983-.876.875-1.164 2.159-.792 3.523.492 1.806 2.305 4.049 5.905 5.375.038.323.157.638.405.885.588.588 1.535.586 2.121 0s.588-1.533.002-2.119a1.5 1.5 0 00-2.123-.001l-.17.256c-2.031-.765-3.395-1.828-4.232-2.9l3.879-3.875c.496 2.73 6.432 8.676 9.178 9.178l-7.115 7.107c-.234.153-2.798-.316-6.156-3.675-3.393-3.393-3.175-5.271-3.027-5.498L3.96 9.989C3.521 9.63 3.035 8.886 2.819 8.3L.685 10.431C.24 10.877 0 11.495 0 12.251c0 1.634 1.121 3.915 3.713 6.506C6.477 21.521 9.293 23 11.145 23c.648 0 1.18-.195 1.547-.562l8.086-8.078c.91.874-.778 3.538-.778 4.648a2 2 0 004-.001c0-3.184-1.425-6.81-2.857-9.34zM4.934 4.296c.527-.53 1.471-.791 2.656-.761L4.381 6.741c-.236-.978-.049-1.845.553-2.445zm9.292 4.079l-.03-.029C12.904 7.054 10.393 3.99 11.1 3.283c.715-.715 3.488 1.521 5.062 3.096.862.862 2.088 2.247 2.937 3.458-1.717-1.074-3.491-1.469-4.873-1.462z"/></svg>`
  export const pen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1022 883"><path d="M981 159L863 41c-28.667-27.333-61.667-41-99-41s-70.333 13.667-99 41L290 416c-9.333 9.333-15.167 20-17.5 32s-1.5 23.667 2.5 35l-77 77c-13.333 13.333-21 29-23 47s1.667 35 11 51L8 836c-5.333 5.333-8 11.667-8 19s2.5 13.667 7.5 19 11.5 8 19.5 8l279 1c6.667 0 12.333-2.333 17-7l41-40c16 9.333 32.833 13 50.5 11s33.5-9.667 47.5-23l77-77c11.333 4 23 4.833 35 2.5s22.667-8.167 32-17.5l375-375c27.333-28.667 41-61.667 41-99s-13.667-70.333-41-99zM422 762c-4.667 4.667-10.167 7-16.5 7s-11.833-2.333-16.5-7L260 633c-4.667-4.667-7-10.167-7-16.5s2.333-12.167 7-17.5l61-60 162 162-61 61zm139-86L346 461l282-282 215 214-282 283zm367-367l-34 34-215-215 34-34c14.667-14 31.667-21 51-21s36.333 7 51 21l113 113c14 14.667 21 31.667 21 51s-7 36.333-21 51z" fill-rule="nonzero"/></svg>`
  export const toFront = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M5 2C3.346 2 2 3.346 2 5v16c0 1.654 1.346 3 3 3h7v11c0 1.645 1.355 3 3 3h11v7c0 1.654 1.346 3 3 3h16c1.654 0 3-1.346 3-3V29c0-1.654-1.346-3-3-3h-7V15c0-1.645-1.355-3-3-3H24V5c0-1.654-1.346-3-3-3H5zm10 12h20c.565 0 1 .435 1 1v20c0 .565-.435 1-1 1H15c-.565 0-1-.435-1-1V15c0-.565.435-1 1-1z"/></svg>`
  export const toBack = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M5 2C3.346 2 2 3.346 2 5v16c0 1.654 1.346 3 3 3h7v11c0 1.645 1.355 3 3 3h11v7c0 1.654 1.346 3 3 3h16c1.654 0 3-1.346 3-3V29c0-1.654-1.346-3-3-3h-7V15c0-1.645-1.355-3-3-3H24V5c0-1.654-1.346-3-3-3H5zm19 12h11c.565 0 1 .435 1 1v11h-7c-1.654 0-3 1.346-3 3v7H15c-.565 0-1-.435-1-1V24h7c1.654 0 3-1.346 3-3v-7z"/></svg>`
  export const shadow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 168"><path d="M27.733 0h93.861c15.078 0 27.465 12.232 27.727 27.25 9.41 3.133 16.24 12.039 16.24 22.468v93.86c0 13.023-10.65 23.675-23.672 23.675H48.025c-11.088 0-20.456-7.72-22.993-18.055C11.044 147.827 0 135.924 0 121.594v-93.86C0 12.495 12.492 0 27.733 0zm93.861 8.117H27.733c-10.803 0-19.616 8.815-19.616 19.618v93.859c0 10.802 8.813 19.617 19.616 19.617h93.861c10.802 0 19.615-8.815 19.615-19.617v-93.86c0-10.802-8.813-19.617-19.615-19.617z" fill-rule="nonzero"/></svg>`
}
