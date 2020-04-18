import {
  Transacao,
  TransacaoRepository,
  TransacaoInvalidaError,
} from '../../../core/transacao';
import '../../../core/utils/date';

export class MemoryTransacaoDataSource implements TransacaoRepository {
  transacoes: Transacao[] = [];

  async find(): Promise<Transacao[]> {
    return Promise.resolve(this.transacoes);
  }

  async findById(id: string): Promise<Transacao | undefined> {
    const transacao = this.transacoes.find((transacao) => transacao.id === id);

    return Promise.resolve(transacao);
  }

  async findByDate(date: string): Promise<Transacao[] | undefined> {
    const queryDate = new Date(date).toObject();

    const resultado = this.transacoes.filter((transacao) => {
      const transacaoDate = new Date(transacao.createdAt).toObject();

      return (
        transacaoDate.year === queryDate.year &&
        transacaoDate.month === queryDate.month &&
        transacaoDate.day === queryDate.day
      );
    });

    return Promise.resolve(resultado);
  }

  async save(transacao: Partial<Transacao>): Promise<Transacao> {
    if (transacao.id) {
      let transacaoExistente = await this.findById(transacao.id);

      if (!transacaoExistente) {
        throw new TransacaoInvalidaError(
          `transação com id "${transacao.id}" inválida`,
        );
      }

      transacaoExistente = transacao as Transacao;

      return Promise.resolve(transacaoExistente);
    }

    transacao.id = new Date().getTime().toString();
    transacao.createdAt = new Date().toISOString();

    this.transacoes.push(transacao as Transacao);

    return Promise.resolve(transacao as Transacao);
  }
}