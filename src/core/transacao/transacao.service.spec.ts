import TransacaoService from './transacao.service';
import { TransacaoRepository } from './transacao.repository';
import { Transacao } from './transacao.entity';

class RepositoryMock implements TransacaoRepository {
  save(transacao: Transacao): Transacao {
    return { id: 'uuid', ...transacao };
  }
}

describe('Transacao Service', () => {
  describe('.transferir()', () => {
    it('deve compensar no ato', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() =>
          new Date('2020-04-09T19:00:00.000Z').valueOf(),
        );

      const service = new TransacaoService(new RepositoryMock());

      const transferencia = service.transferir({
        origem: 'Conta Albino',
        destino: 'Conta Backes',
        valor: 1000,
      });

      expect(transferencia).toMatchObject({
        id: 'uuid',
        origem: 'Conta Albino',
        destino: 'Conta Backes',
        valor: 1000,
        compensaEm: new Date(Date.now()).toISOString(),
        createdAt: new Date(Date.now()).toISOString(),
      });
    });

    it('deve compensar no dia', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() =>
          new Date('2020-04-09T09:00:00.000Z').valueOf(),
        );

      const service = new TransacaoService(new RepositoryMock());

      const transferencia = service.transferir({
        origem: 'Conta Albino',
        destino: 'Conta Backes',
        valor: 1000,
      });

      expect(transferencia).toMatchObject({
        id: 'uuid',
        origem: 'Conta Albino',
        destino: 'Conta Backes',
        valor: 1000,
        compensaEm: '2020-04-09T11:00:00.000Z',
        createdAt: new Date(Date.now()).toISOString(),
      });
    });

    it('deve compensar no dia seguinte', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() =>
          new Date('2020-04-09T21:00:00.000Z').valueOf(),
        );

      const service = new TransacaoService(new RepositoryMock());

      const transferencia = service.transferir({
        origem: 'Conta Albino',
        destino: 'Conta Backes',
        valor: 1000,
      });

      expect(transferencia).toMatchObject({
        id: 'uuid',
        origem: 'Conta Albino',
        destino: 'Conta Backes',
        valor: 1000,
        compensaEm: '2020-04-10T11:00:00.000Z',
        createdAt: new Date(Date.now()).toISOString(),
      });
    });
  });
});
