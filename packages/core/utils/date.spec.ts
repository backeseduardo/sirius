import './date';

describe('Date', () => {
  describe('.toISODateString()', () => {
    it('deve retornar a data no formato ISO sem as horas', () => {
      expect(new Date('2020-04-10T00:00:00.000Z').toISODateString()).toBe(
        '2020-04-10',
      );
    });
  });

  describe('.toObject()', () => {
    it('deve retornar a data em objeto JSON', () => {
      expect(new Date('2020-04-10T00:00:00.000Z').toObject()).toMatchObject({
        year: 2020,
        month: 3,
        day: 10,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    });
  });

  describe('.isBefore(other)', () => {
    it('deve retornar true, se a data comparada for anterior a data em equestão', () => {
      expect(new Date('2020-04-10').isBefore(new Date())).toBeTruthy();
    });

    it('deve retornar false, se a data comparada for posterior a data em equestão', () => {
      expect(new Date().isBefore(new Date('2020-04-10'))).toBeFalsy();
    });
  });

  describe('.isEqual(other)', () => {
    it('deve retornar true, se a data comparada for igual a data em equestão', () => {
      expect(
        new Date('2020-04-10').isEqual(new Date('2020-04-10')),
      ).toBeTruthy();
    });

    it('deve retornar false, se a data comparada for diferente a data em equestão', () => {
      expect(new Date().isEqual(new Date('2020-04-10'))).toBeFalsy();
    });
  });

  describe('.isAfter(other)', () => {
    it('deve retornar true, se a data comparada for posterior a data em equestão', () => {
      expect(new Date().isAfter(new Date('2020-04-10'))).toBeTruthy();
    });

    it('deve retornar false, se a data comparada for anterior a data em equestão', () => {
      expect(new Date('2020-04-10').isAfter(new Date())).toBeFalsy();
    });
  });

  describe('.isBetween(interval, inclusive)', () => {
    it('deve retornar true, se a data comparada estiver dentro do intervalo', () => {
      expect(
        new Date('2020-04-10').isBetween([
          new Date('2020-04-10'),
          new Date('2020-04-10'),
        ]),
      ).toBeTruthy();
    });

    it('deve retornar false, se a data comparada estiver fora do intervalo', () => {
      expect(
        new Date().isBetween([new Date('2020-04-10'), new Date('2020-04-10')]),
      ).toBeFalsy();
    });
  });

  describe('.isBetween(interval, exclusive)', () => {
    it('deve retornar true, se a data comparada estiver dentro do intervalo', () => {
      expect(
        new Date('2020-04-10T16:00:00.000Z').isBetween(
          [
            new Date('2020-04-10T00:00:00.000Z'),
            new Date('2020-04-10T23:59:59.999Z'),
          ],
          false,
        ),
      ).toBeTruthy();
    });

    it('deve retornar false, se a data comparada estiver fora do intervalo', () => {
      expect(
        new Date().isBetween(
          [new Date('2020-04-10'), new Date('2020-04-10')],
          false,
        ),
      ).toBeFalsy();
    });
  });

  describe('.isBetween(interval, {start: exclusive})', () => {
    it('deve retornar true, se a data comparada estiver dentro do intervalo', () => {
      expect(
        new Date('2020-04-10T16:00:00.000Z').isBetween(
          [
            new Date('2020-04-10T00:00:00.000Z'),
            new Date('2020-04-10T23:59:59.999Z'),
          ],
          { start: false },
        ),
      ).toBeTruthy();
    });

    it('deve retornar false, se a data comparada estiver fora do intervalo', () => {
      expect(
        new Date().isBetween([new Date('2020-04-10'), new Date('2020-04-10')], {
          start: false,
        }),
      ).toBeFalsy();
    });
  });

  describe('.isBetween(interval, {end: exclusive})', () => {
    it('deve retornar true, se a data comparada estiver dentro do intervalo', () => {
      expect(
        new Date('2020-04-10T16:00:00.000Z').isBetween(
          [
            new Date('2020-04-10T00:00:00.000Z'),
            new Date('2020-04-10T23:59:59.999Z'),
          ],
          { end: false },
        ),
      ).toBeTruthy();
    });

    it('deve retornar false, se a data comparada estiver fora do intervalo', () => {
      expect(
        new Date('2020-04-10T16:00:00.000Z').isBetween(
          [
            new Date('2020-04-10T00:00:00.000Z'),
            new Date('2020-04-10T16:00:00.000Z'),
          ],
          { end: false },
        ),
      ).toBeFalsy();
    });
  });
});
