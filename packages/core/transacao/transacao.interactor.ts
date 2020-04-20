import { TransferenciaResponse } from './dto/transacao.response';
import { TransferenciaRequest } from './dto/transacao.request';
import { TransacaoRepository } from './transacao.repository';
import { ContaRepository } from '../conta/conta.repository';
import { AgendamentoTransacaoRepository } from './agendamento/agendamento.repository';
import '../utils/date';

export class AgendamentoDateError extends Error {}
export class ContaOrigemError extends Error {}
export class ContaDestinoError extends Error {}
export class SaldoInsuficienteError extends Error {}

export class TransacaoInteractor {
  constructor(
    private readonly agendamentoTransferenciaRepository: AgendamentoTransacaoRepository,
    private readonly transacaoRepository: TransacaoRepository,
    private readonly contaRepository: ContaRepository,
  ) {}

  async transferir(
    transferencia: TransferenciaRequest,
  ): Promise<TransferenciaResponse> {
    const { origem, destino, valor, compensaEm } = transferencia;
    const now = new Date(Date.now());

    if (compensaEm && new Date(compensaEm).isBefore(now)) {
      throw new AgendamentoDateError(
        `Agendamento para a data "${compensaEm}" inválido`,
      );
    }

    const contaOrigem = await this.contaRepository.findOne({ numero: origem });

    if (!contaOrigem) {
      throw new ContaOrigemError(`Conta de origem "${origem}" não existe`);
    }

    if (contaOrigem.saldo < valor) {
      throw new SaldoInsuficienteError(
        `Conta de origem "${origem}" não possui saldo suficiente`,
      );
    }

    const contaDestino = await this.contaRepository.findOne({
      numero: destino,
    });

    if (!contaDestino) {
      throw new ContaDestinoError(`Conta de destino "${destino}" não existe`);
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

    let compensacaoDate: Date = now;

    if (now.isBefore(inicioExpediente)) {
      compensacaoDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        0,
        0,
        0,
      );
    } else if (now.isAfter(finalExpediente)) {
      compensacaoDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        11,
        0,
        0,
        0,
      );
    }

    if (now.isEqual(compensacaoDate)) {
      const transacao = await this.transacaoRepository.save({
        origem,
        destino,
        valor,
      });

      contaOrigem.saldo -= valor;
      contaDestino.saldo += valor;

      await this.contaRepository.save(contaOrigem);
      await this.contaRepository.save(contaDestino);

      return {
        origem: transacao.origem,
        destino: transacao.destino,
        valor: transacao.valor,
        createdAt: transacao.createdAt,
      };
    } else {
      const {
        origem,
        destino,
        valor,
        compensaEm,
        createdAt,
      } = await this.agendamentoTransferenciaRepository.save({
        ...transferencia,
        compensaEm: compensacaoDate.toISOString(),
        origem: contaOrigem.numero,
        destino: contaDestino.numero,
      });

      return {
        origem,
        destino,
        valor,
        compensaEm,
        createdAt,
      };
    }
  }
}
