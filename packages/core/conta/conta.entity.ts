import { Titular } from '../titular/titular.entity';

export class Conta {
  id!: string;
  saldo!: number;
  dataAbertura!: string;
  titular!: Titular;
  /**
   * Formato: {YYYY}{MM}{000000}
   *
   * YYYY = ano
   *
   * MM = mês
   *
   * 000000 = 6 dígitos, sequencial
   */
  numero!: string;
  createdAt!: string;
}
