import { Transacao } from '../../core/transacao/transacao.entity';
import { TransacaoRepository } from '../../core/transacao/transacao.repository';

export class MemoryTransacaoAdapter implements TransacaoRepository {
  transacoes: Transacao[] = [];

  save(transacao: Transacao): Transacao {
    transacao.id = new Date().getTime().toString();

    this.transacoes.push(transacao);

    return transacao;
  }
}
