import {
  Transacao,
  TransacaoRepository,
  TransacaoInvalidaError,
} from '../../../core/transacao';
import '../../../core/utils/date';
import { FindConditions } from '../../../core/utils/repository';

export class MemoryTransacaoDataSource implements TransacaoRepository {
  transacoes: Transacao[] = [];

  private filterByConditions(conditions?: FindConditions<Transacao>) {
    return function (transacao: Transacao): boolean {
      let cond = true;

      if (conditions?.id) {
        cond = cond && transacao.id === conditions.id;
      }

      if (conditions?.origem) {
        cond = cond && transacao.origem === conditions.origem;
      }

      if (conditions?.destino) {
        cond = cond && transacao.destino === conditions.destino;
      }

      if (conditions?.valor) {
        cond = cond && transacao.valor === conditions.valor;
      }

      if (conditions?.createdAt) {
        const createdAt = new Date(transacao.createdAt).toObject();
        const { year, month, day } = new Date(conditions.createdAt).toObject();

        cond =
          cond &&
          createdAt.year === year &&
          createdAt.month === month &&
          createdAt.day === day;
      }

      return cond;
    };
  }

  async find(conditions?: FindConditions<Transacao>): Promise<Transacao[]> {
    return this.transacoes.filter(this.filterByConditions(conditions));
  }

  async findOne(
    conditions?: FindConditions<Transacao>,
  ): Promise<Transacao | undefined> {
    return this.transacoes.find(this.filterByConditions(conditions));
  }

  async save(transacao: Partial<Transacao>): Promise<Transacao> {
    if (transacao.id) {
      let transacaoExistente = await this.findOne({ id: transacao.id });

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

  async delete(id: string): Promise<void> {
    return;
  }
}
