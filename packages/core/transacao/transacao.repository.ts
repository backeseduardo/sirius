import { Transacao } from './transacao.entity';
import { CustomError } from '../utils/custom.error';

export class TransacaoInvalidaError extends CustomError {}

export interface TransacaoRepository {
  findById: (id: string) => Promise<Transacao | undefined>;

  findByDate: (date: string) => Promise<Transacao[] | undefined>;

  save: (transacao: Partial<Transacao>) => Promise<Transacao>;
}
