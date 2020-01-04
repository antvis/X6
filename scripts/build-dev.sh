#!/bin/sh

lerna run build --scope @antv/x6-components

lerna run build --scope @antv/x6-detector
lerna run build --scope @antv/x6-types
lerna run build --scope @antv/x6-util
lerna run build --scope @antv/x6-events
lerna run build --scope @antv/x6-dom-event
lerna run build --scope @antv/x6-geometry

lerna run build --scope @antv/x6
lerna run build --scope @antv/x6-react-shape