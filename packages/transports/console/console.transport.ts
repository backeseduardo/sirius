import { TransacaoInteractor } from '../../core/transacao/transacao.interactor';
import { TransferenciaRequest } from '../../core/transacao/dto/TransferenciaRequest';
import { Conta } from '../../core/conta/conta.entity';
import {
  MemoryTransacaoDataSource,
  MemoryContaDataSource,
  MemoryAgendamentoTransacaoDataSource,
} from '../../data-sources/memory';

export async function main() {
  const memoryTransacaoDataSource = new MemoryTransacaoDataSource();
  const memoryContaDataSource = new MemoryContaDataSource();
  const memoryAgendamentoTransacaoDataSource = new MemoryAgendamentoTransacaoDataSource();
  const transacaoInteractor = new TransacaoInteractor(
    memoryAgendamentoTransacaoDataSource,
    memoryTransacaoDataSource,
    memoryContaDataSource,
  );

  const contaOrigemMock: Partial<Conta> = {
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

  const contaDestinoMock: Partial<Conta> = {
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

  await memoryContaDataSource.save(contaOrigemMock);
  await memoryContaDataSource.save(contaDestinoMock);

  const transferencia: TransferenciaRequest = {
    origem: '202004000001',
    destino: '202004000002',
    valor: 100,
  };

  const transacao = await transacaoInteractor.transferir(transferencia);

  console.log('\n# Requisição de Trasação\n');
  console.log(transacao);

  console.log('\n# Tabela Transações\n');
  console.table(memoryTransacaoDataSource.transacoes);

  const hojeISODate = new Date().toISODateString();
  console.log(`\n# Transações no dia ${hojeISODate}\n`);
  console.table(await memoryTransacaoDataSource.findByDate(hojeISODate));

  console.log('\n# Tabela Contas\n');
  console.table(memoryContaDataSource.contas);
}
