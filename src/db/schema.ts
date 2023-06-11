declare module 'knex/types/tables' {
  interface Guild {
    id: number;
    guild_id: string;
    created_at: Date;
  }
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
