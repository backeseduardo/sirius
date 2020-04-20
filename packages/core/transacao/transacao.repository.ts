import { Transacao } from './transacao.entity';
import { CustomError } from '../utils/custom.error';
import { Repository } from '../utils/repository';

export class TransacaoInvalidaError extends CustomError {}

export interface TransacaoRepository extends Repository<Transacao> {}
