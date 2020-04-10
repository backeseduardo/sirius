import { Titular } from './titular.entity';

export interface TitularRepository {
  findById(id: string): Promise<Titular>;

  findByCPF(cpf: string): Promise<Titular>;

  save(titular: Titular): Promise<Titular>;
}
