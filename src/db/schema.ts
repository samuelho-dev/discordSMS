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
  interface Message {
    id: number;
    guild_id: string;
    message: string;
    sent_at: string;
  }
}
