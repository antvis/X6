import { Rect, Edge } from '@antv/x6/es/research/shape/standard'

export class Event extends Rect {
  static create(label: string) {
    return new Event({
      attrs: {
        label: {
          text: label,
        },
      },
    })
  }
}

Event.config({
  zIndex: 3,
  attrs: {
    root: {
      pointerEvents: 'bounding-box',
    },
    body: {
      strokeWidth: 2,
      fillOpacity: 0.2,
    },
    label: {
      textWrap: {
        height: -20,
        width: -20,
        ellipsis: true,
      },
      refX: '50%',
      refY: '50%',
      fontSize: 16,
      fontFamily: 'sans-serif',
      fill: '#333333',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
  },
})

export class IntermediateEvent extends Event {
  static create(label: string, type?: string) {
    return new IntermediateEvent({
      attrs: {
        label: {
          text: label,
        },
        gate: {
          gateType: type,
        },
      },
    })
  }
  gateTypes = {
    or:
      'M -20 0 C -20 -15 -10 -30 0 -30 C 10 -30 20 -15 20 0 C 10 -6 -10 -6 -20 0',
    xor:
      'M -20 0 C -20 -15 -10 -30 0 -30 C 10 -30 20 -15 20 0 C 10 -6 -10 -6 -20 0 M -20 0 0 -30 M 0 -30 20 0',
    and: 'M -20 0 C -20 -25 -10 -30 0 -30 C 10 -30 20 -25 20 0 Z',
    priority_and:
      'M -20 0 C -20 -25 -10 -30 0 -30 C 10 -30 20 -25 20 0 Z M -20 0 0 -30 20 0',
    inhibit: 'M -10 0 -20 -15 -10 -30 10 -30 20 -15 10 0 Z',
    transfer: 'M -20 0 20 0 0 -30 z',
  }

  gate(): string
  gate(type: string): this
  gate(type?: string) {
    if (type === undefined) {
      return this.attr<string>(['gate', 'gateType'])
    }

    this.attr(['gate'], {
      gateType: type,
      title: type.toUpperCase() + ' Gate',
    })

    return this
  }
}

IntermediateEvent.config(
  {
    size: {
      width: 100,
      height: 100,
    },
    markup: [
      {
        tagName: 'path',
        selector: 'gate',
      },
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      root: {
        title: 'Intermediate Event',
      },
      body: {
        refWidth: '100%',
        refHeight: -40,
        stroke: '#3c4260',
        fill: '#3c4260',
      },
      gate: {
        event: 'element:gate:click',
        gateType: 'xor',
        stroke: '#7c68fc',
        fill: '#7c68fc',
        fillOpacity: 0.2,
        strokeWidth: 2,
        refX: '50%',
        refY: '100%',
        fillRule: 'nonzero',
        cursor: 'pointer',
      },
      label: {
        textWrap: {
          height: -40,
          width: -10,
        },
        refY2: -20,
      },
    },
  },
  {
    gateType: {
      set(type: string) {
        var data = this.cell.gateTypes[type]
        return { d: data ? data + ' M 0 -30 0 -40' : 'M 0 0 0 0' }
      },
    },
  },
)

export class ExternalEvent extends Event {}

ExternalEvent.config({
  size: {
    width: 80,
    height: 100,
  },
  markup: [
    {
      tagName: 'path',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    root: {
      title: 'External Event',
    },
    body: {
      refD: 'M 0 0 10 -10 20 0 20 40 0 40 Z',
      stroke: '#fe854f',
      fill: '#fe854f',
    },
  },
})

export class UndevelopedEvent extends Event {}
UndevelopedEvent.config({
  size: {
    width: 140,
    height: 80,
  },
  markup: [
    {
      tagName: 'path',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    root: {
      title: 'Undeveloped Event',
    },
    body: {
      refD: 'M -1 0 0 1 1 0 0 -1 Z',
      stroke: '#feb663',
      fill: '#feb663',
    },
  },
})

export class BasicEvent extends Event {}
BasicEvent.config({
  zIndex: 3,
  size: {
    width: 80,
    height: 80,
  },
  markup: [
    {
      tagName: 'circle',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    root: {
      title: 'Basic Event',
    },
    body: {
      refCx: '50%',
      refCy: '50%',
      refR: '50%',
      stroke: '#30d0c6',
      fill: '#30d0c6',
    },
  },
})

export class ConditioningEvent extends Event {}
ConditioningEvent.config({
  zIndex: 2,
  size: {
    width: 140,
    height: 80,
  },
  markup: [
    {
      tagName: 'ellipse',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    root: {
      title: 'Conditioning Event',
    },
    body: {
      refCx: '50%',
      refCy: '50%',
      refRx: '50%',
      refRy: '50%',
      stroke: '#7c68fc',
      fill: '#7c68fc',
      fillOpacity: 0.2,
    },
  },
})

export class Connector extends Edge {
  static create(event1: Event, event2: Event) {
    return new Connector({
      zIndex: 1,
      source: {
        cell: event1.id,
        selector: event1 instanceof IntermediateEvent ? 'gate' : 'body',
      },
      target: {
        cell: event2.id,
        selector: 'body',
      },
    })
  }
}

Connector.config({
  attrs: {
    line: {
      connection: true,
      stroke: '#333333',
      strokeWidth: 2,
      strokeLinejoin: 'round',
    },
  },
  markup: [
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        'pointer-events': 'none',
      },
    },
  ],
})
