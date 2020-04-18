import { TransacaoInteractor } from '../core/transacao';
import {
  MemoryAgendamentoTransacaoDataSource,
  MemoryTransacaoDataSource,
  MemoryContaDataSource,
} from '../data-sources/memory';

export default function load() {
  const transacaoRepository = new MemoryTransacaoDataSource();
  const contaRepository = new MemoryContaDataSource();
  const agentamentoTransacaoRepository = new MemoryAgendamentoTransacaoDataSource();
  const transacaoInteractor = new TransacaoInteractor(
    agentamentoTransacaoRepository,
    transacaoRepository,
    contaRepository,
  );

  return {
    transacaoRepository,
    contaRepository,
    agentamentoTransacaoRepository,
    transacaoInteractor,
  };
}
