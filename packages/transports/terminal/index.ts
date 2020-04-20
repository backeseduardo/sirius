import '../../core/utils/date';
import { TransferenciaRequest } from '../../core/transacao';
import { Conta } from '../../core/conta';
import sirius from '../../adapters/console';
import { DeepPartial } from '../../core/utils/deep-partial.type';

export async function main() {
  const {
    contaRepository,
    transacaoRepository,
    transacaoInteractor,
  } = sirius();

  const contaOrigemMock: DeepPartial<Conta> = {
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

  const contaDestinoMock: DeepPartial<Conta> = {
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

  await contaRepository.save(contaOrigemMock);
  await contaRepository.save(contaDestinoMock);

  const transferencia: TransferenciaRequest = {
    origem: '202004000001',
    destino: '202004000002',
    valor: 100,
  };

  const transacao = await transacaoInteractor.transferir(transferencia);

  console.log('\n# Requisição de Trasação\n');
  console.log(transacao);

  console.log('\n# Tabela Transações\n');
  console.table(transacaoRepository.transacoes);

  const hojeISODate = new Date().toISODateString();
  console.log(`\n# Transações no dia ${hojeISODate}\n`);
  console.table(await transacaoRepository.find({ createdAt: hojeISODate }));

  console.log('\n# Tabela Contas\n');
  console.table(contaRepository.contas);
}

main();
