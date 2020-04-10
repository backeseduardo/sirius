import { Transacao } from '../transacao.entity';

export class TransferenciaResponse {
  id: string;
  origem: string;
  destino: string;
  valor: number;
  compensaEm: string;
  createdAt: string;

  constructor(transacao: Transacao) {
    this.id = transacao.id;
    this.origem = transacao.origem;
    this.destino = transacao.destino;
    this.valor = transacao.valor;
    this.compensaEm = transacao.compensaEm;
    this.createdAt = transacao.createdAt;
  }
}
