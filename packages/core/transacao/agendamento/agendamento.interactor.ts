import { AgendamentoTransacaoRepository } from './agendamento.repository';
import { TransacaoRepository } from '../transacao.repository';
import { TransacaoInteractor } from '../transacao.interactor';

export class AgendamentoTransacaoInteractor {
  constructor(
    private readonly agentedamentoTransferenciaRepository: AgendamentoTransacaoRepository,
    private readonly transacaoRepository: TransacaoRepository,
    private readonly transacaoInteractor: TransacaoInteractor,
  ) {}

  async consolidar(intervalo: Date.Interval): Promise<void> {
    const agendamentos = await this.agentedamentoTransferenciaRepository.findByInterval(
      intervalo,
    );

    await Promise.all(
      agendamentos.map((agendamento) =>
        this.transacaoInteractor.transferir(agendamento),
      ),
    );

    await Promise.all(
      agendamentos.map(({ id }) =>
        this.agentedamentoTransferenciaRepository.delete(id),
      ),
    );
  }
}
