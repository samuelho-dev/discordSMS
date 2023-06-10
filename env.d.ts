declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_APPLICATION_ID: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_PHONE_NUMBER: string;
    PUBLIC_KEY: string;
    PORT: string;
    DATABASE_URL: string;
    PLANETSCALE_USERNAME: string;
    PLANETSCALE_PASSWORD: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_CLIENT_ID: string;
  }
}
