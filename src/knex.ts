import knex from 'knex';

const db = knex({
  client: 'mysql',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 7 },
});

export default db;
