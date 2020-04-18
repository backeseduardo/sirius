import fastify from 'fastify';
import sirius from '../../adapters/fastify';
import TransactionRoute from './routes/transacao.route';

const server = fastify({
  logger: {
    level: 'info',
    prettyPrint: {
      levelFirst: true,
      translateTime: true,
    },
  },
});

server.register(sirius);
server.register(TransactionRoute, { prefix: '/transacao' });

// Run the server!
server.listen(3000, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
