import {
  TransacaoInteractor,
  AgendamentoDateError,
  ContaDestinoError,
  ContaOrigemError,
  SaldoInsuficienteError,
} from './transacao.interactor';
import { TransacaoRepository } from './transacao.repository';
import { ContaRepository } from '../conta/conta.repository';
import { Transacao } from './transacao.entity';
import { Conta } from '../conta/conta.entity';
import { AgendamentoTransacaoRepository } from './agendamento/agendamento.repository';

const transacaoRepositoryMock = {
  findById: jest.fn(),
  findByDate: jest.fn(),
  save: jest.fn(),
};

const contaRepositoryMock = {
  findById: jest.fn(),
  findByNumero: jest.fn(),
  save: jest.fn(),
};

const agendamentoTransferenciaRepositoryMock = {
  findById: jest.fn(),
  findByInterval: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

function defineNow(value: string) {
  jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => new Date(value).valueOf());
}

describe('Transacao Interactor', () => {
  let transacaoInteractor: TransacaoInteractor;

  beforeEach(() => {
    transacaoInteractor = new TransacaoInteractor(
      agendamentoTransferenciaRepositoryMock as AgendamentoTransacaoRepository,
      transacaoRepositoryMock as TransacaoRepository,
      contaRepositoryMock as ContaRepository,
    );
  });

  describe('.transferir()', () => {
    beforeEach(() => {
      transacaoRepositoryMock.save.mockImplementation((transacao: Transacao) =>
        Promise.resolve({ id: 'uuid', ...transacao }),
      );
    });

    it('deve compensar no ato', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      contaRepositoryMock.findByNumero.mockResolvedValue({});

      const transferencia = await transacaoInteractor.transferir({
        origem: '202004000001',
        destino: '202004000002',
        valor: 1000,
      });

      expect(transferencia).toMatchObject({
        origem: '202004000001',
        destino: '202004000002',
        valor: 1000,
        createdAt: new Date(Date.now()).toISOString(),
      });
    });

    it('deve compensar no dia', async () => {
      defineNow('2020-04-09T09:00:00.000Z');

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

      const resultado = {
        origem: contaOrigemMock.numero,
        destino: contaDestinoMock.numero,
        valor: 10,
        compensaEm: '2020-04-09T11:00:00.000Z',
        createdAt: new Date(Date.now()).toISOString(),
      };

      agendamentoTransferenciaRepositoryMock.save.mockResolvedValue(resultado);

      const transferencia = await transacaoInteractor.transferir({
        origem: '202004000001',
        destino: '202004000002',
        valor: 10,
      });

      expect(transferencia).toMatchObject(resultado);
    });

    it('deve compensar no dia seguinte', async () => {
      defineNow('2020-04-09T21:00:00.000Z');

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

      const resultado = {
        origem: contaOrigemMock,
        destino: contaDestinoMock,
        valor: 10,
        compensaEm: '2020-04-10T11:00:00.000Z',
        createdAt: new Date(Date.now()).toISOString(),
      };

      agendamentoTransferenciaRepositoryMock.save.mockResolvedValue(resultado);

      const transferencia = await transacaoInteractor.transferir({
        origem: '202004000001',
        destino: '202004000002',
        valor: 10,
      });

      expect(transferencia).toMatchObject(resultado);
    });

    it('deve retornar uma excessão se o agendamento for para o passado', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      expect(
        transacaoInteractor.transferir({
          origem: '202004000001',
          destino: '202004000002',
          valor: 1000,
          compensaEm: '2020-04-08T19:00:00.000Z',
        }),
      ).rejects.toThrow(AgendamentoDateError);
    });

    it('deve retornar uma excessão se a conta de origem não existir', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      contaRepositoryMock.findByNumero.mockResolvedValue(undefined);

      expect(
        transacaoInteractor.transferir({
          origem: '202004000001',
          destino: '202004000002',
          valor: 1000,
        }),
      ).rejects.toThrow(ContaOrigemError);
    });

    it('deve retornar uma excessão se a conta de destino não existir', async () => {
      defineNow('2020-04-09T19:00:00.000Z');

      contaRepositoryMock.findByNumero.mockImplementation((numero) =>
        Promise.resolve(numero === '202004000001' ? {} : undefined),
      );

      expect(
        transacaoInteractor.transferir({
          origem: '202004000001',
          destino: '202004000002',
          valor: 1000,
        }),
      ).rejects.toThrow(ContaDestinoError);
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
        transacaoInteractor.transferir({
          origem: '202004000001',
          destino: '202004000002',
          valor: 1000,
        }),
      ).rejects.toThrow(SaldoInsuficienteError);
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

      await transacaoInteractor.transferir({
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
