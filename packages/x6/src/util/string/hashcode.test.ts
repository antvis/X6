import { hashcode } from './hashcode'

describe('StringExt', () => {
  describe('#hashcode', () => {
    it('should return number when hashcode a string ', () => {
      expect(hashcode('')).toBe(2166136261)

      expect(hashcode('🦄🌈')).toBe(202573874)
      expect(hashcode('👌😎')).toBe(898715661)

      expect(hashcode('h')).toBe(3977000791)
      expect(hashcode('he')).toBe(1547363254)
      expect(hashcode('hel')).toBe(179613742)
      expect(hashcode('hell')).toBe(477198310)
      expect(hashcode('hello')).toBe(1335831723)
      expect(hashcode('hello ')).toBe(3801292497)
      expect(hashcode('hello w')).toBe(1402552146)
      expect(hashcode('hello wo')).toBe(3611200775)
      expect(hashcode('hello wor')).toBe(1282977583)
      expect(hashcode('hello worl')).toBe(2767971961)
      expect(hashcode('hello world')).toBe(3582672807)

      expect(
        hashcode(
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.',
        ),
      ).toBe(2964896417)
    })
  })
})
