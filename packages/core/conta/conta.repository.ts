import { Conta } from './conta.entity';

export interface ContaRepository {
  findById(id: string): Promise<Conta | undefined>;

  findByNumero(numero: string): Promise<Conta | undefined>;

  save(conta: Conta): Promise<Conta>;
}
