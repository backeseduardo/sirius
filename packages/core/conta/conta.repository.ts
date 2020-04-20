import { Conta } from './conta.entity';
import { CustomError } from '../utils/custom.error';
import { Repository } from '../utils/repository';

export class ContaInvalidaError extends CustomError {}

export interface ContaRepository extends Repository<Conta> {}
