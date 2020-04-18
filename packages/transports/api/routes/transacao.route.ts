import { FastifyInstance, FastifyError } from 'fastify';
import {
  TransferenciaRequest,
  TransferenciaResponse,
} from '../../../core/transacao';

export default function (
  server: FastifyInstance,
  opts: any,
  done: (err?: FastifyError | undefined) => void,
) {
  server.get('/', async (req, reply) => {
    const { transacaoRepository, agendamentoTransacaoRepository } = req.sirius;

    const transacoes = [
      ...(await transacaoRepository.find()),
      ...(await agendamentoTransacaoRepository.find()),
    ];

    reply.send(transacoes);
  });

  server.post('/', async (req, reply) => {
    const { transacaoInteractor } = req.sirius;
    const { origem, destino, valor, compensaEm } = req.body;

    const transferenciaRequest: TransferenciaRequest = {
      origem: origem,
      destino: destino,
      valor: valor,
    };

    if (compensaEm) {
      transferenciaRequest.compensaEm = compensaEm;
    }

    const transferenciaResposne: TransferenciaResponse = await transacaoInteractor.transferir(
      transferenciaRequest,
    );

    reply.send(transferenciaResposne);
  });

  done();
}
