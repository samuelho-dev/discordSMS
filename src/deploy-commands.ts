import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import config from './config';
const { DISCORD_TOKEN, DISCORD_GUILD_ID, DISCORD_CLIENT_ID } = config;
import * as commandModules from '~/commands';

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  new SlashCommandBuilder()
    .setName('sendSMS')
    .setDescription('Send an SMS to a group.'),
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN!);

rest
  .put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID!, DISCORD_GUILD_ID!), {
    body: commands,
  })
  .then(() => console.log('Added Commands! 🔥'))
  .catch(console.error);
