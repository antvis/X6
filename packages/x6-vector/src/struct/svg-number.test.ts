import { SVGNumber } from './svg-number'

describe('SVGNumber', () => {
  let number: SVGNumber

  beforeEach(() => {
    number = new SVGNumber()
  })

  describe('constructor()', () => {
    it('should create a SVGNumber with default values', () => {
      expect(number.value).toBe(0)
      expect(number.unit).toBe('')
    })

    it('should create a SVGNumber from array', () => {
      number = new SVGNumber([30, '%'])
      expect(number.value).toBe(30)
      expect(number.unit).toBe('%')
    })

    it('should create a SVGNumber from object', () => {
      number = new SVGNumber({ value: 30, unit: '%' })
      expect(number.value).toBe(30)
      expect(number.unit).toBe('%')
    })

    it('should accept the unit as a second argument', () => {
      number = new SVGNumber(30, '%')
      expect(number.value).toBe(30)
      expect(number.unit).toBe('%')
    })

    it('should parse a pixel value', () => {
      number = new SVGNumber('20px')
      expect(number.value).toBe(20)
      expect(number.unit).toBe('px')
    })

    it('should parse a percent value', () => {
      number = new SVGNumber('99%')
      expect(number.value).toBe(0.99)
      expect(number.unit).toBe('%')
    })

    it('should parse a seconds value', () => {
      number = new SVGNumber('2s')
      expect(number.value).toBe(2000)
      expect(number.unit).toBe('s')
    })

    it('should parse a negative percent value', () => {
      number = new SVGNumber('-89%')
      expect(number.value).toBe(-0.89)
      expect(number.unit).toBe('%')
    })

    it('should fall back to 0 if given value is NaN', () => {
      number = new SVGNumber(NaN)
      expect(number.value).toBe(0)
    })

    it('should fall back to maximum value if given number is positive infinite', () => {
      number = new SVGNumber(1.7976931348623157e10308)
      expect(number.value).toBe(3.4e38)
    })

    it('should fall back to minimum value if given number is negative infinite', () => {
      number = new SVGNumber(-1.7976931348623157e10308)
      expect(number.value).toBe(-3.4e38)
    })
  })

  describe('toString()', () => {
    it('should convert the number to a string', () => {
      expect(number.toString()).toBe('0')
    })

    it('should append the unit', () => {
      number.value = 1.21
      number.unit = 'px'
      expect(number.toString()).toBe('1.21px')
    })

    it('should convert percent values properly', () => {
      number.value = 1.36
      number.unit = '%'
      expect(number.toString()).toBe('136%')
    })

    it('should convert second values properly', () => {
      number.value = 2500
      number.unit = 's'
      expect(number.toString()).toBe('2.5s')
    })
  })

  describe('toJSON()', () => {
    it('should create an object representation of SVGNumver', () => {
      const obj1 = number.toJSON()
      expect(obj1.value).toBe(0)
      expect(obj1.unit).toBe('')

      const obj2 = new SVGNumber(1, 'px').toJSON()
      expect(obj2.value).toBe(1)
      expect(obj2.unit).toBe('px')
    })
  })

  describe('toArray()', () => {
    it('should create an array representation of SVGNumver', () => {
      const arr1 = number.toArray()
      expect(arr1[0]).toBe(0)
      expect(arr1[1]).toBe('')

      const arr2 = new SVGNumber(1, 'px').toArray()
      expect(arr2[0]).toBe(1)
      expect(arr2[1]).toBe('px')
    })
  })

  describe('valueOf()', () => {
    it('should return a numeric value for default units', () => {
      expect(number.valueOf()).toBe(0)
      number = new SVGNumber('12')
      expect(number.valueOf()).toBe(12)
      number = new SVGNumber(13)
      expect(number.valueOf()).toBe(13)
    })

    it('should return a numeric value for pixel units', () => {
      number = new SVGNumber('10px')
      expect(number.valueOf()).toBe(10)
    })

    it('should return a numeric value for percent units', () => {
      number = new SVGNumber('20%')
      expect(number.valueOf()).toBe(0.2)
    })

    it('should convert to a primitive when multiplying', () => {
      number.value = 80
      expect((number as any) * 4).toBe(320)
    })
  })

  describe('plus()', () => {
    it('should return a new instance', () => {
      expect(number.plus(4.5)).not.toBe(number)
      expect(number.plus(4.5) === number).toBeFalse()
    })

    it('should add a given number', () => {
      expect(number.plus(3.5).valueOf()).toBe(3.5)
    })

    it('should add a given percentage value', () => {
      expect(number.plus('225%').valueOf()).toBe(2.25)
    })

    it('should add a given pixel value', () => {
      expect(number.plus('83px').valueOf()).toBe(83)
    })

    it('should use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').plus('3%').unit).toBe('s')
    })

    it('should use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.plus('15%').unit).toBe('%')
    })
  })

  describe('minus()', () => {
    it('should subtract a given number', () => {
      expect(number.minus(3.7).valueOf()).toBe(-3.7)
    })

    it('should subtract a given percentage value', () => {
      expect(number.minus('223%').valueOf()).toBe(-2.23)
    })

    it('should subtract a given pixel value', () => {
      expect(number.minus('85px').valueOf()).toBe(-85)
    })

    it('should use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').minus('3%').unit).toBe('s')
    })

    it('should use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.minus('15%').unit).toBe('%')
    })
  })

  describe('times()', () => {
    beforeEach(() => {
      number = number.plus(4)
    })

    it('should multiplie with a given number', () => {
      expect(number.times(3).valueOf()).toBe(12)
    })

    it('should multiplie with a given percentage value', () => {
      expect(number.times('110%').valueOf()).toBe(4.4)
    })

    it('should multiplie with a given pixel value', () => {
      expect(number.times('85px').valueOf()).toBe(340)
    })

    it('should use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').times('3%').unit).toBe('s')
    })

    it('should use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.times('15%').unit).toBe('%')
    })
  })

  describe('divide()', () => {
    beforeEach(() => {
      number = number.plus(90)
    })

    it('should divide by a given number', () => {
      expect(number.divide(3).valueOf()).toBe(30)
    })

    it('should divide by a given percentage value', () => {
      expect(number.divide('3000%').valueOf()).toBe(3)
    })

    it('should divide by a given pixel value', () => {
      expect(number.divide('45px').valueOf()).toBe(2)
    })

    it('should use the unit of this number as the unit of the returned number by default', () => {
      expect(new SVGNumber('12s').divide('3%').unit).toBe('s')
    })

    it('should use the unit of the passed number as the unit of the returned number when this number as no unit', () => {
      expect(number.divide('15%').unit).toBe('%')
    })
  })

  describe('convert()', () => {
    it('should change the unit of the number', () => {
      const number = new SVGNumber('12px').convert('%')
      expect(number.toString()).toBe('1200%')
    })
  })

  describe('Static Methods', () => {
    describe('create()', () => {
      it('should create a SVGNumber with default values', () => {
        number = SVGNumber.create()
        expect(number.value).toBe(0)
        expect(number.unit).toBe('')
      })

      it('should create a SVGNumber from array', () => {
        number = SVGNumber.create([30, '%'])
        expect(number.value).toBe(30)
        expect(number.unit).toBe('%')
      })

      it('should create a SVGNumber from object', () => {
        number = SVGNumber.create({ value: 30, unit: '%' })
        expect(number.value).toBe(30)
        expect(number.unit).toBe('%')
      })

      it('should accept the unit as a second argument', () => {
        number = SVGNumber.create(30, '%')
        expect(number.value).toBe(30)
        expect(number.unit).toBe('%')
      })

      it('should parse a pixel value', () => {
        number = SVGNumber.create('20px')
        expect(number.value).toBe(20)
        expect(number.unit).toBe('px')
      })

      it('should parse a percent value', () => {
        number = SVGNumber.create('99%')
        expect(number.value).toBe(0.99)
        expect(number.unit).toBe('%')
      })

      it('should parse a seconds value', () => {
        number = SVGNumber.create('2s')
        expect(number.value).toBe(2000)
        expect(number.unit).toBe('s')
      })

      it('should parse a negative percent value', () => {
        number = SVGNumber.create('-89%')
        expect(number.value).toBe(-0.89)
        expect(number.unit).toBe('%')
      })

      it('should fall back to 0 if given value is NaN', () => {
        number = SVGNumber.create(NaN)
        expect(number.value).toBe(0)
      })

      it('should fall back to maximum value if given number is positive infinite', () => {
        number = SVGNumber.create(1.7976931348623157e10308)
        expect(number.value).toBe(3.4e38)
      })

      it('should fall back to minimum value if given number is negative infinite', () => {
        number = SVGNumber.create(-1.7976931348623157e10308)
        expect(number.value).toBe(-3.4e38)
      })
    })

    describe('toNumber()', () => {
      it('should return it if given value is a number', () => {
        expect(SVGNumber.toNumber(1)).toBe(1)
      })

      it('should conver it to number take unit into account if given value is a string', () => {
        expect(SVGNumber.toNumber('1')).toBe(1)
        expect(SVGNumber.toNumber('1%')).toBe(0.01)
        expect(SVGNumber.toNumber('1s')).toBe(1000)
        expect(SVGNumber.toNumber('1px')).toBe(1)
      })

      it('should ignore unknown unit', () => {
        expect(SVGNumber.toNumber('1k')).toBe(1)
      })

      it('should fall back to 0 if given value is NaN', () => {
        expect(SVGNumber.toNumber(NaN)).toBe(0)
      })

      it('should fall back to maximum value if given number is positive infinite', () => {
        expect(SVGNumber.toNumber(1.7976931348623157e10308)).toBe(3.4e38)
      })

      it('should fall back to minimum value if given number is negative infinite', () => {
        expect(SVGNumber.toNumber(-1.7976931348623157e10308)).toBe(-3.4e38)
      })
    })

    describe('plus()', () => {
      it('should plus with two number values', () => {
        expect(SVGNumber.plus(1, 2)).toBe(3)
      })

      it('should plus with a number and a string take unit into account', () => {
        expect(SVGNumber.plus(1, '2')).toBe('3')
        expect(SVGNumber.plus('1', 2)).toBe('3')

        expect(SVGNumber.plus(1, '2%')).toBe('102%')
        expect(SVGNumber.plus('1%', 2)).toBe('200.999999%')

        expect(SVGNumber.plus(1, '2s')).toBe('2.001s')
        expect(SVGNumber.plus('1s', 2)).toBe('1.002s')

        expect(SVGNumber.plus(1, '2px')).toBe('3px')
        expect(SVGNumber.plus('1px', 2)).toBe('3px')
      })

      it('should plus with two strings take unit into account', () => {
        expect(SVGNumber.plus('1', '2')).toBe('3')
        expect(SVGNumber.plus('1', '2')).toBe('3')

        expect(SVGNumber.plus('1', '2%')).toBe('102%')
        expect(SVGNumber.plus('1%', '2')).toBe('200.999999%')

        expect(SVGNumber.plus('1', '2s')).toBe('2.001s')
        expect(SVGNumber.plus('1s', '2')).toBe('1.002s')

        expect(SVGNumber.plus('1', '2px')).toBe('3px')
        expect(SVGNumber.plus('1px', '2')).toBe('3px')

        expect(SVGNumber.plus('1s', '2%')).toBe('1.00002s')
        expect(SVGNumber.plus('1px', '2s')).toBe('2001px')
      })
    })

    describe('minus()', () => {
      it('should minus with two number values', () => {
        expect(SVGNumber.minus(1, 2)).toBe(-1)
      })

      it('should minus with a number and a string take unit into account', () => {
        expect(SVGNumber.minus(1, '2')).toBe('-1')
        expect(SVGNumber.minus('1', 2)).toBe('-1')

        expect(SVGNumber.minus(1, '2%')).toBe('98%')
        expect(SVGNumber.minus('1%', 2)).toBe('-199%')

        expect(SVGNumber.minus(1, '2s')).toBe('-1.999s')
        expect(SVGNumber.minus('1s', 2)).toBe('0.998s')

        expect(SVGNumber.minus(1, '2px')).toBe('-1px')
        expect(SVGNumber.minus('1px', 2)).toBe('-1px')
      })

      it('should minus with two strings take unit into account', () => {
        expect(SVGNumber.minus('1', '2')).toBe('-1')
        expect(SVGNumber.minus('1', '2')).toBe('-1')

        expect(SVGNumber.minus('1', '2%')).toBe('98%')
        expect(SVGNumber.minus('1%', '2')).toBe('-199%')

        expect(SVGNumber.minus('1', '2s')).toBe('-1.999s')
        expect(SVGNumber.minus('1s', '2')).toBe('0.998s')

        expect(SVGNumber.minus('1', '2px')).toBe('-1px')
        expect(SVGNumber.minus('1px', '2')).toBe('-1px')

        expect(SVGNumber.minus('1s', '2%')).toBe('0.99998s')
        expect(SVGNumber.minus('1px', '2s')).toBe('-1999px')
      })
    })

    describe('times()', () => {
      it('should times with two number values', () => {
        expect(SVGNumber.times(1, 2)).toBe(2)
      })

      it('should times with a number and a string take unit into account', () => {
        expect(SVGNumber.times(1, '2')).toBe('2')
        expect(SVGNumber.times('1', 2)).toBe('2')

        expect(SVGNumber.times(1, '2%')).toBe('2%')
        expect(SVGNumber.times('1%', 2)).toBe('2%')

        expect(SVGNumber.times(1, '2s')).toBe('2s')
        expect(SVGNumber.times('1s', 2)).toBe('2s')

        expect(SVGNumber.times(1, '2px')).toBe('2px')
        expect(SVGNumber.times('1px', 2)).toBe('2px')
      })

      it('should times with two strings take unit into account', () => {
        expect(SVGNumber.times('1', '2')).toBe('2')
        expect(SVGNumber.times('1', '2')).toBe('2')

        expect(SVGNumber.times('1', '2%')).toBe('2%')
        expect(SVGNumber.times('1%', '2')).toBe('2%')

        expect(SVGNumber.times('1', '2s')).toBe('2s')
        expect(SVGNumber.times('1s', '2')).toBe('2s')

        expect(SVGNumber.times('1', '2px')).toBe('2px')
        expect(SVGNumber.times('1px', '2')).toBe('2px')

        expect(SVGNumber.times('1s', '2%')).toBe('0.02s')
        expect(SVGNumber.times('1px', '2s')).toBe('2000px')
      })
    })

    describe('divide()', () => {
      it('should divide with two number values', () => {
        expect(SVGNumber.divide(1, 2)).toBe(0.5)
      })

      it('should divide with a number and a string take unit into account', () => {
        expect(SVGNumber.divide(1, '2')).toBe('0.5')
        expect(SVGNumber.divide('1', 2)).toBe('0.5')

        expect(SVGNumber.divide(1, '2%')).toBe('5000%')
        expect(SVGNumber.divide('1%', 2)).toBe('0.5%')

        expect(SVGNumber.divide(1, '2s')).toBe('5e-7s')
        expect(SVGNumber.divide('1s', 2)).toBe('0.5s')

        expect(SVGNumber.divide(1, '2px')).toBe('0.5px')
        expect(SVGNumber.divide('1px', 2)).toBe('0.5px')
      })

      it('should divide with two strings take unit into account', () => {
        expect(SVGNumber.divide('1', '2')).toBe('0.5')
        expect(SVGNumber.divide('1', '2')).toBe('0.5')

        expect(SVGNumber.divide('1', '2%')).toBe('5000%')
        expect(SVGNumber.divide('1%', '2')).toBe('0.5%')

        expect(SVGNumber.divide('1', '2s')).toBe('5e-7s')
        expect(SVGNumber.divide('1s', '2')).toBe('0.5s')

        expect(SVGNumber.divide('1', '2px')).toBe('0.5px')
        expect(SVGNumber.divide('1px', '2')).toBe('0.5px')

        expect(SVGNumber.divide('1s', '2%')).toBe('50s')
        expect(SVGNumber.divide('1px', '2s')).toBe('0.0005px')
      })
    })
  })
})
