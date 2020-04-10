import TransacaoService from '../../core/transacao/transacao.service';
import { MemoryTransacaoAdapter } from '../../outbounds/memory';
import { TransferenciaRequest } from '../../core/transacao/dto/TransferenciaRequest';

const memoryTransacaoAdapter = new MemoryTransacaoAdapter();
const transacaoService = new TransacaoService(memoryTransacaoAdapter);

const transferencia: TransferenciaRequest = {
  origem: 'Conta Albino',
  destino: 'Conta Backes',
  valor: 1000,
};

const transacao = transacaoService.transferir(transferencia);

console.log('\n# Requisição de Trasação\n');
console.log(transacao);

console.log('\n# Tabela Transações\n');
console.table(memoryTransacaoAdapter.transacoes);
