import { Conta } from './conta.entity';
import { CustomError } from '../utils/custom.error';

export class ContaInvalidaError extends CustomError {}

export interface ContaRepository {
  findById(id: string): Promise<Conta | undefined>;

  findByNumero(numero: string): Promise<Conta | undefined>;

  save(conta: Conta): Promise<Conta>;
}
