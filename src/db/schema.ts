declare module 'knex/types/tables' {
  interface Guild {
    id: number;
    guild_id: string;
    guild_name: string;
    phone_number: string | null;
    sms_tag: string;
    tagline: string;
    updated_at: Date;
    created_at: Date;
  }
  interface Member {
    id: number;
    guild_id: string;
    phone_number: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  interface Message {
    id: number;
    guild_id: string;
    message: string;
    sent_at: Date;
  }
}
