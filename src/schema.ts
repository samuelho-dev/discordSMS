import db from './knex';

declare module 'knex/types/tables' {
  interface Member {
    id: number;
    guild_id: string;
    phone_number: string;
    created_at: string;
    active: boolean;
    updated_at: string;
  }
}

db.schema.createTableIfNotExists('members', (table) => {
  table.increments('id');
  table.string('guild_id');
  table.string('phone_number');
  table.dateTime('created_at').defaultTo(new Date());
  table.dateTime('updated_at').defaultTo(new Date());
});
