# Sirius

[![codecov](https://codecov.io/gh/matheusalbino/sirius/branch/master/graph/badge.svg)](https://codecov.io/gh/matheusalbino/sirius)

## Objetivo:

Gateway de Pagamentos

## Dia 1

- Transacionar valores de A para B e vice-versa.
- Transações feitas das 8 as 17 horas são compensadas no ato.
- Transações antes das 8 horas são compensadas depois das 8 horas (mesmo dia).
- Trasanções após as 17 horas são consolidadas no próximo dia útil.

## Dia 2

- Implementar sistema de contas e seus titulares.
- A conta possui:
  - Saldo
  - Data de abertura
  - Titular
  - Identificador
- Titular possui:
  - Nome
  - Data de nascimento
  - CPF
  - Email
- Transação só pode ocorrer se a conta de origem possuir saldo suficiente.
- A transação só pode ocorrer se a conta de destino existir.
- Quando a transação for compensada o valor deve ser debitado da conta de origem e creditado na conta de destino.

## Dia 3

- Implementar agendamentos de transação, para compensações futuras

## Dia 4

- Criar uma API Rest com Fastify
- Criar um Adapter para o uso do Core pelo Fastify
