import {
  AgendamentoTransacao,
  AgendamentoTransacaoRepository,
  AgendamentoTransacaoInvalidoError,
} from '../../../core/transacao';
import '../../../core/utils/date';
import { FindConditions } from '../../../core/utils/repository';

export class MemoryAgendamentoTransacaoDataSource
  implements AgendamentoTransacaoRepository {
  agendamentos: AgendamentoTransacao[] = [];

  private filterByConditions(
    conditions?: FindConditions<AgendamentoTransacao>,
  ) {
    return function (agendamento: AgendamentoTransacao): boolean {
      let cond = true;

      if (conditions?.id) {
        cond = cond && agendamento.id === conditions.id;
      }

      if (conditions?.origem) {
        cond = cond && agendamento.origem === conditions.origem;
      }

      if (conditions?.destino) {
        cond = cond && agendamento.destino === conditions.destino;
      }

      if (conditions?.valor) {
        cond = cond && agendamento.valor === conditions.valor;
      }

      if (conditions?.compensaEm) {
        const compensaEm = new Date(agendamento.compensaEm).toObject();
        const { year, month, day } = new Date(conditions.compensaEm).toObject();

        cond =
          cond &&
          compensaEm.year === year &&
          compensaEm.month === month &&
          compensaEm.day === day;
      }

      if (conditions?.createdAt) {
        const createdAt = new Date(agendamento.createdAt).toObject();
        const { year, month, day } = new Date(conditions.createdAt).toObject();

        cond =
          cond &&
          createdAt.year === year &&
          createdAt.month === month &&
          createdAt.day === day;
      }

      return cond;
    };
  }

  async find(
    conditions?: FindConditions<AgendamentoTransacao>,
  ): Promise<AgendamentoTransacao[]> {
    return this.agendamentos.filter(this.filterByConditions(conditions));
  }

  async findOne(
    conditions?: FindConditions<AgendamentoTransacao>,
  ): Promise<AgendamentoTransacao | undefined> {
    return this.agendamentos.find(this.filterByConditions(conditions));
  }

  async findByInterval(
    intervalo: Date.Interval,
  ): Promise<AgendamentoTransacao[]> {
    const resultado = this.agendamentos.filter((agendamento) =>
      new Date(agendamento.createdAt).isBetween(intervalo),
    );

    return Promise.resolve(resultado);
  }

  async save(
    agendamento: Partial<AgendamentoTransacao>,
  ): Promise<AgendamentoTransacao> {
    if (agendamento.id) {
      let agendamentoExistente = await this.findOne({ id: agendamento.id });

      if (!agendamentoExistente) {
        throw new AgendamentoTransacaoInvalidoError(
          `agendamento de transação com id "${agendamento.id}" inválida`,
        );
      }

      agendamentoExistente = agendamento as AgendamentoTransacao;

      return Promise.resolve(agendamentoExistente);
    }

    agendamento.id = new Date().getTime().toString();
    agendamento.createdAt = new Date().toISOString();

    this.agendamentos.push(agendamento as AgendamentoTransacao);

    return Promise.resolve(agendamento as AgendamentoTransacao);
  }

  async delete(id: string): Promise<void> {
    const list = this.agendamentos.filter(
      (agendamento) => agendamento.id !== id,
    );

    this.agendamentos = list;

    return Promise.resolve();
  }
}
