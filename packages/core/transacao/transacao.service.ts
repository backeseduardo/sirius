import { TransferenciaResponse } from './dto/TransferenciaResponse';
import { TransferenciaRequest } from './dto/TransferenciaRequest';
import { TransacaoRepository } from './transacao.repository';
import { Transacao } from './transacao.entity';
import { ContaRepository } from '../conta/conta.repository';

export default class TransacaoService {
  constructor(
    private readonly transacaoRepository: TransacaoRepository,
    private readonly contaRepository: ContaRepository,
  ) {}

  async transferir(
    transferencia: TransferenciaRequest,
  ): Promise<TransferenciaResponse | undefined> {
    const { origem, destino, valor } = transferencia;
    const now = new Date(Date.now());

    const contaOrigem = await this.contaRepository.findByNumero(origem);

    if (!contaOrigem) {
      throw new Error(`Conta de origem "${origem}" não existe`);
    }

    if (contaOrigem.saldo < valor) {
      throw new Error(
        `Conta de origem "${origem}" não possui saldo suficiente`,
      );
    }

    const contaDestino = await this.contaRepository.findByNumero(destino);

    if (!contaDestino) {
      throw new Error(`Conta de destino "${destino}" não existe`);
    }

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
    let compensaEm: Date = now;

    if (now.getTime() < inicioExpediente.getTime()) {
      compensaEm = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        0,
        0,
        0,
      );
    } else if (now.getTime() > finalExpediente.getTime()) {
      compensaEm = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        11,
        0,
        0,
        0,
      );
    }

    let transacao = new Transacao();
    transacao.origem = origem;
    transacao.destino = destino;
    transacao.valor = valor;
    transacao.compensaEm = compensaEm.toISOString();
    transacao.createdAt = createdAt;

    transacao = await this.transacaoRepository.save(transacao);

    if (compensaEm.getTime() === now.getTime()) {
      contaOrigem.saldo -= valor;
      contaDestino.saldo += valor;

      await this.contaRepository.save(contaOrigem);
      await this.contaRepository.save(contaDestino);
    }

    return new TransferenciaResponse(transacao);
  }
}
