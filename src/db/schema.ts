declare module 'knex/types/tables' {
  interface Member {
    id: number;
    guild_id: string;
    phone_number: string;
    created_at: Date;
    active: boolean;
    updated_at: Date;
  }
  interface Message {
    id: number;
    guild_id: string;
    message: string;
    sent_at: Date;
  }
}
