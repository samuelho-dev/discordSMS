import { Client } from 'discord.js';
import config from '../config';
import * as commandModules from '~/commands';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

const commands = Object(commandModules);

client.once('ready', () => {
  console.log('🤖 Bot is ready.');
});

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
  // twilioClient.messages
  //   .create({
  //     body: smsMessage,
  //     from: config.TWILIO_PHONE_NUMBER,
  //     to: subscriber.phoneNumber,
  //   })
  // }
});

client.login(config.DISCORD_TOKEN);
