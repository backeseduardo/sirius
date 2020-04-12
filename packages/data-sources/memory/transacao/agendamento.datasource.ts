import {
  AgendamentoTransacaoRepository,
  AgendamentoTransacaoInvalidoError,
} from '../../../core/transacao/agendamento/agendamento.repository';
import { AgendamentoTransacao } from '../../../core/transacao/agendamento/agendamento.entity';
import '../../../core/utils/date';

export class MemoryAgendamentoTransacaoDataSource
  implements AgendamentoTransacaoRepository {
  agendamentos: AgendamentoTransacao[] = [];

  async findById(id: string): Promise<AgendamentoTransacao | undefined> {
    const agendamento = this.agendamentos.find(
      (agendamento) => agendamento.id === id,
    );

    return Promise.resolve(agendamento);
  }

  async save(
    agendamento: Partial<AgendamentoTransacao>,
  ): Promise<AgendamentoTransacao> {
    if (agendamento.id) {
      let agendamentoExistente = await this.findById(agendamento.id);

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

  async findByInterval(
    intervalo: Date.Interval,
  ): Promise<AgendamentoTransacao[]> {
    const resultado = this.agendamentos.filter((agendamento) =>
      new Date(agendamento.createdAt).isBetween(intervalo),
    );

    return Promise.resolve(resultado);
  }

  async delete(id: string): Promise<void> {
    const list = this.agendamentos.filter(
      (agendamento) => agendamento.id !== id,
    );

    this.agendamentos = list;

    return Promise.resolve();
  }
}
