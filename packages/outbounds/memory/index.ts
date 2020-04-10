import { Transacao } from '../../core/transacao/transacao.entity';
import { TransacaoRepository } from '../../core/transacao/transacao.repository';
import { ContaRepository } from '../../core/conta/conta.repository';
import { Conta } from '../../core/conta/conta.entity';

export class MemoryTransacaoAdapter implements TransacaoRepository {
  transacoes: Transacao[] = [];

  save(transacao: Transacao): Promise<Transacao> {
    transacao.id = new Date().getTime().toString();

    this.transacoes.push(transacao);

    return Promise.resolve(transacao);
  }
}

export class MemoryContaAdapter implements ContaRepository {
  contas: Conta[] = [];

  async findById(id: string): Promise<Conta | undefined> {
    const conta = this.contas.find((conta) => conta.id === id);

    return Promise.resolve(conta);
  }

  async findByNumero(numero: string): Promise<Conta | undefined> {
    return this.contas.find((conta) => conta.numero === numero);
  }

  async save(conta: Conta): Promise<Conta> {
    let contaExistente = await this.findById(conta.id);

    if (!contaExistente) {
      conta.id = new Date().getTime().toString();
      this.contas.push(conta);

      return Promise.resolve(conta);
    }

    contaExistente = conta;
    return Promise.resolve(contaExistente);
  }
}
