import {
  ContaRepository,
  ContaInvalidaError,
} from '../../../core/conta/conta.repository';
import { Conta } from '../../../core/conta/conta.entity';

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

    this.contas.push(conta as Conta);

    return Promise.resolve(conta as Conta);
  }
}
