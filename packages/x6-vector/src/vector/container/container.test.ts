import { Circle } from '../circle/circle'
import { G } from '../g/g'
import { Line } from '../line/line'
import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'

describe('Container', () => {
  let svg: SVG
  let rect1: Rect
  let group1: G
  let rect2: Rect
  let circle1: Circle
  let group2: G
  let circle2: Circle
  let group3: G
  let line1: Line
  let line2: Line
  let circle3: Circle
  let group4: G
  let rect3: Rect

  beforeEach(() => {
    svg = new SVG().appendTo(document.body)
    rect1 = svg.rect(100, 100).id('rect1')
    group1 = svg.group().id('group1')
    rect2 = group1.rect(100, 100).id('rect2')
    circle1 = group1.circle(50).id('circle1')
    group2 = group1.group().id('group2')
    circle2 = group2.circle(50).id('circle2')
    group3 = group2.group().id('group3')
    line1 = group3.line(1, 1, 2, 2).id('line1')
    line2 = group3.line(1, 1, 2, 2).id('line2')
    circle3 = group2.circle(50).id('circle3')
    group4 = svg.group().id('group4')
    rect3 = group4.rect(100, 100).id('rect3')

    /* should be:
        svg
          rect1
          group1
            rect2
            circle1
            group2
              circle2
              group3
                line1
                line2
              circle3
          group4
            rect3
      */
  })

  afterEach(() => {
    svg.remove()
  })

  describe('flatten()', () => {
    it('should flatten the whole document when called on the root', () => {
      svg.flatten()

      expect(svg.children()).toEqual([
        rect1,
        rect2,
        circle1,
        circle2,
        line1,
        line2,
        circle3,
        rect3,
      ])
    })

    it('should flatten a group and places all children into its parent when called on a group - 1', () => {
      group1.flatten()

      /* now should be:
        svg
          rect1
          group1
            rect2
            circle1
            circle2
            line1
            line2
            circle3
          group4
            rect3
      */

      expect(svg.children()).toEqual([rect1, group1, group4])
      expect(group1.children()).toEqual([
        rect2,
        circle1,
        circle2,
        line1,
        line2,
        circle3,
      ])
    })

    it('should flatten a group and places all children into its parent when called on a group - 2', () => {
      group2.flatten()

      /* now should be:
        svg
          rect1
          group1
            rect2
            circle1
            group2
              circle2
              line1
              line2
              circle3
          group4
            rect3
      */

      expect(group2.children()).toEqual([circle2, line1, line2, circle3])
    })
  })

  describe('ungroup()', () => {
    it('should ungroup a group and inserts all children in the correct order in the parent parent of the group', () => {
      group1.ungroup()

      expect(svg.children()).toEqual([rect1, rect2, circle1, group2, group4])

      group4.ungroup()

      expect(svg.children()).toEqual([rect1, rect2, circle1, group2, rect3])
    })

    it('should ungroup a group into another group and appends the elements to the other group', () => {
      group1.ungroup(group4)
      expect(group4.children()).toEqual([rect3, rect2, circle1, group2])
    })

    it('should ungroup a group into another group at the specified position', () => {
      group2.ungroup(group1, 1)
      expect(group1.children()).toEqual([
        rect2,
        circle2,
        group3,
        circle3,
        circle1,
      ])
    })
  })
})
