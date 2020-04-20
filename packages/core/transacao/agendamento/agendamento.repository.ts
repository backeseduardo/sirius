import { AgendamentoTransacao } from './agendamento.entity';
import { CustomError } from '../../utils/custom.error';
import { Repository } from '../../utils/repository';

export class AgendamentoTransacaoInvalidoError extends CustomError {}

export interface AgendamentoTransacaoRepository
  extends Repository<AgendamentoTransacao> {
  findByInterval(intervalo: Date.Interval): Promise<AgendamentoTransacao[]>;
}
