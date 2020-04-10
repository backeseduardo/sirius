import TransacaoService from '../../core/transacao/transacao.service';
import {
  MemoryTransacaoAdapter,
  MemoryContaAdapter,
} from '../../outbounds/memory';
import { TransferenciaRequest } from '../../core/transacao/dto/TransferenciaRequest';
import { Conta } from '../../core/conta/conta.entity';

async function bootstrap() {
  const memoryTransacaoAdapter = new MemoryTransacaoAdapter();
  const memoryContaAdapter = new MemoryContaAdapter();
  const transacaoService = new TransacaoService(
    memoryTransacaoAdapter,
    memoryContaAdapter,
  );

  const contaOrigemMock: Conta = {
    id: 'uuid-1',
    numero: '202004000001',
    dataAbertura: '2020-04-10',
    saldo: 150,
    titular: {
      id: 'uuid-1',
      cpf: '0000000000',
      dataNascimento: '1990-01-01',
      email: 'titular-origem@fake.com',
      nome: 'Titular Origem',
    },
  };

  const contaDestinoMock: Conta = {
    id: 'uuid-2',
    numero: '202004000002',
    dataAbertura: '2020-04-10',
    saldo: 150,
    titular: {
      id: 'uuid-2',
      cpf: '0000000000',
      dataNascimento: '1990-01-01',
      email: 'titular-destino@fake.com',
      nome: 'Titular Destino',
    },
  };

  await memoryContaAdapter.save(contaOrigemMock);
  await memoryContaAdapter.save(contaDestinoMock);

  const transferencia: TransferenciaRequest = {
    origem: '202004000001',
    destino: '202004000002',
    valor: 100,
  };

  const transacao = await transacaoService.transferir(transferencia);

  console.log('\n# Requisição de Trasação\n');
  console.log(transacao);

  console.log('\n# Tabela Transações\n');
  console.table(memoryTransacaoAdapter.transacoes);

  console.log('\n# Tabela Contas\n');
  console.table(memoryContaAdapter.contas);
}

bootstrap();
