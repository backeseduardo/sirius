import {
  Conta,
  ContaRepository,
  ContaInvalidaError,
} from '../../../core/conta';
import { FindConditions } from '../../../core/utils/repository';
import { DeepPartial } from '../../../core/utils/deep-partial.type';

export class MemoryContaDataSource implements ContaRepository {
  contas: Conta[] = [];

  private filterByConditions(conditions?: FindConditions<Conta>) {
    return function (conta: Conta): boolean {
      let cond = true;

      if (conditions?.id) {
        cond = cond && conta.id === conditions.id;
      }

      if (conditions?.numero) {
        cond = cond && conta.numero === conditions.numero;
      }

      if (conditions?.saldo) {
        cond = cond && conta.saldo === conditions.saldo;
      }

      if (conditions?.dataAbertura) {
        const dataAbertura = new Date(conta.dataAbertura).toObject();
        const { year, month, day } = new Date(
          conditions.dataAbertura,
        ).toObject();

        cond =
          cond &&
          dataAbertura.year === year &&
          dataAbertura.month === month &&
          dataAbertura.day === day;
      }

      if (conditions?.createdAt) {
        const createdAt = new Date(conta.createdAt).toObject();
        const { year, month, day } = new Date(conditions.createdAt).toObject();

        cond =
          cond &&
          createdAt.year === year &&
          createdAt.month === month &&
          createdAt.day === day;
      }

      if (conditions?.titular?.id) {
        cond = cond && conta.titular.id === conditions.titular.id;
      }

      return cond;
    };
  }

  async find(conditions?: FindConditions<Conta>): Promise<Conta[]> {
    return this.contas.filter(this.filterByConditions(conditions));
  }

  async findOne(
    conditions?: FindConditions<Conta>,
  ): Promise<Conta | undefined> {
    return this.contas.find(this.filterByConditions(conditions));
  }

  async save(conta: DeepPartial<Conta>): Promise<Conta> {
    if (conta.id) {
      let contaExistente = await this.findOne({ id: conta.id });

      if (!contaExistente) {
        throw new ContaInvalidaError(`conta com id "${conta.id}" inválida`);
      }

      contaExistente = conta as Conta;

      return contaExistente;
    }

    conta.id = new Date().getTime().toString();
    conta.createdAt = new Date().toISOString();

    this.contas.push(conta as Conta);

    return conta as Conta;
  }

  async delete(id: string): Promise<void> {
    this.contas = this.contas.filter((conta) => conta.id !== id);
  }
}
