import { TransferenciaResponse } from './dto/TransferenciaResponse';
import { TransferenciaRequest } from './dto/TransferenciaRequest';
import { TransacaoRepository } from './transacao.repository';
import { Transacao } from './transacao.entity';

export default class TransacaoService {
  constructor(private readonly repository: TransacaoRepository) {}

  transferir(
    transferencia: TransferenciaRequest,
  ): TransferenciaResponse | undefined {
    const { origem, destino, valor } = transferencia;
    const now = new Date(Date.now());

    const inicioExpediente = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      11,
      0,
      0,
      0,
    );

    const finalExpediente = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      20,
      0,
      0,
      0,
    );

    let createdAt: string = now.toISOString();
    let compensaEm: string = now.toISOString();

    if (now.getTime() < inicioExpediente.getTime()) {
      compensaEm = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        0,
        0,
        0,
      ).toISOString();
    } else if (now.getTime() > finalExpediente.getTime()) {
      compensaEm = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        11,
        0,
        0,
        0,
      ).toISOString();
    }

    let transacao = new Transacao();
    transacao.origem = origem;
    transacao.destino = destino;
    transacao.valor = valor;
    transacao.compensaEm = compensaEm;
    transacao.createdAt = createdAt;

    transacao = this.repository.save(transacao);

    return new TransferenciaResponse(transacao);
  }
}
