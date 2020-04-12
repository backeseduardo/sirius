import { Titular } from './titular.entity';
import { CustomError } from '../utils/custom.error';

export class TitularInvalidoError extends CustomError {}

export interface TitularRepository {
  findById(id: string): Promise<Titular>;

  findByCPF(cpf: string): Promise<Titular>;

  save(titular: Titular): Promise<Titular>;
}
