import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  DATABASE_URL,
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
} = process.env;

if (
  !TWILIO_ACCOUNT_SID ||
  !TWILIO_AUTH_TOKEN ||
  !TWILIO_PHONE_NUMBER ||
  !DATABASE_URL ||
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !DISCORD_GUILD_ID
) {
  throw new Error('Missing environment variables.');
}

const config: Record<string, string> = {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  DATABASE_URL,
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
};

export default config;
