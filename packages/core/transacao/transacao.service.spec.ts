import TransacaoService from './transacao.service';
import { TransacaoRepository } from './transacao.repository';
import { ContaRepository } from '../conta/conta.repository';
import { Transacao } from './transacao.entity';
import { Conta } from '../conta/conta.entity';

const transacaoRepositoryMock = {
  save: jest.fn(),
};

const contaRepositoryMock = {
  findById: jest.fn(),
  findByNumero: jest.fn(),
  save: jest.fn(),
};

function defineNow(value: string) {
  jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => new Date(value).valueOf());
}

describe('Transacao Service', () => {
  let service: TransacaoService;

  beforeAll(() => {
    service = new TransacaoService(
      transacaoRepositoryMock as TransacaoRepository,
      contaRepositoryMock as ContaRepository,
    );
  });

  describe('.transferir()', () => {
    beforeAll(() => {
      transacaoRepositoryMock.save.mockImplementation((transacao: Transacao) =>
        Promise.resolve({ id: 'uuid', ...transacao }),
      );
    });

    afterEach(() => {
      contaRepositoryMock.findByNumero.mockReset();
    });

    it('deve compensar no ato', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      contaRepositoryMock.findByNumero.mockResolvedValue({});

      const transferencia = await service.transferir({
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

    it('deve compensar no dia', async () => {
      defineNow('2020-04-09T09:00:00.000Z');

      contaRepositoryMock.findByNumero.mockResolvedValue({});

      const transferencia = await service.transferir({
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

    it('deve compensar no dia seguinte', async () => {
      defineNow('2020-04-09T21:00:00.000Z');

      contaRepositoryMock.findByNumero.mockResolvedValue({});

      const transferencia = await service.transferir({
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

    it('deve retornar uma excessão se a conta de origem não existir', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      contaRepositoryMock.findByNumero.mockResolvedValue(undefined);

      expect(
        service.transferir({
          origem: 'Conta Albino',
          destino: 'Conta Backes',
          valor: 1000,
        }),
      ).rejects.toThrow();
    });

    it('deve retornar uma excessão se a conta de destino não existir', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      contaRepositoryMock.findByNumero.mockImplementation((numero) =>
        Promise.resolve(numero === 'Conta Albino' ? {} : undefined),
      );

      expect(
        service.transferir({
          origem: 'Conta Albino',
          destino: 'Conta Backes',
          valor: 1000,
        }),
      ).rejects.toThrow();
    });

    it('deve retornar uma excessão se a conta de origem não possuir saldo suficiente para a transação', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      const contaOrigemMock: Conta = {
        id: 'uuid-1',
        numero: '202004000001',
        dataAbertura: '2020-04-10',
        saldo: 150,
        titular: {
          id: 'uuid-1',
          cpf: '0000000000',
          dataNascimento: '1990-01-01',
          email: 'titular-origem@fake.com',
          nome: 'Titular Origem',
        },
      };

      contaRepositoryMock.findByNumero.mockImplementation((numero) =>
        Promise.resolve(numero === '202004000001' ? contaOrigemMock : {}),
      );

      expect(
        service.transferir({
          origem: '202004000001',
          destino: '202004000002',
          valor: 1000,
        }),
      ).rejects.toThrow();
    });

    it('deve debitar o saldo transacionado da conta de origem e creditar na conta de destino', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      const contaOrigemMock: Conta = {
        id: 'uuid-1',
        numero: '202004000001',
        dataAbertura: '2020-04-10',
        saldo: 150,
        titular: {
          id: 'uuid-1',
          cpf: '0000000000',
          dataNascimento: '1990-01-01',
          email: 'titular-origem@fake.com',
          nome: 'Titular Origem',
        },
      };

      const contaDestinoMock: Conta = {
        id: 'uuid-2',
        numero: '202004000002',
        dataAbertura: '2020-04-10',
        saldo: 150,
        titular: {
          id: 'uuid-2',
          cpf: '0000000000',
          dataNascimento: '1990-01-01',
          email: 'titular-destino@fake.com',
          nome: 'Titular Destino',
        },
      };

      contaRepositoryMock.findByNumero.mockImplementation((numero) =>
        Promise.resolve(
          [{ ...contaOrigemMock }, { ...contaDestinoMock }].find(
            (conta) => conta.numero === numero,
          ),
        ),
      );

      await service.transferir({
        origem: '202004000001',
        destino: '202004000002',
        valor: 10,
      });

      expect(contaRepositoryMock.save).toHaveBeenNthCalledWith(1, {
        ...contaOrigemMock,
        saldo: contaOrigemMock.saldo - 10,
      });
      expect(contaRepositoryMock.save).toHaveBeenNthCalledWith(2, {
        ...contaDestinoMock,
        saldo: contaDestinoMock.saldo + 10,
      });
    });
  });
});
