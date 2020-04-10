import { Transacao } from './transacao.entity';

export interface TransacaoRepository {
  save: (transacao: Transacao) => Promise<Transacao>;
}
