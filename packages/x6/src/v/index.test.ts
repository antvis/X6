import { Path } from '../geometry'
import { V } from '.'

let fixture: HTMLDivElement
let svgContainer: SVGSVGElement
let svgPath: SVGPathElement
let svgGroup: SVGGElement
let svgCircle: SVGCircleElement
let svgEllipse: SVGEllipseElement
let svgPolygon: SVGPolygonElement
let svgText: SVGTextElement
let svgRectangle: SVGRectElement
let svgGroup1: SVGGElement
let svgGroup2: SVGGElement
let svgGroup3: SVGGElement
let svgPath2: SVGPathElement
let svgPath3: SVGPathElement
// let svgLinearGradient: SVGLinearGradientElement

beforeAll(async done => {
  fixture = document.createElement('div')
  fixture.id = 'test-fixture'

  const svgContent =
    '<path id="svg-path" d="M10 10"/>' +
    '<!-- comment -->' +
    '<g id="svg-group">' +
    '  <ellipse id="svg-ellipse" x="10" y="10" rx="30" ry="30"/>' +
    '  <circle id="svg-circle" cx="10" cy="10" r="2" fill="red"/>' +
    '</g>' +
    '<polygon id="svg-polygon" points="200,10 250,190 160,210"/>' +
    '<text id="svg-text" x="0" y="15" fill="red">Test</text>' +
    '<rect id="svg-rectangle" x="100" y="100" width="50" height="100"/>' +
    '<g id="svg-group-1" class="group-1">' +
    '  <g id="svg-group-2" class="group-2">' +
    '    <g id="svg-group-3" class="group3">' +
    '      <path id="svg-path-2" d="M 100 100 C 100 100 0 150 100 200 Z"/>' +
    '    </g>' +
    '  </g>' +
    '</g>' +
    '<path id="svg-path-3"/>' +
    '<linearGradient id= "svg-linear-gradient"><stop/></linearGradient>'

  document.body.appendChild(fixture)
  fixture.appendChild(
    V.create('svg', { id: 'svg-container' }, V.createBatch(svgContent)).node,
  )

  svgContainer = (document.getElementById(
    'svg-container',
  ) as any) as SVGSVGElement
  svgPath = (document.getElementById('svg-path') as any) as SVGPathElement
  svgGroup = (document.getElementById('svg-group') as any) as SVGGElement
  svgCircle = (document.getElementById('svg-circle') as any) as SVGCircleElement
  svgEllipse = (document.getElementById(
    'svg-ellipse',
  ) as any) as SVGEllipseElement
  svgPolygon = (document.getElementById(
    'svg-polygon',
  ) as any) as SVGPolygonElement
  svgText = (document.getElementById('svg-text') as any) as SVGTextElement
  svgRectangle = (document.getElementById(
    'svg-rectangle',
  ) as any) as SVGRectElement
  svgGroup1 = (document.getElementById('svg-group-1') as any) as SVGGElement
  svgGroup2 = (document.getElementById('svg-group-2') as any) as SVGGElement
  svgGroup3 = (document.getElementById('svg-group-3') as any) as SVGGElement
  svgPath2 = (document.getElementById('svg-path-2') as any) as SVGPathElement
  svgPath3 = (document.getElementById('svg-path-3') as any) as SVGPathElement
  // svgLinearGradient = (document.getElementById(
  //   'svg-linear-gradient',
  // ) as any) as SVGLinearGradientElement

  done()
})

afterAll(() => {
  V.remove(fixture)
})

describe('#convertToPathData', () => {
  function roundPathData(pathData: string | null) {
    return pathData != null
      ? pathData
          .split(' ')
          .map(command => {
            const number = parseInt(command, 10)
            if (isNaN(number)) return command
            return number.toFixed(0)
          })
          .join(' ')
      : null
  }

  it('should throw an exception on convert an invalid SvgElement', () => {
    expect(() => {
      const group = V.create('<group/>')
      V.convertToPathData(group.node as any)
    }).toThrowError()
  })

  it('should convert SVGPathElement', () => {
    const path = V.create('path', { d: 'M 100 50 L 200 150' })
    expect(path.convertToPathData()).toEqual('M 100 50 L 200 150')
  })

  it('should convert SVGLineElement', () => {
    const line = V.create('line', { x1: 100, y1: 50, x2: 200, y2: 150 })
    expect(line.convertToPathData()).toEqual('M 100 50 L 200 150')
  })

  it('should convert SVGRectElement', () => {
    const rect = V.create('rect', {
      x: 100,
      y: 50,
      width: 200,
      height: 150,
    })
    expect(rect.convertToPathData()).toEqual(
      'M 100 50 H 300 V 200 H 100 V 50 Z',
    )
  })

  it('should convert SVGRectElement with `rx` and `ry` attributes', () => {
    const rect = V.create('<rect/>', {
      x: 100,
      y: 50,
      width: 200,
      height: 150,
      rx: 200,
      ry: 200,
    })
    expect(rect.convertToPathData()).toEqual(
      'M 100 125 v 0 a 100 75 0 0 0 100 75 h 0 a 100 75 0 0 0 100 -75 v 0 a 100 75 0 0 0 -100 -75 h 0 a 100 75 0 0 0 -100 75 Z',
    )
  })

  it('should convert SVGCircleElement', () => {
    const circle = V.create('circle', { cx: 100, cy: 50, r: 50 })
    expect(roundPathData(circle.convertToPathData())).toEqual(
      'M 100 0 C 127 0 150 22 150 50 C 150 77 127 100 100 100 C 72 100 50 77 50 50 C 50 22 72 0 100 0 Z',
    )
  })

  it('should convert SVGEllipseElement', () => {
    const ellipse = V.create('ellipse', {
      cx: 100,
      cy: 50,
      rx: 100,
      ry: 50,
    })
    expect(roundPathData(ellipse.convertToPathData())).toEqual(
      'M 100 0 C 155 0 200 22 200 50 C 200 77 155 100 100 100 C 44 100 0 77 0 50 C 0 22 44 0 100 0 Z',
    )
  })

  it.skip('should convert SVGPolygonElement', () => {
    const polygon = V.create('polygon', {
      points: '200,10 250,190 160,210',
    })
    expect(polygon.convertToPathData()).toEqual('M 200 10 L250 190 L160 210 Z')
  })

  it.skip('should convert SVGPolylineElement', () => {
    const polyline = V.create('polyline', {
      points: '100,10 200,10 150,110',
    })
    expect(polyline.convertToPathData()).toEqual('M 100 10 L200 10 L150 110')
  })
})

describe('#transformStringToMatrix', () => {
  let svgTestGroup: V

  beforeEach(() => {
    svgTestGroup = V.create('g')
    svgContainer.appendChild(svgTestGroup.node)
  })

  afterEach(() => {
    svgTestGroup.remove()
  })

  const arr = [
    '',
    'scale(2)',
    'scale(2,3)',
    'scale(2.5,3.1)',
    'translate(10, 10)',
    'translate(10,10)',
    'translate(10.2,11.6)',
    'rotate(10)',
    'rotate(10,100,100)',
    'skewX(40)',
    'skewY(60)',
    'scale(2,2) matrix(1 0 0 1 10 10)',
    'matrix(1 0 0 1 10 10) scale(2,2)',
    'rotate(10,100,100) matrix(1 0 0 1 10 10) scale(2,2) translate(10,20)',
  ]

  arr.forEach(transformString => {
    it.skip(`should convert "${transformString}" to matrix`, () => {
      svgTestGroup.attr('transform', transformString)
      expect(V.transformStringToMatrix(transformString)).toEqual(
        (svgTestGroup.node as SVGGraphicsElement).getCTM(),
      )
    })
  })
})

describe('#matrixToTransformString', () => {
  it.skip('should return correct transformation string', () => {
    expect(V.matrixToTransformString()).toEqual('matrix(1,0,0,1,0,0)')
    expect(V.matrixToTransformString({ a: 2, d: 2 })).toEqual(
      'matrix(2,0,0,2,0,0)',
    )

    expect(
      V.matrixToTransformString({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }),
    ).toEqual('matrix(1,2,3,4,5,6)')

    expect(
      V.matrixToTransformString(
        V.createSVGMatrix({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }),
      ),
    ).toEqual('matrix(1,2,3,4,5,6)')
    expect(
      V.matrixToTransformString({ a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 }),
    ).toEqual('matrix(0,1,1,0,0,0)')
  })
})

describe('#matrixTo[Transformation]', () => {
  function roundObject(obj: any) {
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        obj[i] = Math.round(obj[i])
      }
    }
    return obj
  }

  it.skip('should convert matrix to rotation metadata', () => {
    let angle
    angle = V.matrixToRotate(V.createSVGMatrix().rotate(45))
    expect(roundObject(angle)).toEqual({ angle: 45 })

    angle = V.matrixToRotate(
      V.createSVGMatrix()
        .translate(50, 50)
        .rotate(15),
    )
    expect(roundObject(angle)).toEqual({ angle: 15 })

    angle = V.matrixToRotate(
      V.createSVGMatrix()
        .translate(50, 50)
        .rotate(60)
        .scale(2),
    )
    expect(roundObject(angle)).toEqual({ angle: 60 })

    angle = V.matrixToRotate(
      V.createSVGMatrix()
        .rotate(60)
        .rotate(60),
    )
    expect(roundObject(angle)).toEqual({ angle: 120 })
  })

  it.skip('should convert matrix to translation medata', () => {
    let translate
    translate = V.matrixToTranslate(V.createSVGMatrix().translate(10, 20))
    expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 })

    translate = V.matrixToTranslate(
      V.createSVGMatrix()
        .translate(10, 20)
        .rotate(10, 20)
        .scale(2),
    )
    expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 })

    translate = V.matrixToTranslate(
      V.createSVGMatrix()
        .translate(10, 20)
        .translate(30, 40),
    )
    expect(roundObject(translate)).toEqual({ tx: 40, ty: 60 })
  })

  it.skip('should convert matrix to scaling metadata', () => {
    let scale
    scale = V.matrixToScale(V.createSVGMatrix().scale(2))
    expect(roundObject(scale)).toEqual({ sx: 2, sy: 2 })

    scale = V.matrixToScale(
      V.createSVGMatrix()
        .translate(15, 15)
        .scaleNonUniform(2, 3)
        .rotate(10, 20),
    )
    expect(roundObject(scale)).toEqual({ sx: 2, sy: 3 })

    scale = V.matrixToScale(
      V.createSVGMatrix()
        .scale(2, 2)
        .scale(3, 3),
    )
    expect(roundObject(scale)).toEqual({ sx: 6, sy: 6 })
  })
})

describe('#normalizePath', () => {
  it('should return this for any SVGElement', () => {
    expect(V.create(svgPath).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgPath2).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgPath3).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgContainer).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgGroup).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgCircle).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgEllipse).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgPolygon).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgText).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgRectangle).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgGroup1).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgGroup2).normalizePath()).toBeInstanceOf(V)
    expect(V.create(svgGroup3).normalizePath()).toBeInstanceOf(V)
  })

  it('shoule normalize path "d" attribute', () => {
    expect(
      V.create(svgPath)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(true)
    expect(
      V.create(svgPath2)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(true)
    expect(
      V.create(svgPath3)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(true)

    expect(
      V.create(svgPath)
        .normalizePath()
        .attr('d'),
    ).toEqual('M 10 10')
    expect(
      V.create(svgPath2)
        .normalizePath()
        .attr('d'),
    ).toEqual('M 100 100 C 100 100 0 150 100 200 Z')
    expect(
      V.create(svgPath3)
        .normalizePath()
        .attr('d'),
    ).toEqual('M 0 0')
  })

  it('should only normalize SVGPathElement', () => {
    expect(
      V.create(svgContainer)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgGroup)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgCircle)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgEllipse)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgPolygon)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgText)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgRectangle)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgGroup1)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgGroup2)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
    expect(
      V.create(svgGroup3)
        .normalizePath()
        .node.hasAttribute('d'),
    ).toBe(false)
  })
})

describe('#normalizePathData', () => {
  const paths = [
    ['M 10 10 H 20', 'M 10 10 L 20 10'],
    ['M 10 10 V 20', 'M 10 10 L 10 20'],
    [
      'M 10 20 C 10 10 25 10 25 20 S 40 30 40 20',
      'M 10 20 C 10 10 25 10 25 20 C 25 30 40 30 40 20',
    ],
    [
      'M 20 20 Q 40 0 60 20',
      'M 20 20 C 33.33333333333333 6.666666666666666 46.666666666666664 6.666666666666666 60 20',
    ],
    [
      'M 20 20 Q 40 0 60 20 T 100 20',
      'M 20 20 C 33.33333333333333 6.666666666666666 46.666666666666664 6.666666666666666 60 20 C 73.33333333333333 33.33333333333333 86.66666666666666 33.33333333333333 100 20',
    ],
    [
      'M 30 15 A 15 15 0 0 0 15 30',
      'M 30 15 C 21.715728752538098 15.000000000000002 14.999999999999998 21.715728752538098 15 30',
    ],
    ['m 10 10', 'M 10 10'],
    ['M 10 10 m 10 10', 'M 10 10 M 20 20'],
    ['M 10 10 l 10 10', 'M 10 10 L 20 20'],
    ['M 10 10 c 0 10 10 10 10 0', 'M 10 10 C 10 20 20 20 20 10'],
    ['M 10 10 z', 'M 10 10 Z'],
    ['M 10 10 20 20', 'M 10 10 L 20 20'],
    ['M 10 10 L 20 20 30 30', 'M 10 10 L 20 20 L 30 30'],
    [
      'M 10 10 C 10 20 20 20 20 10 20 0 30 0 30 10',
      'M 10 10 C 10 20 20 20 20 10 C 20 0 30 0 30 10',
    ],

    // edge cases
    ['L 10 10', 'M 0 0 L 10 10'],
    ['C 10 20 20 20 20 10', 'M 0 0 C 10 20 20 20 20 10'],
    ['Z', 'M 0 0 Z'],
    ['M 10 10 Z L 20 20', 'M 10 10 Z L 20 20'],
    ['M 10 10 Z C 10 20 20 20 20 10', 'M 10 10 Z C 10 20 20 20 20 10'],
    ['M 10 10 Z Z', 'M 10 10 Z Z'],
    ['', 'M 0 0'], // empty string
    ['X', 'M 0 0'], // invalid command
    ['M', 'M 0 0'], // no arguments for a command that needs them
    ['M 10', 'M 0 0'], // too few arguments
    ['M 10 10 20', 'M 10 10'], // too many arguments
    ['X M 10 10', 'M 10 10'], // mixing invalid and valid commands

    // invalid commands interspersed with valid commands
    ['X M 10 10 X L 20 20', 'M 10 10 L 20 20'],
    ['A 0 3 0 0 1 10 15', 'M 0 0 L 10 15'], // 0 x radius
    ['A 3 0 0 0 1 10 15', 'M 0 0 L 10 15'], // 0 y radius
    ['A 0 0 0 0 1 10 15', 'M 0 0 L 10 15'], // 0 x and y radii

    // Make sure this does not throw an error because of
    // recursion in a2c() exceeding the maximum stack size
    ['M 0 0 A 1 1 0 1 0 -1 -1'],
    ['M 14.4 29.52 a .72 .72 0 1 0 -.72 -.72 A .72 .72 0 0 0 14.4 29.52Z'],
  ]

  it('should normalize path data', () => {
    paths.forEach(path => {
      if (path[1]) {
        expect(V.normalizePathData(path[0])).toEqual(path[1])
      } else {
        V.normalizePathData(path[0])
      }
    })
  })

  it('should parsed by Path', () => {
    const path1 = 'M 10 10'
    const normalizedPath1 = V.normalizePathData(path1)
    const reconstructedPath1 = Path.parse(normalizedPath1).serialize()
    expect(normalizedPath1).toEqual(reconstructedPath1)

    const path2 = 'M 100 100 C 100 100 0 150 100 200 Z'
    const normalizedPath2 = V.normalizePathData(path2)
    const reconstructedPath2 = Path.parse(normalizedPath2).serialize()
    expect(normalizedPath2).toEqual(reconstructedPath2)

    const path3 =
      'M285.8,83V52.7h8.3v31c0,3.2-1,5.8-3,7.7c-2,1.9-4.4,2.8-7.2,2.8c-2.9,0-5.6-1.2-8.1-3.5l3.8-6.1c1.1,1.3,2.3,1.9,3.7,1.9c0.7,0,1.3-0.3,1.8-0.9C285.5,85,285.8,84.2,285.8,83z'
    const normalizedPath3 = V.normalizePathData(path3)
    const reconstructedPath3 = Path.parse(normalizedPath3).serialize()
    expect(normalizedPath3).toEqual(reconstructedPath3)
  })
})

describe('#parseTransformString', () => {
  it('should parse scale, rotate, translate', () => {
    const parsed = V.parseTransformString(
      'scale(3) rotate(6) translate(9) xxx(11)',
    )

    expect(parsed.scale).toEqual({ sx: 3, sy: 3 })
    expect(parsed.rotate).toEqual({ angle: 6, cx: undefined, cy: undefined })
    expect(parsed.translate).toEqual({ tx: 9, ty: 0 })
  })
})
