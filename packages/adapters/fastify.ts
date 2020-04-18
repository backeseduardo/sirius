import fastifyPlugin from 'fastify-plugin';
import {
  ContaRepository,
  TransacaoInteractor,
  TransacaoRepository,
  AgendamentoTransacaoRepository,
} from '../core';
import {
  MemoryAgendamentoTransacaoDataSource,
  MemoryTransacaoDataSource,
  MemoryContaDataSource,
} from '../data-sources/memory';

declare module 'fastify' {
  interface FastifyRequest {
    sirius: {
      // Repositories
      contaRepository: ContaRepository;
      agendamentoTransacaoRepository: AgendamentoTransacaoRepository;
      transacaoRepository: TransacaoRepository;
      // Interactors
      transacaoInteractor: TransacaoInteractor;
    };
  }
}

export default fastifyPlugin(async (server, opts, done) => {
  // Repositories
  const agendamentoTransacaoRepository = new MemoryAgendamentoTransacaoDataSource();
  const transacaoRepository = new MemoryTransacaoDataSource();
  const contaRepository = new MemoryContaDataSource();

  // Interactors
  const transacaoInteractor = new TransacaoInteractor(
    agendamentoTransacaoRepository,
    transacaoRepository,
    contaRepository,
  );

  server.decorateRequest('sirius', {
    contaRepository,
    transacaoRepository,
    agendamentoTransacaoRepository,
    transacaoInteractor,
  });

  // Fixtures
  await contaRepository.save({
    numero: '123',
    titular: {
      id: '123',
      cpf: '00000000000',
      dataNascimento: 'não sei',
      email: 'batepapouol',
      nome: 'zézim',
    },
    saldo: 1000,
    dataAbertura: '2020-02-01',
    createdAt: '2020-02-01',
  });

  await contaRepository.save({
    numero: '321',
    titular: {
      id: '432',
      cpf: '00000000000',
      dataNascimento: 'não sei',
      email: 'adsasdasd',
      nome: 'asdasdad',
    },
    saldo: 1000,
    dataAbertura: '2020-02-01',
    createdAt: '2020-02-01',
  });

  server.log.info('Sirius core loaded');

  done();
});
