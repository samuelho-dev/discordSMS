"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, DATABASE_URL, DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, } = process.env;
if (!TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN ||
    !TWILIO_PHONE_NUMBER ||
    !DATABASE_URL ||
    !DISCORD_TOKEN ||
    !DISCORD_CLIENT_ID ||
    !DISCORD_GUILD_ID) {
    throw new Error('Missing environment variables.');
}
const config = {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    DATABASE_URL,
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID,
};
exports.default = config;
