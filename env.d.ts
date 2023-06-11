declare namespace NodeJS {
  export interface ProcessEnv {
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_PHONE_NUMBER: string;
    DATABASE_URL: string;
    DISCORD_TOKEN: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_GUILD_ID: string;
  }
}
