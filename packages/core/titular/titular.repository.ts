import { Titular } from './titular.entity';
import { CustomError } from '../utils/custom.error';
import { Repository } from '../utils/repository';

export class TitularInvalidoError extends CustomError {}

export interface TitularRepository extends Repository<Titular> {}
