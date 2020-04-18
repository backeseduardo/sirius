import {
  Conta,
  ContaRepository,
  ContaInvalidaError,
} from '../../../core/conta';
import { Titular } from '../../../core';

export class MemoryContaDataSource implements ContaRepository {
  contas: Conta[] = [];

  async findById(id: string): Promise<Conta | undefined> {
    const conta = this.contas.find((conta) => conta.id === id);

    return Promise.resolve(conta);
  }

  async findByNumero(numero: string): Promise<Conta | undefined> {
    const conta = this.contas.find((conta) => conta.numero === numero);

    return Promise.resolve(conta);
  }

  async save(conta: Partial<Conta>): Promise<Conta> {
    if (conta.id) {
      let contaExistente = await this.findById(conta.id);

      if (!contaExistente) {
        throw new ContaInvalidaError(`conta com id "${conta.id}" inválida`);
      }

      contaExistente = conta as Conta;

      return Promise.resolve(contaExistente);
    }

    conta.id = new Date().getTime().toString();
    conta.createdAt = new Date().toISOString();

    this.contas.push(conta as Conta);

    return Promise.resolve(conta as Conta);
  }
}
