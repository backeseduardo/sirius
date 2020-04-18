import { AgendamentoTransacaoInteractor } from './agendamento.interactor';
import { AgendamentoTransacaoRepository } from './agendamento.repository';
import { AgendamentoTransacao } from './agendamento.entity';
import { TransacaoRepository } from '../transacao.repository';
import { TransacaoInteractor } from '../transacao.interactor';

const agendamentoTransacaoRepositoryMock = {
  findById: jest.fn(),
  findByInterval: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const transacaoRepositoryMock = {
  find: jest.fn(),
  findById: jest.fn(),
  findByDate: jest.fn(),
  save: jest.fn(),
};

const transacaoInteractorMock = {
  transferir: jest.fn(),
};

describe('AgendamentoTransacaoInterector', () => {
  let agendamentoTransacaoInteractor: AgendamentoTransacaoInteractor;

  beforeEach(() => {
    agendamentoTransacaoInteractor = new AgendamentoTransacaoInteractor(
      agendamentoTransacaoRepositoryMock as AgendamentoTransacaoRepository,
      transacaoRepositoryMock as TransacaoRepository,
      (transacaoInteractorMock as unknown) as TransacaoInteractor,
    );
  });

  describe('.consolidarTransacoes(intervalo)', () => {
    it('deve consolidar todos os agendamentos dentro do intervalo informado', async () => {
      const mockAgendamento1: AgendamentoTransacao = {
        id: 'uuid-1',
        origem: '2020040000001',
        destino: '2020040000002',
        valor: 10,
        compensaEm: '2020-01-01T01:01:01.000Z',
        createdAt: '2020-01-01T01:01:01.000Z',
      };

      const mockAgendamento2: AgendamentoTransacao = {
        id: 'uuid-2',
        origem: '2020040000001',
        destino: '2020040000002',
        valor: 10,
        compensaEm: '2020-01-01T01:01:01.000Z',
        createdAt: '2020-01-01T01:01:01.000Z',
      };

      agendamentoTransacaoRepositoryMock.findByInterval.mockResolvedValue([
        mockAgendamento1,
        mockAgendamento2,
      ]);

      const intervalo: Date.Interval = [
        new Date('2020-01-01T00:00:00.000Z'),
        new Date('2020-01-01T23:59:59.999Z'),
      ];

      await agendamentoTransacaoInteractor.consolidar(intervalo);

      expect(agendamentoTransacaoRepositoryMock.findByInterval).toBeCalledWith(
        intervalo,
      );

      expect(transacaoInteractorMock.transferir).toHaveBeenNthCalledWith(
        1,
        mockAgendamento1,
      );
      expect(transacaoInteractorMock.transferir).toHaveBeenNthCalledWith(
        2,
        mockAgendamento2,
      );
      expect(agendamentoTransacaoRepositoryMock.delete).toHaveBeenNthCalledWith(
        1,
        mockAgendamento1.id,
      );
      expect(agendamentoTransacaoRepositoryMock.delete).toHaveBeenNthCalledWith(
        2,
        mockAgendamento2.id,
      );
    });
  });
});
