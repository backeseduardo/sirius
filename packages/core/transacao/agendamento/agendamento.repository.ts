import { AgendamentoTransacao } from './agendamento.entity';
import { CustomError } from '../../utils/custom.error';

export class AgendamentoTransacaoInvalidoError extends CustomError {}

export interface AgendamentoTransacaoRepository {
  findById(id: string): Promise<AgendamentoTransacao | undefined>;

  findByInterval(intervalo: Date.Interval): Promise<AgendamentoTransacao[]>;

  save(
    agendamento: Partial<AgendamentoTransacao>,
  ): Promise<AgendamentoTransacao>;

  delete(id: string): Promise<void>;
}
