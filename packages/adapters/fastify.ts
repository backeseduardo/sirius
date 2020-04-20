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

  server.log.info('Sirius core loaded');

  done();
});
