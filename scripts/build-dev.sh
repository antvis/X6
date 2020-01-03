#!/bin/sh

lerna run build --scope @antv/x6-components

lerna run build --scope @antv/x6-detector
lerna run build --scope @antv/x6-struct
lerna run build --scope @antv/x6-types

lerna run build --scope @antv/x6-util
lerna run build --scope @antv/x6-events
lerna run build --scope @antv/x6-dom-event
lerna run build --scope @antv/x6-disposable
lerna run build --scope @antv/x6-base
lerna run build --scope @antv/x6-geometry

lerna run build --scope @antv/x6

lerna run build --scope @antv/x6-react-shape
lerna run build --scope @antv/x6-autosave
lerna run build --scope @antv/x6-clipboard
lerna run build --scope @antv/x6-minimap
lerna run build --scope @antv/x6-dnd
lerna run build --scope @antv/x6-undomanager